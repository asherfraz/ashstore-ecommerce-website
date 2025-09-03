import { Request } from 'express';
import { IUser } from './user.types';

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}


export { };