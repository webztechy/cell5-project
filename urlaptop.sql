-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 09, 2020 at 06:37 PM
-- Server version: 10.3.15-MariaDB
-- PHP Version: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `urlaptop`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_attributes`
--

CREATE TABLE `tbl_attributes` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `date_created` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_attributes`
--

INSERT INTO `tbl_attributes` (`id`, `name`, `status`, `date_created`) VALUES
(1, 'color', 1, '2020-12-05 03:16:03'),
(2, 'screen size', 1, '2020-12-05 03:16:03');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_attributes_meta`
--

CREATE TABLE `tbl_attributes_meta` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `meta_key` varchar(500) NOT NULL,
  `meta_value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_attributes_meta`
--

INSERT INTO `tbl_attributes_meta` (`id`, `group_id`, `meta_key`, `meta_value`) VALUES
(1, 1, 'attribute_id', '1'),
(2, 1, 'value', 'red'),
(3, 2, 'attribute_id', '1'),
(4, 2, 'value', 'black'),
(5, 3, 'attribute_id', '1'),
(6, 3, 'value', 'green'),
(7, 4, 'attribute_id', '1'),
(8, 4, 'value', 'blue'),
(9, 5, 'attribute_id', '2'),
(10, 5, 'value', '1920x937'),
(11, 6, 'attribute_id', '2'),
(12, 6, 'value', '1440x937');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_brands`
--

CREATE TABLE `tbl_brands` (
  `id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `date_created` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_brands`
--

INSERT INTO `tbl_brands` (`id`, `name`, `status`, `date_created`) VALUES
(1, 'acer', 1, '2020-12-05 03:16:03'),
(2, 'asus', 1, '2020-12-05 03:16:03'),
(9, 'toshiba', 1, '2020-12-08 17:28:36'),
(10, 'samsung', 1, '2020-12-08 17:29:15'),
(11, 'Apple', 1, '2020-12-08 17:31:25'),
(12, 'Lenovo', 1, '2020-12-08 17:31:32'),
(13, 'HP', 1, '2020-12-08 17:31:41'),
(14, 'MSI', 0, '2020-12-08 17:32:06'),
(15, 'Microsoft', 0, '2020-12-08 17:32:40'),
(16, 'Dell', 1, '2020-12-08 17:33:07');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_brands_meta`
--

CREATE TABLE `tbl_brands_meta` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `meta_key` varchar(500) NOT NULL,
  `meta_value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_brands_meta`
--

INSERT INTO `tbl_brands_meta` (`id`, `group_id`, `meta_key`, `meta_value`) VALUES
(1, 1, 'description', 'acer content'),
(2, 2, 'description', 'asus content'),
(5, 9, 'description', 'toshiba desciption'),
(6, 10, 'description', 'samsung description'),
(7, 11, 'description', 'Apple Description'),
(8, 12, 'description', 'Lenovo Description'),
(9, 13, 'description', 'HP Description'),
(10, 14, 'description', 'MSI description'),
(11, 15, 'description', 'Microsoft Description'),
(12, 16, 'description', 'Dell Description');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_orders`
--

CREATE TABLE `tbl_orders` (
  `id` int(11) NOT NULL,
  `order_number` varchar(250) NOT NULL,
  `price` float NOT NULL,
  `date_created` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_orders`
--

INSERT INTO `tbl_orders` (`id`, `order_number`, `price`, `date_created`) VALUES
(1, '1111', 29432.2, '2020-12-09 00:00:00'),
(3, '1112', 52114, '2020-12-09 00:00:00'),
(5, '1223', 430, '2020-12-09 16:58:44');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_orders_meta`
--

CREATE TABLE `tbl_orders_meta` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `meta_key` varchar(500) NOT NULL,
  `meta_value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_orders_meta`
--

INSERT INTO `tbl_orders_meta` (`id`, `group_id`, `meta_key`, `meta_value`) VALUES
(1, 1, 'items', '11:14:23.23|12:15:900|13:22:430|11:2:2199|12:1:1749'),
(3, 3, 'items', '11:23:23.23|12:2:900|13:23:430'),
(5, 5, 'items', '17:1:200|21:1:30|18:1:200');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_products`
--

CREATE TABLE `tbl_products` (
  `id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL,
  `brand_id` mediumint(5) NOT NULL,
  `price` float NOT NULL,
  `featured_status` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `date_created` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_products`
--

INSERT INTO `tbl_products` (`id`, `name`, `brand_id`, `price`, `featured_status`, `status`, `date_created`) VALUES
(1, 'Acer Nitro 5 AN515-54-728C Gaming Laptop', 1, 4799, 1, 1, '2020-11-12 06:47:52'),
(2, 'Dell Alienware m17 R2 Gaming Laptop', 16, 11999, 0, 1, '2020-11-12 06:59:02'),
(3, 'Dell XPS 13 7390 2-in-1 Touch Laptop', 16, 10089, 1, 1, '2020-11-12 06:59:18'),
(4, 'Dell XPS 13 7390 2-in-1 Touch Laptop', 16, 7099, 0, 1, '2020-11-12 06:59:32'),
(5, 'MacBook Air 13-inch (2020) ', 11, 3439, 0, 1, '2020-11-12 06:59:45'),
(6, 'MacBook Pro 16-inch (2019)', 11, 9999, 0, 1, '2020-11-12 07:00:06'),
(7, 'MacBook Air 13-inch (2017)', 11, 3249, 0, 1, '2020-11-12 07:00:18'),
(8, 'Asus VivoBook Flip 14 TP401MA-EC123TS Laptop ', 2, 1699, 0, 1, '2020-11-12 07:00:30'),
(9, 'Asus X509JB-BR039T 90NB0QD2-m00980', 2, 2799, 0, 1, '2020-11-12 07:00:38'),
(10, 'Lenovo IdeaPad Flex 5 14IIL05', 12, 2399, 0, 1, '2020-11-12 07:00:51'),
(11, 'Lenovo ideapad S145-14IWL Laptop', 12, 2199, 0, 1, '2020-11-12 07:01:23'),
(12, 'Lenovo ideapad 130-15IKB Laptop', 12, 1749, 0, 1, '2020-11-12 07:01:31'),
(13, 'Microsoft Surface Pro 7', 15, 4149, 1, 1, '2020-11-12 07:01:38'),
(14, 'Microsoft Surface Laptop 3', 15, 6599, 1, 1, '2020-11-12 07:01:48'),
(15, 'Microsoft Surface Go', 15, 1799, 1, 1, '2020-11-12 07:01:58'),
(16, 'MSI GF75 Thin 10SCSR-005 Gaming Laptop', 14, 4899, 0, 0, '2020-11-12 07:01:58'),
(17, 'Acer Spin 1 SP111-34N-C2YP Laptop', 1, 1399, 1, 1, '2020-11-12 07:01:58'),
(18, 'Acer Aspire 1 A114-32-C2VZ Laptop', 1, 1200, 0, 1, '2020-11-12 07:01:58'),
(19, 'Acer A315-56-594W Aspire 3 Laptop ', 1, 2139, 0, 0, '2020-11-12 07:01:58'),
(20, 'Acer Swift 7 SF714-52T-740V Laptop', 1, 5999, 0, 0, '2020-11-12 07:01:58'),
(21, 'Acer Aspire 3 A315-56-365E Laptop', 1, 1999, 0, 1, '2020-12-07 20:12:35'),
(22, 'Acer Aspire A114-32-C2VZ Celeron Laptop', 1, 1199, 0, 1, '2020-12-08 19:15:39');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_products_meta`
--

CREATE TABLE `tbl_products_meta` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `meta_key` varchar(500) NOT NULL,
  `meta_value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_products_meta`
--

INSERT INTO `tbl_products_meta` (`id`, `group_id`, `meta_key`, `meta_value`) VALUES
(1, 1, 'gallery', ''),
(2, 1, 'image', ''),
(4, 1, 'description', 'Core i7 2.6GHz 16GB 256GB Win10 15.6inch FHD Obsidian Black English keyboard'),
(5, 2, 'gallery', ''),
(6, 2, 'image', ''),
(8, 2, 'description', 'Core i7 2.6GHz 16GB 2TB 8GB Win10 17.3inch FHD Black'),
(9, 3, 'gallery', ''),
(10, 3, 'image', ''),
(12, 3, 'description', 'Core i7 1.3GHz 32GB 1TB Shared Win10 13.4inch UHD Silver'),
(13, 4, 'gallery', ''),
(14, 4, 'image', ''),
(16, 4, 'description', 'Core i7 1.3GHz 16GB 512GG Shared Win10 13.4inch FHD Silver'),
(17, 5, 'gallery', ''),
(18, 5, 'image', ''),
(20, 5, 'description', 'Core i3 1.1GHz 8GB 256GB Shared Space Grey English Keyboard'),
(21, 6, 'gallery', ''),
(22, 6, 'image', ''),
(24, 6, 'description', 'Core i7 2.6GHz 16GB 512GB 4GB Space Grey English/Arabic Keyboard'),
(25, 7, 'gallery', ''),
(26, 7, 'image', ''),
(28, 7, 'description', 'Core i5 1.8GHz 8GB 128GB Shared Silver English Keyboard'),
(29, 8, 'gallery', ''),
(30, 8, 'image', ''),
(32, 8, 'description', 'Celeron 1.1GHz 4GB 64GB Shared Win10 14inch FHD Grey'),
(33, 9, 'gallery', ''),
(34, 9, 'image', ''),
(36, 9, 'description', 'Laptop Corei7-1065G7 8GB 1TB HDD 2GB Win10 15.6inch HD Slate Grey English Keyboard'),
(37, 10, 'gallery', ''),
(38, 10, 'image', ''),
(40, 10, 'description', 'Core i3 1.2GHz 4GB 256GB Shared Win10 14inch FHD Graphite Grey English/Arabic Keyboard'),
(41, 11, 'gallery', ''),
(42, 11, 'image', ''),
(44, 11, 'description', 'Core i3 2.1GHz 4GB 256GB Shared Win10 14inch HD Granite Black'),
(45, 12, 'gallery', ''),
(46, 12, 'image', ''),
(48, 12, 'description', 'Core i3 2.3GHz 4GB 1TB Win10 Shared 15.6inch HD Granite Black'),
(49, 13, 'gallery', ''),
(50, 13, 'image', ''),
(52, 13, 'description', 'Core i5 1.1GHz 8GB 128GB Shared Win10 12.3inch Platinum'),
(53, 14, 'gallery', ''),
(54, 14, 'image', ''),
(56, 14, 'description', 'Core i7 1.3GHz 16GB 256GB Shared Win10 13.5inch Matte Black'),
(57, 15, 'gallery', ''),
(58, 15, 'image', ''),
(60, 15, 'description', 'Pentium Gold 1.6GHz 8GB 128GB Shared Win10s 10inch Silver'),
(61, 16, 'gallery', ''),
(62, 16, 'image', ''),
(63, 16, 'description', 'Core i7 2.6GHz 16GB 512GB 4GB Win10 17.3inch FHD Black English/Arabic Keyboard'),
(64, 17, 'gallery', ''),
(65, 17, 'image', ''),
(66, 17, 'description', 'Celeron 1.1GHz 4GB 64GB Shared Win10s 11.6inch FHD Grey'),
(67, 18, 'gallery', ''),
(68, 18, 'image', ''),
(69, 18, 'description', 'Celeron 1.1GHz 4GB 64GB Shared Win10s 14inch HD Black'),
(70, 19, 'gallery', ''),
(71, 19, 'image', ''),
(72, 19, 'description', 'Core i5 1035G1 8GB 256GB SSD Windows10 15.6inch FHD Grey English Keyboard 2 Pin Adapter'),
(73, 20, 'gallery', ''),
(74, 20, 'image', ''),
(75, 20, 'description', 'Core i7 1.5GHz 16GB 512GB Shared Win10Pro 14inch FHD White'),
(76, 21, 'gallery', ''),
(77, 21, 'image', ''),
(78, 21, 'description', 'Core i3 1.2GHz 4GB 256GB Shared Win10 15.6inch HD Black'),
(79, 22, 'gallery', ''),
(80, 22, 'image', ''),
(81, 22, 'description', 'Celeron 2.60GHz 4GB 64GB Windows 10 Home 14inch 1366 x 768 Black English/Arabic Keyboard');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `username` varchar(500) NOT NULL,
  `password` text NOT NULL,
  `first_name` varchar(250) NOT NULL,
  `middle_name` varchar(250) NOT NULL,
  `last_name` varchar(250) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT 2,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `date_created` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `username`, `password`, `first_name`, `middle_name`, `last_name`, `type`, `status`, `date_created`) VALUES
(1, 'renier', 'd033e22ae348aeb5660fc2140aec35850c4da997', 'Renier', '', 'Rumbaoa', 1, 1, '2020-06-27 21:53:14'),
(6, 'russel', '8c89fcc986279cd2cbe1babd0757b22d510b1f35', 'Russel', '', 'Rumbaoa', 2, 1, '2020-11-08 13:27:22'),
(8, 'reilan', '29b02eaa507c8a04f8a8105f501595516761093f', 'Reilan', '', 'Rumbaoa', 2, 1, '2020-12-08 19:10:51');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users_meta`
--

CREATE TABLE `tbl_users_meta` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `meta_key` varchar(500) NOT NULL,
  `meta_value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_users_meta`
--

INSERT INTO `tbl_users_meta` (`id`, `group_id`, `meta_key`, `meta_value`) VALUES
(4, 1, 'email', 'freelance.renier@gmail.com'),
(6, 1, 'contact_number', '0526229546'),
(8, 1, 'address', 'al barsha 1, dubai, uae'),
(13, 6, 'email', 'freelance.renier@gmail.com'),
(14, 6, 'contact_number', '0526229546'),
(15, 6, 'address', 'al barsha 1, dubai, uae'),
(16, 8, 'address', 'dubai, uae'),
(17, 8, 'contact_number', '12345'),
(18, 8, 'email', 'freelance.reilan@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_attributes`
--
ALTER TABLE `tbl_attributes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_attributes_meta`
--
ALTER TABLE `tbl_attributes_meta`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_brands`
--
ALTER TABLE `tbl_brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_brands_meta`
--
ALTER TABLE `tbl_brands_meta`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_orders`
--
ALTER TABLE `tbl_orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_orders_meta`
--
ALTER TABLE `tbl_orders_meta`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_products`
--
ALTER TABLE `tbl_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_products_meta`
--
ALTER TABLE `tbl_products_meta`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_users_meta`
--
ALTER TABLE `tbl_users_meta`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_attributes`
--
ALTER TABLE `tbl_attributes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_attributes_meta`
--
ALTER TABLE `tbl_attributes_meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tbl_brands`
--
ALTER TABLE `tbl_brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `tbl_brands_meta`
--
ALTER TABLE `tbl_brands_meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tbl_orders`
--
ALTER TABLE `tbl_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_orders_meta`
--
ALTER TABLE `tbl_orders_meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_products`
--
ALTER TABLE `tbl_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `tbl_products_meta`
--
ALTER TABLE `tbl_products_meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_users_meta`
--
ALTER TABLE `tbl_users_meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
