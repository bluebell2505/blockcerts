import Registration from '../models/Registration.js';

export const getParticipants = async (req, res) => {
  try {
    const participants = await Registration.find().populate('userId', 'userId walletId department yearOfPassing');
    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching participants', error: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { status } = req.body; // "present" or "absent"

    const updated = await Registration.findByIdAndUpdate(
      registrationId,
      { attendance: status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Registration not found' });
    res.json({ message: 'Attendance updated', updated });
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
};
