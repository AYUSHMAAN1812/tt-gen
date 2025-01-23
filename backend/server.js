import express, { json } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import { config } from 'dotenv';

config();
const app = express();

// Enable CORS
const corsOptions = {
  origin: 'http://localhost:5173/', // Ensure this matches your frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));
app.use(json());

// Check for MongoDB URI in environment variables
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI not defined in environment variables');
  process.exit(1);
}

// Database connection setup
let db;
const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectDB() {
  try {
    await client.connect();
    db = client.db('timetable');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}
connectDB();

// Add a schedule entry
app.post('/api/schedules', async (req, res) => {
  try {
    const newSchedule = {
      segment: req.body.segment,
      slot: req.body.slot,
      courseName: req.body.courseName,
      courseCode: req.body.courseCode,
      instructor: req.body.instructor,
      venue: req.body.venue,
    };

    const result = await db.collection('schedules').insertOne(newSchedule);
    res.status(201).json({
      message: 'Schedule saved successfully',
      schedule: { _id: result.insertedId, ...newSchedule },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all schedules
app.get('/api/schedules', async (req, res) => {
  try {
    const schedules = await db.collection('schedules').find({}).toArray();
    res.status(200).json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a schedule entry
app.put('/api/schedules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    
    const result = await db.collection('schedules').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.json({ message: 'Schedule updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a schedule entry
app.delete('/api/schedules/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.collection('schedules').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
