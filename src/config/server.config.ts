import { ServerConfig } from '../types';

const SERVER_CONFIG: ServerConfig = {
    PORT: Number(process.env.PORT) || 3000,
    CORS: {
        origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
    },
    AUTH_API_URL: process.env.AUTH_API_URL || 'http://localhost:8000',
    INTERNAL_API_SECRET: process.env.INTERNAL_API_SECRET || 'secret'
};

export default SERVER_CONFIG; 