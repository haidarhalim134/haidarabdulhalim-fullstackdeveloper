import express, { Request, Response } from "express";
import cors from 'cors'
import { router as authRouter } from "./src/modules/auth/auth.controller";


const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);

// for local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.BACKEND_PORT || 5000;
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

export default app;