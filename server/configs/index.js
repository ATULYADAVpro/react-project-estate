import { config } from "dotenv";
config()

export const {PORT, JWT_SECRECT,DB_URL,DEBUG_MODE} = process.env;