import { uploadToIPFS } from "./ipfsService.js";
import { issueCertificate } from "./blockchainService.js";
import Certificate from "../models/Certificate.js";

export async function batchMintCertificates(event, attendees) {
  const results = [];

  for (const attendee of attendees) {
    const metadata = {
      studentName: attendee.name,
      eventId: event._id.toString(),
      issuedAt: Date.now(),
    };

    const ipfsHash = await uploadToIPFS(metadata);

    const tx = await issueCertificate(attendee.name, event._id.toString(), ipfsHash, attendee.walletAddress);

    const cert = new Certificate({
      studentName: attendee.name,
      eventId: event._id,
      walletAddress: attendee.walletAddress,
      ipfsHash,
      txHash: tx.transactionHash,
    });

    await cert.save();
    results.push(cert);
  }

  return results;
}
