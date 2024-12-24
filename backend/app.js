const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch'); // for Google Maps API

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost/cowmunity', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// MongoDB Models
const Cow = mongoose.model('Cow', {
  name: String,
  location: String,
  status: String, // Abandoned/Available for Adoption
  shelter: String,
});

// Routes

// Report Cow
app.post('/report-cow', async (req, res) => {
  const { name, location, status, shelter } = req.body;
  const newCow = new Cow({ name, location, status, shelter });
  try {
    await newCow.save();
    res.status(200).json({ message: 'Cow reported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error reporting cow' });
  }
});

// List Cows for Adoption
app.get('/adopt-cow', async (req, res) => {
  try {
    const cows = await Cow.find({ status: 'Available for Adoption' });
    res.status(200).json(cows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cows for adoption' });
  }
});

// Donate
app.post('/donate', (req, res) => {
  const { amount, donorName } = req.body;
  // Handle donation logic, e.g., save to database or integrate with a payment gateway
  res.status(200).json({ message: 'Donation received successfully' });
});

// Get Nearby Shelters using Google Maps API
app.get('/nearby-shelters', async (req, res) => {
  const { lat, long } = req.query;
  const googleMapsUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=5000&type=shelter&key=YOUR_GOOGLE_MAPS_API_KEY`;

  try {
    const response = await fetch(googleMapsUrl);
    const data = await response.json();
    res.status(200).json(data.results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nearby shelters' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
