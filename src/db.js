import { createPool } from "mysql2/promise";
import { user, password, dbName, host, dbPort } from "./config.js";

export const pool = createPool({
  host: host,
  user: user,
  password: password,
  port: dbPort,
  database: dbName,
});
