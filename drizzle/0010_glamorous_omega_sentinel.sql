CREATE TABLE `ad_campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`advertiserId` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`body` varchar(480) NOT NULL,
	`placement` enum('homepage_sponsor','deal_hub','category_gallery') NOT NULL,
	`ctaLabel` varchar(48) NOT NULL,
	`destinationUrl` varchar(1024) NOT NULL,
	`creativeStorageKey` varchar(256) NOT NULL,
	`creativeUrl` varchar(1024) NOT NULL,
	`creativeAltText` varchar(240) NOT NULL,
	`allowedGeographies` varchar(256),
	`startsAt` timestamp NOT NULL,
	`endsAt` timestamp NOT NULL,
	`status` enum('draft','submitted','approved','scheduled','live','paused','ended','rejected','withdrawn') NOT NULL DEFAULT 'draft',
	`approvedByUserId` int,
	`approvedAt` timestamp,
	`withdrawalReason` varchar(800),
	`createdByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ad_campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `advertisers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brandName` varchar(160) NOT NULL,
	`legalName` varchar(256),
	`contactName` varchar(160),
	`contactEmail` varchar(320),
	`contactPhone` varchar(64),
	`websiteUrl` varchar(1024),
	`status` enum('prospect','active','blocked') NOT NULL DEFAULT 'prospect',
	`riskNotes` varchar(1000),
	`createdByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `advertisers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deal_candidates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceId` int NOT NULL,
	`providerProductId` varchar(256),
	`retailerName` varchar(128) NOT NULL,
	`category` varchar(96),
	`productName` varchar(256) NOT NULL,
	`productImageUrl` varchar(1024),
	`productUrl` varchar(1024) NOT NULL,
	`currencyCode` varchar(8) NOT NULL,
	`currentPrice` varchar(32),
	`previousPrice` varchar(32),
	`calculatedDiscountPercent` int,
	`sourceUrl` varchar(1024) NOT NULL,
	`termsSummary` varchar(800) NOT NULL,
	`allowedGeographies` varchar(256),
	`fetchedAt` timestamp NOT NULL,
	`verifiedAt` timestamp,
	`expiresAt` timestamp NOT NULL,
	`status` enum('staged','approved','published','withdrawn','expired','rejected') NOT NULL DEFAULT 'staged',
	`reviewedByUserId` int,
	`reviewedAt` timestamp,
	`withdrawalReason` varchar(800),
	`rotationWeight` int NOT NULL DEFAULT 1,
	`lastPresentedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deal_candidates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deal_refresh_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceId` int NOT NULL,
	`status` enum('started','succeeded','failed','skipped') NOT NULL,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`candidatesReceived` int NOT NULL DEFAULT 0,
	`candidatesStaged` int NOT NULL DEFAULT 0,
	`errorSummary` varchar(1024),
	CONSTRAINT `deal_refresh_runs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deal_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`providerName` varchar(160) NOT NULL,
	`providerKind` enum('manual','affiliate_feed','approved_api') NOT NULL DEFAULT 'manual',
	`status` enum('draft','approved','paused','disabled') NOT NULL DEFAULT 'draft',
	`sourceTermsUrl` varchar(1024),
	`permittedFields` text,
	`allowedGeographies` varchar(256),
	`enabled` enum('no','yes') NOT NULL DEFAULT 'no',
	`scheduleCronTaskUid` varchar(65),
	`lastRefreshStartedAt` timestamp,
	`lastRefreshSucceededAt` timestamp,
	`lastRefreshError` varchar(1024),
	`createdByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deal_sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `deal_sources_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE INDEX `ad_campaigns_public_placement_idx` ON `ad_campaigns` (`status`,`placement`,`startsAt`,`endsAt`);--> statement-breakpoint
CREATE INDEX `deal_candidates_public_rotation_idx` ON `deal_candidates` (`status`,`expiresAt`,`rotationWeight`);--> statement-breakpoint
CREATE INDEX `deal_candidates_source_idx` ON `deal_candidates` (`sourceId`,`providerProductId`);--> statement-breakpoint
CREATE INDEX `deal_refresh_runs_source_idx` ON `deal_refresh_runs` (`sourceId`,`startedAt`);--> statement-breakpoint
CREATE INDEX `deal_sources_schedule_task_idx` ON `deal_sources` (`scheduleCronTaskUid`);