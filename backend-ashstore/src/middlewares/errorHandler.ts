import { NextFunction, Request, Response } from "express";
import { ValidationError } from "joi";

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    // default error
    let status: number = 500;
    let data = {
        success: false,
        message: 'Internal Server Error'
    }

    // data validation errors
    if (error instanceof ValidationError) {
        let errorsMessages = error.details.map(err => err.message);

        status = 422;
        data.message = errorsMessages.join(', ');
        data.success = false;

        return res.status(status).json(data);
    }

    // Rate Limiter Error - Too Many Requests

    // express-rate-limit error (usually has statusCode 429)
    if (error.status === 429 || error.statusCode === 429) {
        status = 429;
        data.message = 'Too Many Requests';
        return res.status(status).json(data);
    }

    // Custom status and message if available
    if (error.status) status = error.status;
    if (error.message) data.message = error.message;
    if (error.success !== undefined) data.success = error.success;

    return res.status(status).json(data);
}

export default errorHandler;