import { Server } from 'socket.io';
import http from 'http';
import SERVER_CONFIG from '../config/server.config';
import { handleJoinRoom, handleDisconnect, handleJoinPlaygroundRoom, handleJoinRefreshChatRoom } from './handlers';
import { AuthenticatedSocket, JoinPlaygroundRoomData, JoinRefreshChatRoomData, JoinRoomData } from '../types';
import logger from '../utils/logging';
const setupSocket = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: SERVER_CONFIG.CORS.origin,
            methods: SERVER_CONFIG.CORS.methods,
            credentials: SERVER_CONFIG.CORS.credentials
        }
    });

    io.on('connection', (socket: AuthenticatedSocket) => {
        logger.info('A user connected');
        logger.debug(`User ID: ${socket.request.user_id}`);
        if (socket.request.user_id) {
            socket.join(socket.request.user_id);
        }
        socket.on('joinRefreshChatRoom', (data: JoinRefreshChatRoomData) => handleJoinRefreshChatRoom(socket, data));       
        socket.on('joinRoom', (data: JoinRoomData) => handleJoinRoom(socket, data));
        socket.on('joinPlaygroundRoom', (data: JoinPlaygroundRoomData) => handleJoinPlaygroundRoom(socket, data));
        socket.on('disconnect', handleDisconnect);
        socket.on('error', (error) => {
            logger.error('Socket error:', error);
        });
    });

    return io;
};

export default setupSocket; 