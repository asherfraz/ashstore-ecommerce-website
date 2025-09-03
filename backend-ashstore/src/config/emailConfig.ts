import nodemailer from 'nodemailer';
import {
    EMAIL_SERVICE,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASSWORD
} from "./dotenvx";


const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    host: EMAIL_HOST,
    port: EMAIL_PORT ? parseInt(EMAIL_PORT) : 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
    },
});

export default transporter;