import { randomUUID } from "crypto";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { users } from "./user.schema.js";

export const jobs = sqliteTable("jobs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  guardian_id: text("guardian_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  subject: text("subject").notNull(),
  level: text("level").notNull(),
  teaching_type: text("teaching_type").notNull().default("online"),
  location: text("location"),
  rate_type: text("rate_type").notNull().default("hourly"),
  rate_amount: integer("rate_amount").notNull(),
  currency: text("currency").notNull().default("BDT"),
  schedule: text("schedule"),
  sessions_per_week: integer("sessions_per_week"),
  duration_minutes: integer("duration_minutes"),
  status: text("status").notNull().default("open"),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updated_at: integer("updated_at", { mode: "timestamp" }),
});
