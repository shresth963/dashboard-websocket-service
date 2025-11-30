import { Server } from 'socket.io';
import { Request, Response } from 'express';
import { EventHandler } from '../types';
import { RefreshChatEvent, RefreshChatEventSchema } from '../validators/refresh_chat_event';

const getRooms = (client: string, modality: string, playground: boolean) => {
    let room = `refresh-chat-${client}-${modality}`;
    if (playground) {
        room = `refresh-chat-${client}-${modality}-playground`;
        return [room];
    }
    let room_all = `refresh-chat-${client}-all`;
    let rooms = [room, room_all];
    return rooms;
}


const handleRefreshChatEvent: EventHandler = (io: Server) => {
    return (req: Request, res: Response) => {
        // Parse and validate the incoming data against schema
        const event = RefreshChatEventSchema.validate(req.body);
        if (event.error) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid event data format',
                errors: event.error.details.map((detail) => detail.message)
            });
        }
        
        // Extract the validated and properly typed data
        const refreshChatEvent: RefreshChatEvent = event.value;
        let rooms = getRooms(refreshChatEvent.client, refreshChatEvent.channel, refreshChatEvent.playground);
        // Emit the event to the user
        io.to(rooms).emit('refreshChat', {
            "client": refreshChatEvent.client,
            "channel": refreshChatEvent.channel,
            "dashboard_entity_card": refreshChatEvent.dashboard_entity_card,
            "playground": refreshChatEvent.playground,
            "dashboard_message": refreshChatEvent.dashboard_message,
            "attachments": refreshChatEvent.attachments,
            "lead_id": refreshChatEvent.lead_id,
            "lead_response": refreshChatEvent.lead_response,
        });
        
        res.status(200).json({ success: true, message: 'Event broadcasted to client' });
    };
};

export { handleRefreshChatEvent }; 