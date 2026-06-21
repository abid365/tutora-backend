import { randomUUID } from "crypto";
import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { users } from "./user.schema.js";
import { jobs } from "./job.schema.js";

export const applications = sqliteTable(
  "applications",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    job_id: text("job_id")
      .notNull()
      .references(() => jobs.id),
    student_id: text("student_id")
      .notNull()
      .references(() => users.id),
    message: text("message"),
    status: text("status").notNull().default("pending"),
    created_at: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updated_at: integer("updated_at", { mode: "timestamp" }),
  },
  (table) => ({
    uniqueApplication: uniqueIndex("uq_job_student").on(
      table.job_id,
      table.student_id,
    ),
  }),
);
