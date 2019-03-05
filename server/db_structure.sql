DROP TABLE IF EXISTS `houses`;

CREATE TABLE `houses` (
  `id` INT AUTO_INCREMENT,
  `link` varchar(255) NOT NULL UNIQUE,
  `location_country` varchar(50) NOT NULL,
  `location_city` varchar(50) NOT NULL,
  `size_rooms` int NOT NULL,
  `price_value` float NOT NULL,
  `price_currency` varchar(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE (`link`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into `houses` (
  `link`,
  `location_country`,
  `location_city`,
  `size_rooms`,
  `price_value`,
  `price_currency`
) values (
  'hi',
  'hey',
  'ho',
  2,
  155.55,
  'EUR'
);