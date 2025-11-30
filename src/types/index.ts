import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Request, Response, NextFunction } from 'express';

export interface ServerConfig {
  PORT: number;
  CORS: {
    origin: string[];
    methods: string[];
    credentials: boolean;
  };
  AUTH_API_URL: string;
  INTERNAL_API_SECRET: string;
}

export interface MessagePayload {
  lead_card_info: any;
  client: string;
  modality: string;
  playground?: boolean;
  primary_id?: string;
}

export interface JoinRoomData {
  client: string;
  modality: string;
  playground?: boolean;
  primary_id?: string;
}

export interface JoinRefreshChatRoomData {
  client: string;
  modality: string;
  playground?: boolean;
}

export interface JoinPlaygroundRoomData {
  client_code: string;
}

export interface AuthenticatedSocket extends Socket {
  request: Socket['request'] & {
    user_id?: string;
    cookies?: Record<string, string>;
  };
}

export type SocketHandler = (socket: AuthenticatedSocket, data: any) => void;

export type EventHandler = (io: Server) => (req: Request, res: Response) => void;

export type ApiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => void; 

export type DashboardEvent = {
    id: string;
    heading: string;
    description: string;
    user_dashboard_notifications: UserDashboardNotification[];
    cta: DashboardEventCTA;
    event_type: string;
    client_code: string;
    client_name: string;
    client_logo_url: string;
    org_code: string;
    scope: string;
    priority: number;
    miscellaneous_data: any;
    event_category: string;
    created_at: Date;
}

export type DashboardEventCTA = {
    link: string;
    text: string;
}

export type UserDashboardNotification = {
    user_id: string;
    is_read: boolean;
    read_at: Date | null;
}
