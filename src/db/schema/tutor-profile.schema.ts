import { randomUUID } from "crypto";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { users } from "./user.schema.js";

export const tutorProfiles = sqliteTable("tutor_profiles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id),

  bio: text("bio"),

  education: text("education"),

  yearsOfExperience: integer("years_of_experience"),

  achievements: text("achievements"),
  certifications: text("certifications"),

  subjects: text("subjects"),
  gradeLevels: text("grade_levels"),
  teachingMode: text("teaching_mode"),
  preferredLocations: text("preferred_locations"),
  hourlyRate: integer("hourly_rate"),
  currency: text("currency").default("BDT"),
  availability: text("availability"),

  profileImage: text("profile_image"),
  videoIntro: text("video_intro"),

  rating: real("rating"),
  totalReviews: integer("total_reviews").default(0),

  isProfileComplete: integer("is_profile_complete", {
    mode: "boolean",
  }).default(false),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});
