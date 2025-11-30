import { Router, Request, Response } from 'express';
import { Server } from 'socket.io';
import { MessagePayload } from '../types';

const messageController = (io: Server): Router => {
    const router = Router();

    const sendMessage = (req: Request, res: Response): Response => {
        const { lead_card_info, client, modality, playground, primary_id } = req.body as MessagePayload;

        if (!lead_card_info || !client || !modality) {
            return res.status(400).json({ 
                error: 'Missing required fields: lead_card_info, client, or modality' 
            });
        }

        let room = `${client}-${modality}`;
        if (playground && primary_id) {
            room = `${client}-${modality}-playground`;
        }

        io.to(room).emit('receiveMessage', {            
            ...lead_card_info
        });

        return res.status(200).json({ 
            success: true, 
            room,
            message: 'Message sent successfully'
        });
    };

    router.post('/', sendMessage);
    return router;
};

export default messageController; 