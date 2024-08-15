CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`roomId` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
