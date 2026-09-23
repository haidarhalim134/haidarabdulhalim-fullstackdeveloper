import express, { Request, Response } from "express";
import cors from 'cors'
import { router as authRouter } from "./src/modules/auth/auth.controller";
import { router as jobRouter } from "./src/modules/job/job.controller"
import errorHandler from "./src/middleware/errorHandler";


const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/job', jobRouter)

app.use(errorHandler)

// for local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.BACKEND_PORT || 5000;
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

export default app;