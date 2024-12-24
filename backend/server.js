const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Dummy database
let cows = [];

// POST endpoint for reporting abandoned cows
app.post('/report', (req, res) => {
  const { id, location, description } = req.body;
  cows.push({ id, location, description });
  res.status(201).send('Cow reported successfully');
});

// GET endpoint to view reported cows
app.get('/cows', (req, res) => {
  res.json(cows);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
