import express, { json } from 'express';
import { connect, Schema, model } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Use a fallback URI if the environment variable is not set
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/timetable";

const app = express();
app.use(cors());
app.use(json());

connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((error) => console.log("MongoDB connection error: ", error));

const scheduleSchema = new Schema({
    segment: String,
    slot: String,
    courseName: String,
    courseCode: String,
    venue: String,
    instructor: String,
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
