// api/index.js
const express = require('express');
const app = express();

app.use(express.json());

// Sample API route
app.get('/api/healthcheck', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Express server running on Vercel!' });
});

// Export the Express app for Vercel
module.exports = app;