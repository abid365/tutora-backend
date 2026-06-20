PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_auth` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text NOT NULL,
	`created_at` integer,
	`expires_at` integer NOT NULL,
	`revoked_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_auth`("id", "user_id", "access_token", "created_at", "expires_at", "revoked_at") SELECT "id", "user_id", "access_token", "created_at", "expires_at", "revoked_at" FROM `auth`;--> statement-breakpoint
DROP TABLE `auth`;--> statement-breakpoint
ALTER TABLE `__new_auth` RENAME TO `auth`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `auth_access_token_unique` ON `auth` (`access_token`);