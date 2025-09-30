import { ethers } from "ethers";
import certAbi from "../../contracts/artifacts/contracts/Certificate.sol/CertificateRegistry.json" assert { type: "json" };

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, certAbi.abi, wallet);

export async function issueCertificate(studentName, eventId, ipfsHash, walletAddress) {
  const tx = await contract.issueCertificate(studentName, eventId, ipfsHash, walletAddress);
  return await tx.wait();
}

export async function verifyCertificate(certId) {
  return await contract.verifyCertificate(certId);
}
