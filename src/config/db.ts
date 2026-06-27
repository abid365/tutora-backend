import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import {} from "@libsql/client";
import * as schema from "../db/schema/index.js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

console.log({
  TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL,
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle({
  connection: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  schema,
});

export default db;
