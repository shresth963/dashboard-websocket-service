import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import verifyInternalApiKey from './middleware/auth.middleware';
import SERVER_CONFIG from './config/server.config';
import logger from './utils/logging';

const app: Express = express();

// Morgan middleware for request logging
const morganFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

app.use(morgan(morganFormat, {
    stream: {
        write: (message: string) => {
            logger.http(message.trim());
        }
    }
}));

// Middleware
app.use(cors({
    origin: SERVER_CONFIG.CORS.origin,
    methods: SERVER_CONFIG.CORS.methods,
    credentials: SERVER_CONFIG.CORS.credentials
}));
app.use(express.json());
app.use(verifyInternalApiKey);

export default app; 