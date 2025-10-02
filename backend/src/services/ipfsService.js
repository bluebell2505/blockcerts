import axios from "axios";
import puppeteer from "puppeteer";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PINATA_JWT = process.env.PINATA_JWT;

// Generate visual certificate as image
async function generateCertificateImage(metadata) {
  try {
    console.log('   🎨 Generating visual certificate...');

    // Read certificate template
    const templatePath = path.join(__dirname, '../templates/certificate.html');
    let html = fs.readFileSync(templatePath, 'utf8');

    // Replace placeholders with actual data
    html = html.replace(/{{studentName}}/g, metadata.studentName);
    html = html.replace(/{{eventName}}/g, metadata.eventName);
    html = html.replace(/{{eventOrganizer}}/g, metadata.eventOrganizer);
    html = html.replace(/{{eventDate}}/g, new Date(metadata.eventDate).toLocaleDateString());
    html = html.replace(/{{issuedAt}}/g, new Date(metadata.issuedAt).toLocaleDateString());
    html = html.replace(/{{certificateId}}/g, metadata.certificateId);

    // Generate QR code - handle missing txHash gracefully
    let qrCodeData;
    if (metadata.txHash && metadata.txHash !== 'undefined' && !metadata.txHash.includes('undefined')) {
        qrCodeData = `https://amoy.polygonscan.com/tx/${metadata.txHash}`;
        console.log(`   📱 QR Code points to blockchain: ${qrCodeData}`);
    } else {
        qrCodeData = `Certificate ID: ${metadata.certificateId}`;
        console.log(`   📱 QR Code shows certificate ID (no TX hash available)`);
    }
    
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);
    html = html.replace(
      '<!-- QR code will be generated dynamically -->',
      `<img src="${qrCodeImage}" alt="QR Code" />`
    );

    // Use puppeteer to generate image
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });
    await page.setContent(html);

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Take screenshot
    const imageBuffer = await page.screenshot({ 
      type: 'png', 
      fullPage: true,
      omitBackground: false
    });

    await browser.close();

    console.log('   ✅ Visual certificate generated');
    return imageBuffer;

  } catch (error) {
    console.error('   ❌ Certificate image generation failed:', error);
    throw error;
  }
}

// Upload image to IPFS
async function uploadImageToIPFS(imageBuffer, fileName) {
  try {
    console.log('   📤 Uploading image to IPFS...');

    if (!PINATA_JWT) {
      throw new Error('Pinata JWT not configured in environment variables');
    }

    // Use form-data package
    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    formData.append('file', imageBuffer, { 
      filename: fileName,
      contentType: 'image/png'
    });

    const metadata = JSON.stringify({ 
      name: fileName,
      keyvalues: {
        type: 'certificate',
        timestamp: Date.now().toString()
      }
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({ 
      cidVersion: 0,
      wrapWithDirectory: false
    });
    formData.append('pinataOptions', options);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          ...formData.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    console.log('   ✅ Image uploaded to IPFS. Hash:', response.data.IpfsHash);
    return response.data.IpfsHash;

  } catch (error) {
    console.error('   ❌ Image upload failed:');
    console.error('   Status:', error.response?.status);
    console.error('   Error:', error.response?.data || error.message);
    throw error;
  }
}

// Upload JSON metadata & image to IPFS
export async function uploadToIPFS(metadata) {
  try {
    console.log('   📤 Uploading certificate data to IPFS...');

    if (!PINATA_JWT) {
      throw new Error('Pinata JWT not configured in environment variables');
    }

    // Upload JSON metadata
    const jsonResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        pinataContent: metadata,
        pinataMetadata: {
          name: `certificate-${metadata.studentName}-${Date.now()}`,
          keyvalues: {
            type: 'certificate',
            studentName: metadata.studentName,
            eventName: metadata.eventName
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          "Content-Type": "application/json"
        }
      }
    );

    const jsonHash = jsonResponse.data.IpfsHash;
    console.log('   ✅ JSON metadata uploaded. Hash:', jsonHash);

    // Generate and upload visual certificate
    const imageBuffer = await generateCertificateImage(metadata);
    const imageHash = await uploadImageToIPFS(
      imageBuffer,
      `certificate-${metadata.studentName}-${Date.now()}.png`
    );

    return {
      metadataHash: jsonHash,
      imageHash: imageHash,
      imageUrl: `https://ipfs.io/ipfs/${imageHash}`,
      metadataUrl: `https://ipfs.io/ipfs/${jsonHash}`
    };

  } catch (error) {
    console.error('   ❌ IPFS upload failed:');
    console.error('   Status:', error.response?.status);
    console.error('   Error:', error.response?.data || error.message);
    throw new Error(`IPFS upload failed: ${error.response?.data?.error || error.message}`);
  }
}