import { uploadToIPFS } from "./ipfsService.js";
import { issueCertificate } from "./blockchainService.js";
import Certificate from "../models/Certificate.js";

export async function batchMintCertificates(event, registrations) {
  const results = [];
  console.log(`🔄 Starting batch minting for ${registrations.length} registrations`);

  for (const registration of registrations) {
    try {
      // Check for wallet address in multiple possible fields
      const walletAddress = registration.walletAddress || registration.studentWallet;
      
      console.log(`\n📝 Processing: ${registration.name}`);
      console.log(`   Available wallet fields:`);
      console.log(`   - walletAddress: ${registration.walletAddress}`);
      console.log(`   - studentWallet: ${registration.studentWallet}`);
      console.log(`   Using wallet: ${walletAddress}`);

      if (!walletAddress) {
        console.log(`   ⚠️ Skipping - no wallet address found`);
        continue;
      }

      // Create unique certificate ID
      const certificateId = `cert-${event._id}-${registration._id}-${Date.now()}`;

      // Create certificate metadata
      const metadata = {
        studentName: registration.name,
        studentEmail: registration.email,
        eventName: event.name,
        eventId: event._id.toString(),
        eventDate: event.date,
        eventOrganizer: event.organizer || "Blockcerts University",
        issuedAt: new Date().toISOString(),
        certificateType: "Blockchain Attendance Certificate",
        certificateId: certificateId
      };

      console.log('   📄 Certificate metadata created');

      // Issue on blockchain first (we need tx hash for visual certificate)
      console.log('   ⛓️ Minting on blockchain...');
      let txHash;
      try {
        const tx = await issueCertificate(
          registration.name, 
          event._id.toString(), 
          certificateId,
          walletAddress
        );
        
        // Get transaction hash properly - handle different return formats
        txHash = tx.hash || tx.transactionHash;
        console.log(`   ✅ Transaction Hash: ${txHash}`);
        console.log(`   🔗 View on Polygonscan: https://amoy.polygonscan.com/tx/${txHash}`);
        
        // Add transaction hash to metadata for visual certificate
        metadata.txHash = txHash;
        metadata.blockchainUrl = `https://amoy.polygonscan.com/tx/${txHash}`;
        
      } catch (blockchainError) {
        console.error(`   ❌ Blockchain minting failed: ${blockchainError.message}`);
        continue; // Skip to next registration if blockchain fails
      }

      // Upload to IPFS with visual certificate generation
      console.log('   🌐 Uploading certificate to IPFS...');
      let ipfsResult;
      try {
        ipfsResult = await uploadToIPFS(metadata);
        console.log(`   ✅ IPFS Metadata Hash: ${ipfsResult.metadataHash}`);
        console.log(`   ✅ IPFS Image Hash: ${ipfsResult.imageHash}`);
        console.log(`   📸 Certificate Image: ${ipfsResult.imageUrl}`);
        
        // Create NFT metadata for wallet display
        const nftMetadata = {
          name: `Certificate: ${registration.name} - ${event.name}`,
          description: `Blockchain certificate issued to ${registration.name} for completing ${event.name}`,
          image: ipfsResult.imageUrl,
          external_url: ipfsResult.metadataUrl,
          attributes: [
            {
              trait_type: "Student Name",
              value: registration.name
            },
            {
              trait_type: "Event",
              value: event.name
            },
            {
              trait_type: "Issued Date", 
              value: new Date().toISOString()
            },
            {
              trait_type: "Certificate ID",
              value: certificateId
            },
            {
              trait_type: "Blockchain",
              value: "Polygon Amoy"
            }
          ]
        };
        
        console.log('   🎨 NFT Metadata created for wallet display');
        
      } catch (ipfsError) {
        console.error(`   ❌ IPFS upload failed: ${ipfsError.message}`);
        continue; // Skip to next registration if IPFS fails
      }

      // Save to database
      const cert = new Certificate({
        studentName: registration.name,
        studentEmail: registration.email,
        eventId: event._id,
        participantId: registration.participantId,
        walletAddress: walletAddress,
        ipfsHash: ipfsResult.metadataHash, // Store metadata hash
        imageHash: ipfsResult.imageHash,   // Store image hash
        txHash: txHash,
        registrationId: registration._id,
        certId: certificateId,
        imageUrl: ipfsResult.imageUrl,
        metadataUrl: ipfsResult.metadataUrl
      });

      await cert.save();
      console.log(`   💾 Certificate saved to database: ${cert._id}`);

      results.push({
        studentName: registration.name,
        walletAddress: walletAddress,
        ipfsHash: ipfsResult.metadataHash,
        imageHash: ipfsResult.imageHash,
        imageUrl: ipfsResult.imageUrl,
        txHash: txHash,
        certificateId: certificateId,
        _id: cert._id
      });

      console.log(`   ✅ Successfully minted visual certificate for ${registration.name}`);
      console.log(`   📱 Certificate will be visible as NFT in wallet!`);

    } catch (error) {
      console.error(`   ❌ Failed to mint certificate for ${registration.name}:`, error.message);
    }
  }

  console.log(`\n🎉 Batch minting completed: ${results.length} successful, ${registrations.length - results.length} failed`);
  return results;
}