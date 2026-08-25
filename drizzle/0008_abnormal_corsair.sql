ALTER TABLE `seasonal_offers` ADD `sourceType` enum('official_retailer','approved_partner','manual_verification');--> statement-breakpoint
ALTER TABLE `seasonal_offers` ADD `sourceUrl` varchar(1024);--> statement-breakpoint
ALTER TABLE `seasonal_offers` ADD `termsSummary` varchar(800);--> statement-breakpoint
ALTER TABLE `seasonal_offers` ADD `linkType` enum('direct','affiliate') DEFAULT 'direct' NOT NULL;--> statement-breakpoint
ALTER TABLE `seasonal_offers` ADD `verifiedAt` timestamp;--> statement-breakpoint
ALTER TABLE `seasonal_offers` ADD `verifiedByUserId` int;