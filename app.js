import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
//error handler
import { errorHandler } from './middlewares/errorHandlers.js';


// Import routes
import userRouter from './routes/userRoute.js';

// Initialize express instance
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Konectar' });
});

app.use('/waitlist', userRouter);

//error handler
app.use(errorHandler)

export default app;
