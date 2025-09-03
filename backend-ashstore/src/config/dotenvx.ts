import "@dotenvx/dotenvx/config"

// to test if dotenv is working
// console.log("PORT: ", process.env.PORT)
// console.log("NODE ENV: ", process.env.NODE_ENV)
// console.log("FRONTEND URL: ", process.env.FRONTEND_URL)
// console.log("MONGODB CONNECTION STRING: ", process.env.MONGODB_CONNECTION_STRING)

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
export const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS;

// Google Auth configuration
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

// JWT configuration
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION;
export const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET;
export const RESET_TOKEN_EXPIRATION = process.env.RESET_TOKEN_EXPIRATION;
export const AccountVerification_TOKEN_SECRET = process.env.AccountVerification_TOKEN_SECRET;
export const AccountVerification_TOKEN_EXPIRATION = process.env.AccountVerification_TOKEN_EXPIRATION;

// Nodemailer configuration
export const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
export const EMAIL_HOST = process.env.EMAIL_HOST as string;
export const EMAIL_PORT = process.env.EMAIL_PORT as string;
export const EMAIL_USER = process.env.EMAIL_USER as string;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD as string;

