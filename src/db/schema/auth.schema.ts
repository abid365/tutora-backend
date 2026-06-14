import { sqliteTable, text, int, integer } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { users } from "./user.schema.js";
export const auth = sqliteTable("auth", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  token: text("token").notNull().unique(),
  created_at: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  expires_at: integer("expires_at", { mode: "timestamp" }).notNull(),
  revoked_at: integer("revoked_at", { mode: "timestamp" }),
});
