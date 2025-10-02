import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load ABI
const certAbiPath = path.join(__dirname, '../../../contracts/artifacts/contracts/Certificate.sol/CertificateRegistry.json');
const certAbiJson = JSON.parse(fs.readFileSync(certAbiPath, "utf-8"));

console.log('🔍 Blockchain Service - Configuration:');
console.log('   ALCHEMY_URL available:', !!process.env.ALCHEMY_URL);
console.log('   PRIVATE_KEY available:', !!process.env.PRIVATE_KEY);
console.log('   CONTRACT_ADDRESS available:', !!process.env.CONTRACT_ADDRESS);

// Create provider with explicit network configuration
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

console.log('✅ Wallet created with address:', wallet.address);

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, certAbiJson.abi, wallet);

console.log('✅ Contract instance created');

export async function issueCertificate(studentName, eventId, ipfsHash, walletAddress) {
  try {
    console.log('   🔗 Blockchain - Issuing certificate...');
    console.log('      Student:', studentName);
    console.log('      Event ID:', eventId);
    console.log('      IPFS Hash:', ipfsHash);
    console.log('      Wallet Address:', walletAddress);
    
    // Validate and normalize wallet address
    let recipientAddress;
    try {
      recipientAddress = ethers.getAddress(walletAddress);
      console.log('      Normalized Address:', recipientAddress);
    } catch (error) {
      throw new Error(`Invalid wallet address: ${walletAddress}`);
    }
    
    // Create transaction data manually to avoid ENS resolution
    const transactionData = contract.interface.encodeFunctionData("issueCertificate", [
      studentName,
      eventId,
      ipfsHash,
      recipientAddress
    ]);
    
    console.log('      Transaction data encoded');
    
    // Get current gas price
    const feeData = await provider.getFeeData();
    console.log('      Gas price:', feeData.gasPrice?.toString());
    
    // Create transaction object
    const transaction = {
      to: contractAddress,
      data: transactionData,
      gasLimit: 300000, // Fixed gas limit for testing
      gasPrice: feeData.gasPrice,
      nonce: await provider.getTransactionCount(wallet.address)
    };
    
    console.log('      Sending transaction...');
    
    // Send raw transaction
    const txResponse = await wallet.sendTransaction(transaction);
    console.log('      Transaction sent:', txResponse.hash);
    
    // Wait for confirmation
    const receipt = await txResponse.wait();
    console.log('      Transaction confirmed in block:', receipt.blockNumber);
    console.log('      Gas used:', receipt.gasUsed.toString());
    
    return receipt;
    
  } catch (error) {
    console.error('   ❌ Blockchain minting failed:', error.message);
    console.error('      Error details:', error);
    
    // Check for specific common errors
    if (error.message.includes('insufficient funds')) {
      throw new Error('Insufficient MATIC for gas fees');
    } else if (error.message.includes('reverted')) {
      throw new Error('Contract execution reverted - check contract logic');
    } else if (error.message.includes('ENS')) {
      throw new Error('Network configuration issue - try different approach');
    }
    
    throw error;
  }
}

export async function verifyCertificate(certId) {
  return await contract.verifyCertificate(certId);
}