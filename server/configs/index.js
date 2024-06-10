import { config } from "dotenv";
config()

export const {PORT, DB_URL,DEBUG_MODE} = process.env;