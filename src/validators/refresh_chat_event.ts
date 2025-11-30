import Joi from 'joi';

export type RefreshChatEvent = {
    client: string;
    channel: string;
    dashboard_entity_card: object;
    playground: boolean;
    dashboard_message: object;
    attachments: object[];
    lead_id?: string;
    lead_response: object;
}

export const RefreshChatEventSchema = Joi.object<RefreshChatEvent>({
    client: Joi.string().required(),
    channel: Joi.string().required(),
    dashboard_entity_card: Joi.object().required(),
    playground: Joi.boolean().required(),
    dashboard_message: Joi.object().required(),
    attachments: Joi.array().items(Joi.object()).required(),
    lead_id: Joi.string().optional(),
    lead_response: Joi.object().required(),
});