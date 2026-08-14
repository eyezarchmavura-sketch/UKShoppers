ALTER TABLE `orders` ADD `requestType` enum('product_link','cart_screenshot') DEFAULT 'product_link' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `screenshotKey` varchar(256);--> statement-breakpoint
ALTER TABLE `orders` ADD `screenshotFileName` varchar(256);