import Joi from 'joi';
import { DashboardEvent } from '../types';

export type DashboardEventCTA = {
    link: string;
    text: string;
}

export type UserDashboardNotification = {
    user_id: string;
    is_read: boolean;
    read_at: Date | null;
}

export const DashboardEventSchema = Joi.object<DashboardEvent>({
    id: Joi.string().required(),
    heading: Joi.string().required(),
    description: Joi.string().required(),
    user_dashboard_notifications: Joi.array().items(Joi.object({
        user_id: Joi.string().required(),
        is_read: Joi.boolean().required(),
        read_at: Joi.date().allow(null).required(),
    })).required(),
    cta: Joi.object({
        link: Joi.string().required(),
        text: Joi.string().required(),
    }),
    event_type: Joi.string().required(),
    client_code: Joi.string(),
    client_name: Joi.string(),
    client_logo_url: Joi.string(),
    org_code: Joi.string(),
    scope: Joi.string(),
    priority: Joi.number(),
    miscellaneous_data: Joi.object().allow(null),
    event_category: Joi.string().required(),
    created_at: Joi.date().required(),
});
