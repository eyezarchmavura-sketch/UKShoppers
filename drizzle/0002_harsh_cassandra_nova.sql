CREATE TABLE `payment_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`paymentId` int,
	`provider` varchar(64) NOT NULL,
	`providerEventId` varchar(160) NOT NULL,
	`eventType` varchar(96) NOT NULL,
	`verificationStatus` enum('verified','rejected') NOT NULL,
	`payload` text,
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payment_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `payment_events_providerEventId_unique` UNIQUE(`providerEventId`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','staff','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `payments` ADD `providerTransactionId` varchar(128);--> statement-breakpoint
ALTER TABLE `payments` ADD `settledAt` timestamp;