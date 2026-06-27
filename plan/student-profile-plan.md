# Student Profile System — Implementation Plan

## Overview
Add a complete student profile system covering education history, achievements, about section, extra-curricular activities, and tutoring interests.

Tech stack: Express + TypeScript + Drizzle ORM (SQLite) + Zod validation.

---

## 1. New Database Tables

### Table: `student_profiles` (1:1 with `users` where `role = "student"`)

| Column             | Type                    | Constraints                 | Notes                                        |
|--------------------|-------------------------|-----------------------------|----------------------------------------------|
| `user_id`          | `text`                  | PK, FK → users.id          | One-to-one with user                         |
| `about`            | `text`                  | nullable                    | Student's bio/about                          |
| `achievements`     | `text`                  | nullable                    | JSON array of strings                        |
| `extra_curricular` | `text`                  | nullable                    | JSON array of strings                        |
| `tutoring_interests` | `text`                | nullable                    | JSON array of `{ subject: string, level: string }` |
| `created_at`       | `integer` (timestamp)   | notNull, auto               |                                               |
| `updated_at`       | `integer` (timestamp)   | nullable                    |                                               |

### Table: `education` (1:many with `users`)

| Column             | Type                    | Constraints                 | Notes                                        |
|--------------------|-------------------------|-----------------------------|----------------------------------------------|
| `id`               | `text`                  | PK, UUID auto-generated    |                                               |
| `user_id`          | `text`                  | notNull, FK → users.id     |                                               |
| `institution_name` | `text`                  | notNull                     | e.g., "Springfield High School"              |
| `institution_type` | `text`                  | notNull                     | enum: `"school"`, `"high_school"`, `"university"` |
| `field_of_study`   | `text`                  | nullable                    | e.g., "Computer Science" (for university)    |
| `grade_or_level`   | `text`                  | nullable                    | e.g., "Grade 10", "A-Levels", "Bachelor's"   |
| `start_year`       | `integer`               | nullable                    |                                               |
| `end_year`         | `integer`               | nullable                    |                                               |
| `is_current`       | `integer` (0 or 1)      | default 0                   | Boolean flag for currently attending         |
| `created_at`       | `integer` (timestamp)   | notNull, auto               |                                               |
| `updated_at`       | `integer` (timestamp)   | nullable                    |                                               |

---

## 2. Files to Create

| File | Purpose |
|------|---------|
| `src/db/schema/student.schema.ts` | Drizzle table definitions for both tables |
| `src/app/validation-schema/student.validation.ts` | Zod schemas for profile & education input |
| `src/app/services/student.service.ts` | Business logic — CRUD for profiles & education |
| `src/app/routes/student.route.ts` | Express router for profile endpoints |

## 3. Files to Modify

| File | Change |
|------|--------|
| `src/db/schema/index.ts` | Add `export * from "./student.schema.js"` |
| `src/app.ts` | Mount student router at `/profiles` |

---

## 4. API Endpoints

All under `/profiles` prefix. Protected routes use existing JWT `authenticate` middleware.

### Profile Endpoints (`/profiles/student`)

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| `PUT` | `/profiles/student` | Yes | student | Create or update own profile (upsert) |
| `GET` | `/profiles/student/me` | Yes | student | Get own profile + all education entries |
| `GET` | `/profiles/student/:userId` | Yes | any | Get a student's public profile + education |

### Education Endpoints (`/profiles/student/education`)

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| `POST` | `/profiles/student/education` | Yes | student | Add an education entry |
| `PATCH` | `/profiles/student/education/:id` | Yes | student | Update an education entry |
| `DELETE` | `/profiles/student/education/:id` | Yes | student | Delete an education entry |

---

## 5. Validation Schemas (Zod)

### `createProfileSchema` / `updateProfileSchema`
- `about`: `z.string().max(2000).trim().optional()`
- `achievements`: `z.array(z.string().max(500)).max(50).optional()`
- `extra_curricular`: `z.array(z.string().max(500)).max(50).optional()`
- `tutoring_interests`: `z.array(z.object({ subject: z.string(), level: z.enum([...]) })).max(20).optional()`

### `createEducationSchema`
- `institution_name`: `z.string().min(2).max(200).trim()`
- `institution_type`: `z.enum(["school", "high_school", "university"])`
- `field_of_study`: `z.string().max(200).trim().optional()`
- `grade_or_level`: `z.string().max(100).trim().optional()`
- `start_year`: `z.number().int().min(1900).max(2100).optional()`
- `end_year`: `z.number().int().min(1900).max(2100).optional()`
- `is_current`: `z.boolean().optional().default(false)`

### `updateEducationSchema`
Same as create, but all fields optional.

---

## 6. Service Functions (`student.service.ts`)

| Function | Description |
|----------|-------------|
| `createOrUpdateProfile(userId, data)` | Upsert student_profiles row |
| `getMyProfile(userId)` | Fetch own profile + all education entries |
| `getStudentProfile(targetUserId)` | Fetch any student's public profile + education |
| `addEducation(userId, data)` | Insert education row |
| `updateEducation(userId, educationId, data)` | Update owned education row |
| `deleteEducation(userId, educationId)` | Delete owned education row |

---

## 7. Implementation Notes

- **Profile upsert:** Use Drizzle's `INSERT ... ON CONFLICT` (SQLite supports upsert via `onConflictDoUpdate`).
- **Role checks:** The `authenticate` middleware attaches `req.user`. Service functions receive `userId` and check ownership. Profile routes additionally verify `req.user.role === "student"`.
- **Education ownership:** Each education mutation verifies `education.user_id === userId` before modifying.
- **JSON fields:** Store `achievements`, `extra_curricular`, `tutoring_interests` as JSON strings. Parse/serialize at the service layer. Zod validates the array structure before serialization.
- **Tutoring interests structure:** `[{ subject: "Math", level: "high_school" }, { subject: "Physics", level: "college" }]` — using same level enum as jobs: `"preschool" | "elementary" | "middle_school" | "high_school" | "college" | "adult"`.
- **Error handling:** Match existing pattern — throw `ApiError` from services, catch in route handlers.
- **Migration:** After adding schema, run `npm run drizzle:generate` (or equivalent) to create migration SQL, then apply it.

---

## 8. Future Considerations (not in this scope)

- Avatar/image upload for student profiles
- Document/attachment upload for achievements (certificates)
- Public vs private visibility settings per field
- Search/filter students by education, subjects, etc.
- Tutor profile system (separate but similar pattern)
