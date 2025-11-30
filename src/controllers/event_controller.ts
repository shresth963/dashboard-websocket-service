import { Server } from 'socket.io';
import { Request, Response } from 'express';
import { EventHandler } from '../types';
import { DashboardEventSchema } from '../validators/event';
const handleEvent: EventHandler = (io: Server) => {
    return (req: Request, res: Response) => {
        const event = DashboardEventSchema.validate(req.body);
        if (event.error) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid event data format',
                errors: event.error.details.map((detail) => detail.message)
            });
        }
        
        const dashboardEvent = event.value;
        
        for (const user of dashboardEvent.user_dashboard_notifications) {
            io.to(user.user_id).emit('newEvent', {
                "id": dashboardEvent.id,
                "client_code": dashboardEvent.client_code,
                "client_name": dashboardEvent.client_name,
                "client_logo_url": dashboardEvent.client_logo_url,
                "org_code": dashboardEvent.org_code,
                "scope": dashboardEvent.scope,
                "priority": dashboardEvent.priority,
                "heading": dashboardEvent.heading,
                "description": dashboardEvent.description,
                "miscellaneous_data": dashboardEvent.miscellaneous_data,
                "cta": dashboardEvent.cta,
                "event_category": dashboardEvent.event_category,
                "created_at": dashboardEvent.created_at,
                "is_read": user.is_read,
            });
        }
        
        res.status(200).json({ success: true, message: 'Event broadcasted to all clients' });
    };
};

export { handleEvent }; 