import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get('/api/healthcheck', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Express server running on Vercel!' });
});

// for local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.BACKEND_PORT || 5000;
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

export default app;