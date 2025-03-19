import { config } from "dotenv";

config();

export const port = process.env.PORT || 3000;
export const user = process.env.DB_USER || "root";
export const password = process.env.DB_PASSWORD || "fallaut";
export const host = process.env.DB_HOST || "localhost";
export const dbPort = process.env.DB_PORT || 3306;
export const dbName = process.env.DB_DATABASE || "gestor_cobros";
