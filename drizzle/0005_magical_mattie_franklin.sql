CREATE TABLE `operation_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kind` varchar(64) NOT NULL DEFAULT 'cart_screenshot',
	`orderId` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`body` varchar(1024) NOT NULL,
	`read` enum('no','yes') NOT NULL DEFAULT 'no',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `operation_alerts_id` PRIMARY KEY(`id`)
);
