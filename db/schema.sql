CREATE TABLE `domain` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `domain` varchar(255) DEFAULT NULL,
  `is_dns_valid` tinyint(1) DEFAULT NULL,
  `is_dns_valid_mx` tinyint(1) DEFAULT NULL,
  `is_private_mail` tinyint(1) DEFAULT NULL,
  `is_free_mail` tinyint(1) DEFAULT NULL,
  `is_disposable_mail` tinyint(1) DEFAULT NULL,
  `is_smtp_valid` tinyint(1) DEFAULT NULL,
  `is_smtp_catch_all` tinyint(1) DEFAULT NULL,
  `is_banned` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `domain` (`domain`)
) ENGINE=InnoDB;

CREATE TABLE `email` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `domain_id` bigint unsigned DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `verification_result` varchar(255) DEFAULT NULL,
  `is_private` tinyint(1) DEFAULT NULL,
  `last_verified_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB;

