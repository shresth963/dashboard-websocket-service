import { Server } from 'socket.io';
import { Request, Response } from 'express';
import { EventHandler } from '../types';
import { DashboardPlaygroundEventSchema } from '../validators/playground_event';
import logger from '../utils/logging';

const handlePlaygroundEvent: EventHandler = (io: Server) => {
    return (req: Request, res: Response) => {
        const event = DashboardPlaygroundEventSchema.validate(req.body);
        if (event.error) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid event data format',
                errors: event.error.details.map((detail) => detail.message)
            });
        }
        
        const dashboardPlaygroundEvent = event.value;
        
        const room = `${dashboardPlaygroundEvent.client_code}-playground`;
        // Emit the event to the user
        logger.info(`Emitting event to room: ${room}`);
        io.to(room).emit('newPlaygroundEvent', {
            "faq_id": dashboardPlaygroundEvent.faq_id,
            "status": dashboardPlaygroundEvent.status,
            "message": dashboardPlaygroundEvent.message,
            "playground_status": dashboardPlaygroundEvent.playground_status,
            "timestamp": dashboardPlaygroundEvent.timestamp,
        });
        // Send response back to the HTTP requester
        logger.info('Event broadcasted to client');
        res.status(200).json({ success: true, message: 'Event broadcasted to client' });
    };
};

export { handlePlaygroundEvent }; 