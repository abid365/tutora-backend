CREATE TABLE `tutor_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`bio` text,
	`education` text,
	`years_of_experience` integer,
	`achievements` text,
	`certifications` text,
	`subjects` text,
	`grade_levels` text,
	`teaching_mode` text,
	`preferred_locations` text,
	`hourly_rate` integer,
	`currency` text DEFAULT 'BDT',
	`availability` text,
	`profile_image` text,
	`video_intro` text,
	`rating` real,
	`total_reviews` integer DEFAULT 0,
	`is_profile_complete` integer DEFAULT false,
	`is_verified` integer DEFAULT false,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tutor_profiles_user_id_unique` ON `tutor_profiles` (`user_id`);