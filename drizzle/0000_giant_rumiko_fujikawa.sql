CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`orderId` int NOT NULL,
	`type` varchar(64) NOT NULL DEFAULT 'order_status',
	`title` varchar(256) NOT NULL,
	`body` varchar(1024) NOT NULL,
	`statusFrom` varchar(32),
	`statusTo` varchar(32),
	`read` enum('no','yes') NOT NULL DEFAULT 'no',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ref` varchar(32) NOT NULL,
	`userId` int NOT NULL,
	`store` varchar(128) NOT NULL,
	`item` varchar(512) NOT NULL,
	`destination` varchar(128) NOT NULL,
	`amountGbp` varchar(32) NOT NULL,
	`amountLocal` varchar(64),
	`currencyCode` varchar(8) DEFAULT 'GBP',
	`weightKg` varchar(16),
	`status` enum('pending_purchase','purchased','in_warehouse','shipped','arrived','local_dispatch','delivered') NOT NULL DEFAULT 'pending_purchase',
	`timeline` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_ref_unique` UNIQUE(`ref`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ref` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`orderId` int,
	`gateway` varchar(64) NOT NULL,
	`status` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
	`amount` varchar(32) NOT NULL,
	`currencyCode` varchar(8) NOT NULL DEFAULT 'GBP',
	`destination` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_ref_unique` UNIQUE(`ref`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
