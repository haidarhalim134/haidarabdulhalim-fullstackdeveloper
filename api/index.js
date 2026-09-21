// api/index.js
import express from "express";
const app = express();

app.use(express.json());

// Sample API route
app.get('/api/healthcheck', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Express server running on Vercel!' });
});

export default app