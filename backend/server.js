import express, { json } from 'express';
import { connect, Schema, model } from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
config();
// Enable cors at the server side. 
const cors = require('cors')
const corsOption = {
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}
app.use(cors(corsOption));
const app = express();
app.use(cors());
app.use(json());

connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const scheduleSchema = new Schema({
  segment: String,
  slot: String,
  courseName: String,
  courseCode: String,
  instructor: String,
  venue: String,
});

const Schedule = model('Schedule', scheduleSchema);

// Add a schedule entry
app.post('/api/schedules', async (req, res) => {
  try {
    const newSchedule = new Schedule(req.body);
    await newSchedule.save();
    res.status(201).json({ message: 'Schedule saved successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all schedules
app.get('/api/schedules', async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.status(200).json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

