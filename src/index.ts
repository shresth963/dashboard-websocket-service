import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { Strategy as CookieStrategy } from 'passport-cookie';
import axios from 'axios';
import logger from './utils/logging';

import app from './app';
import setupSocket from './socket/socket';
import messageController from './routes/message.routes';
import { handleEvent } from './controllers/event_controller';
import { handlePlaygroundEvent } from './controllers/playground_event_controller';
import SERVER_CONFIG from './config/server.config';
import { AuthenticatedSocket } from './types';
import { errorHandler } from './middleware/error.middleware';
import { handleRefreshChatEvent } from './controllers/refresh_chat_controller';

// Define types for passport-cookie strategy
interface CookieStrategyRequest {
  [key: string]: any;
}

passport.use('cookie', 
    new CookieStrategy({
        cookieName: 'auth_token', // Name of your cookie
        passReqToCallback: true
    },
    function(req: CookieStrategyRequest, token: string | undefined, done: (error: any, user?: any) => void) {
        if (!token) {
            return done(null, false);
        }
        return done(null, token);
    })
);

// Create HTTP server
const server = http.createServer(app);
logger.info('HTTP server created');

// Setup Socket.IO
const io = setupSocket(server);
logger.info('Socket.IO server initialized');

// Initialize cookie parser middleware
app.use(cookieParser());
app.use(passport.initialize());
logger.debug('Middleware initialized: cookie-parser and passport');

// For Socket.IO, we need to parse cookies from handshake
io.use(async (socket: AuthenticatedSocket, next) => {
    // Extract cookies from the handshake headers
    const cookieHeader = socket.handshake.headers.cookie;
    const clientCodeHeader = socket.handshake.headers['x-client-code'];
    if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce<Record<string, string>>((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});
        
        socket.request.cookies = cookies;
        
        if (cookies.auth_token) {
            try {
                // Verify token with external auth server
                const response = await axios.get(`${SERVER_CONFIG.AUTH_API_URL}/auth/check`, {
                    headers: {
                        Cookie: `auth_token=${cookies.auth_token}`,
                        'x-client-code': clientCodeHeader
                    }
                });
                
                if (response.status === 200) {
                    // Store user data from verification response
                    socket.request.user_id = response.data.user_id;
                    logger.debug(`Socket authenticated for user: ${response.data.user_id}`);
                    return next();
                } else {
                    return next(new Error('Invalid token'));
                }
            } catch (error) {
                return next(new Error('Authentication server error'));
            }
        }
    }
    return next(new Error('Authentication error'));
});

// Setup routes
app.get('/', (req, res) => {
    res.json({ message: 'Dashboard WebSocket Service is running' });
});

app.use('/send-message', messageController(io));

// Setup routes
app.post('/send-refresh-chat-event', handleRefreshChatEvent(io));

// Example protected route
app.post('/send-event', 
    handleEvent(io)
);

app.post('/send-playground-event', 
    handlePlaygroundEvent(io)
);

app.use(errorHandler);

// Start server
server.listen(SERVER_CONFIG.PORT, () => {
    logger.info(`Server is running on port ${SERVER_CONFIG.PORT}`);
}); 