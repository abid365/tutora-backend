CREATE TABLE `applications` (
	`id` text PRIMARY KEY NOT NULL,
	`job_id` text NOT NULL,
	`student_id` text NOT NULL,
	`message` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_job_student` ON `applications` (`job_id`,`student_id`);