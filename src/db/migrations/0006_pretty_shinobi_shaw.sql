DROP INDEX "auth_access_token_unique";--> statement-breakpoint
DROP INDEX "uq_job_student";--> statement-breakpoint
ALTER TABLE `jobs` ALTER COLUMN "currency" TO "currency" text NOT NULL DEFAULT 'BDT';--> statement-breakpoint
CREATE UNIQUE INDEX `auth_access_token_unique` ON `auth` (`access_token`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_job_student` ON `applications` (`job_id`,`student_id`);