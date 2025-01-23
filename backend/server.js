import express, { json } from 'express';
import { connect, Schema, model } from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
config();
const app = express();
// Enable cors at the server side. 
const corsOptions = {
  origin: 'http://localhost:5173', // Ensure this matches your frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));
app.use(json());

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI not defined in environment variables');
  process.exit(1);
}
connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));


const scheduleSchema = new Schema({
  segment: { type: String, required: true },
  slot: { type: String, required: true },
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true },
  instructor: { type: String, required: true },
  venue: { type: String, required: true },
});


const Schedule = model('Schedule', scheduleSchema);

// Add a schedule entry
app.post('/api/schedules', async (req, res) => {
  console.log(req.body);
  try {
    const newSchedule = new Schedule(req.body);
    await newSchedule.save();
    res.status(201).json({ message: 'Schedule saved successfully', schedule: newSchedule });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all schedules
app.get('/api/schedules', async (req, res) => {
  try {
    const schedules = await Schedule.find({});
    res.status(200).json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

