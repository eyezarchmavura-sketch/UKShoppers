CREATE TABLE `seasonal_offers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storeName` varchar(128) NOT NULL,
	`title` varchar(160) NOT NULL,
	`details` varchar(800) NOT NULL,
	`offerUrl` varchar(1024),
	`couponCode` varchar(96),
	`validFrom` timestamp,
	`validUntil` timestamp,
	`status` enum('draft','published','expired') NOT NULL DEFAULT 'draft',
	`createdByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seasonal_offers_id` PRIMARY KEY(`id`)
);
