import 'module-alias/register';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Express, Request, Response } from 'express';
import { PORT, NODE_ENV, FRONTEND_URL } from "./config/dotenvx";
import morgan from 'morgan';
import connectToDatabase from './dbConnect';
import errorHandler from './middlewares/errorHandler';
import userRoutes from './routes/user.routes';
import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
import { getCurrentReqLocation } from './middlewares/getCurrentReqLocation';



connectToDatabase();
// 3rd party middleware
const app: Express = express();

// Help secure Express apps by setting HTTP response headers.
app.use(helmet());
// Enable this if you're behind a reverse proxy like Nginx or on Heroku/Vercel
// app.set('trust proxy', true);
app.use(morgan('dev'));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(cors({
    origin: [(FRONTEND_URL as string), (FRONTEND_URL as string).slice(0, -1), "http://localhost:3000"],
    optionsSuccessStatus: 200,
    credentials: true,
}));

// const limiter = rateLimit({
//     // retry after 10 minutes
//     windowMs: 10 * 60 * 1000, // 10 minutes
//     limit: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes).
//     standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
//     legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
//     ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
//     // store: ... , // Redis, Memcached, etc. See below.
//     message: {
//         status: 429,
//         message: "Too many requests from this IP, please try again later.",
//         success: false,
//     }
// })

// // Apply the rate limiting middleware to all requests.
// app.use(limiter)
// app.use('/api/v1/user', limiter, userRoutes);


// REST API routes
app.use('/api/v1/user', userRoutes);
// app.use('/api/v1/admin', adminRoutes);
// app.use('/api/v1/product', productRoutes);
// app.use('/api/v1/order', orderRoutes);
// app.use('/api/v1/journal', journalRoutes);



// Error handling middleware
app.use(errorHandler);

// Api health check
app.get('/', async (req: Request, res: Response) => {
    // const exactLocationData = getCurrentReqLocation(locationData.dns?.ip);
    const location = await getCurrentReqLocation(1, req);

    res.status(200).json({
        message: "Welcome to AshStore backend APIs Server!",
        frontend: process.env.FRONTEND_URL,
        currentIP: req.ip,
        location: location,
    });
});

app.listen(PORT, () => {
    console.log(`
    Date: ${new Date().toLocaleString()}
    Environment: ${NODE_ENV}
    Frontend: ${FRONTEND_URL}
    Server running on http://localhost:${PORT}`);
});

export default app;

