import Certificate from "../models/Certificate.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import Participant from "../models/Participant.js"; // ADD THIS
import { batchMintCertificates } from "../services/certService.js";

export const getAllCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find().populate("eventId");
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const mintCertificates = async (req, res) => {
  try {
    const { eventId, registrationId } = req.body;
    
    console.log('\n🔍 === DEBUG MINT CERTIFICATES START ===');
    console.log('Event ID:', eventId);
    console.log('Registration ID:', registrationId);

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      console.log('❌ Event not found');
      return res.status(404).json({ error: "Event not found" });
    }
    console.log('✅ Event found:', event.name);

    // Build query to find registration
    const query = { eventId: eventId };
    if (registrationId) {
      query._id = registrationId;
    }

    console.log('📋 Query:', query);

    // Find registration with participant population
    const registration = await Registration.findOne(query).populate('participantId');
    console.log('📊 Found registration:', !!registration);
    
    if (!registration) {
      console.log('❌ Registration not found');
      return res.status(400).json({ error: "Registration not found" });
    }

    // DEBUG: Check participant data
    console.log('👤 Participant ID:', registration.participantId);
    console.log('👤 Has participant:', !!registration.participantId);
    
    if (registration.participantId) {
      console.log('📝 Participant data:', {
        name: registration.participantId.name,
        email: registration.participantId.email,
        walletAddress: registration.participantId.walletAddress
      });
    } else {
      console.log('❌ No participant data found in registration');
      
      // Let's check if participant exists separately
      const participant = await Participant.findById(registration.participantId);
      console.log('🔍 Direct participant lookup:', participant);
    }

    // Check if we have the necessary data
    if (!registration.participantId || !registration.participantId.walletAddress) {
      console.log('❌ Missing participant data or wallet address');
      console.log('   Participant exists:', !!registration.participantId);
      console.log('   Wallet address:', registration.participantId?.walletAddress);
      return res.status(400).json({ error: "No attendees with wallet addresses to mint" });
    }

    // Prepare data for certificate service
    const registrationData = {
      _id: registration._id,
      name: registration.participantId.name,
      email: registration.participantId.email,
      walletAddress: registration.participantId.walletAddress,
      participantId: registration.participantId._id
    };

    console.log('✅ Processed registration data:', registrationData);
    console.log('🔍 === DEBUG MINT CERTIFICATES END ===\n');

    // ✅ Call your certificate service
    console.log('🔄 Starting certificate minting process...');
    const results = await batchMintCertificates(event, [registrationData]);

    console.log('✅ Minting completed. Results:', results.length);

    res.json({
      message: "Certificates minted on blockchain & IPFS",
      total: results.length,
      certificates: results.map(c => ({
        studentName: c.studentName,
        walletAddress: c.walletAddress,
        ipfsHash: c.ipfsHash,
        txHash: c.txHash,
      })),
    });
  } catch (err) {
    console.error('❌ Certificate minting error:', err);
    res.status(500).json({ error: err.message });
  }
};