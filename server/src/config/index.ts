import { configDotenv } from "dotenv"
configDotenv()


export const PORT =
    process.env.PORT || 3000;

export const CLIENT_URL =
    process.env.CLIENT_URL || "http://localhost:5173";

export const MONGO_DB_URI =
    process.env.MONGO_DB_URI;

export const EMAIL_USERNAME =
    process.env.EMAIL_USERNAME;

export const EMAIL_PASSWORD =
    process.env.EMAIL_PASSWORD;

export const ACCESS_TOKEN_SECRET: string | undefined =
    process.env.ACCESS_TOKEN_SECRET;


export const ACCESS_TOKEN_EXPIRY =
    process.env.ACCESS_TOKEN_EXPIRY;

export const SECRET_KEY =
    process.env.SECRET_KEY;
