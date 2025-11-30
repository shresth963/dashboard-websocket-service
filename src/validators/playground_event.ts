import Joi from 'joi';

export type DashboardPlaygroundEvent = {
    faq_id: string;
    status: string;
    message: string;
    client_code: string;
    timestamp: Date;
    playground_status: string;
}

export const DashboardPlaygroundEventSchema = Joi.object<DashboardPlaygroundEvent>({
    faq_id: Joi.string().required(),
    status: Joi.string().required(),
    playground_status: Joi.string().required(),
    message: Joi.string().required().allow(''),
    timestamp: Joi.date().required(),
    client_code: Joi.string().required(),
});
