declare module 'passport-cookie' {
    import { Strategy as PassportStrategy } from 'passport';
    
    export interface StrategyOptions {
        cookieName: string;
        passReqToCallback?: boolean;
    }
    
    export interface VerifyFunction {
        (req: any, token: string | undefined, done: (error: any, user?: any, info?: any) => void): void;
    }
    
    export class Strategy extends PassportStrategy {
        constructor(options: StrategyOptions, verify: VerifyFunction);
    }
} 