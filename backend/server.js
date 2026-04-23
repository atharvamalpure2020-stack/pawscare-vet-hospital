const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/pawscareDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schema
const appointmentSchema = new mongoose.Schema({
  ownerName: String,
  petName: String,
  petType: String,
  date: String,
  time: String,
  service: String
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

// API route
app.post("/appointment", async (req, res) => {
  try {
    const { date, time } = req.body;

    // Check duplicate appointment slot
    const existingAppointment = await Appointment.findOne({
      date: date,
      time: time
    });

    if(existingAppointment){
      return res.status(400).send(
        "❌ This time slot is already booked. Please choose another time."
      );
    }

    const newAppointment = new Appointment(req.body);
    await newAppointment.save();

    res.send("✅ Appointment booked successfully!");

  } catch (err) {
    res.status(500).send("❌ Error saving appointment");
  }
});
// Get all appointments
app.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (error) {
    res.status(500).send("Error fetching appointments");
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});