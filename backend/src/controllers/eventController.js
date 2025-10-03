import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const { name, description, date, location, createdBy, speakers } = req.body;

    // handle uploaded files
    const posterPaths = req.files["posters"] ? req.files["posters"].map(f => f.path) : [];
    const speakerPhotos = req.files["speakerPhotos"] ? req.files["speakerPhotos"].map(f => f.path) : [];

    // merge speaker info with photos
    let speakersData = [];
    if (speakers) {
      const parsedSpeakers = JSON.parse(speakers); // send as JSON string
      speakersData = parsedSpeakers.map((s, i) => ({
        name: s.name,
        photoUrl: speakerPhotos[i] || null
      }));
    }

    const event = await Event.create({
      name,
      description,
      date,
      location,
      createdBy,
      speakers: speakersData,
      posters: posterPaths,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
