import { AuthenticatedSocket, JoinRoomData, JoinPlaygroundRoomData, SocketHandler, JoinRefreshChatRoomData } from '../types';
import logger from '../utils/logging';

const handleJoinRoom: SocketHandler = (socket: AuthenticatedSocket, { client, modality, playground, primary_id }: JoinRoomData): void => {
    let room = `${client}-${modality}`;
    if (playground) {
        room = `${client}-${modality}-playground`;
    }

    // Leave all previous rooms except the default one
    if (socket.data.rooms_to_leave) {
        for (const r of socket.data.rooms_to_leave) {
            socket.leave(r);
            logger.info(`Left room: ${r}`);
        }
        socket.data.rooms_to_leave = [];
    }

    // Join the new room    
    socket.join(room);
    if (socket.data.rooms_to_leave) {
        socket.data.rooms_to_leave.push(room);
    } else {
        socket.data.rooms_to_leave = [room];
    }
    logger.info(`User joined room: ${room}`);
};

const handleJoinPlaygroundRoom: SocketHandler = (socket: AuthenticatedSocket, { client_code }: JoinPlaygroundRoomData): void => {
    const room = `${client_code}-playground`;
    socket.join(room);
    logger.info(`User joined room: ${room}`);
};

const handleJoinRefreshChatRoom: SocketHandler = (socket: AuthenticatedSocket, { client, modality, playground }: JoinRefreshChatRoomData): void => {
    let room = `refresh-chat-${client}-${modality}`;
    if (playground) {
        room = `refresh-chat-${client}-${modality}-playground`;
    }
    socket.join(room);
    logger.info(`User joined room: ${room}`);
};

const handleDisconnect = (): void => {
    logger.info('A user disconnected');
};

export {
    handleJoinRoom,
    handleJoinRefreshChatRoom,
    handleJoinPlaygroundRoom,
    handleDisconnect
}; 