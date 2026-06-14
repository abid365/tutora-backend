import { randomUUID } from "crypto";
import { sqliteTable, int, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" }),
  email: text("email"),
  phone: integer("phone", { mode: "number" }),
  password: text("password"),
  name: text("name"),
});
