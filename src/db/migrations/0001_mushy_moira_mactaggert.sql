ALTER TABLE `auth` RENAME COLUMN "token" TO "access_token";--> statement-breakpoint
DROP INDEX `auth_token_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `auth_access_token_unique` ON `auth` (`access_token`);