import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get('/api/healthcheck', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Express server running on Vercel!' });
});

export default app;