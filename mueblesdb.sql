-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 05, 2020 at 09:39 PM
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
-- Database: `mueblesdb`
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
(2, 'azus', 1, '2020-12-05 03:16:03');

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
(1, 1, 'description', 'description content'),
(2, 2, 'description', 'description content');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_products`
--

CREATE TABLE `tbl_products` (
  `id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL,
  `category_id` mediumint(5) NOT NULL,
  `featured_status` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `date_created` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_products`
--

INSERT INTO `tbl_products` (`id`, `name`, `category_id`, `featured_status`, `status`, `date_created`) VALUES
(1, 'product item 1', 1, 0, 1, '2020-11-12 06:47:52'),
(2, 'product item 2', 7, 0, 1, '2020-11-12 06:59:02'),
(3, 'product item 3', 8, 0, 1, '2020-11-12 06:59:18'),
(4, 'product item 4', 6, 0, 1, '2020-11-12 06:59:32'),
(5, 'product item 5', 1, 0, 1, '2020-11-12 06:59:45'),
(6, 'product item 6', 7, 0, 1, '2020-11-12 07:00:06'),
(7, 'product item 7', 5, 0, 1, '2020-11-12 07:00:18'),
(8, 'product item 8', 7, 0, 1, '2020-11-12 07:00:30'),
(9, 'product item 9', 8, 0, 1, '2020-11-12 07:00:38'),
(10, 'product item 10', 6, 0, 1, '2020-11-12 07:00:51'),
(11, 'product item 11', 7, 0, 1, '2020-11-12 07:01:23'),
(12, 'product item 12', 5, 0, 1, '2020-11-12 07:01:31'),
(13, 'product item 13', 6, 0, 1, '2020-11-12 07:01:38'),
(14, 'product item 14', 7, 0, 1, '2020-11-12 07:01:48'),
(15, 'product item 15', 5, 0, 1, '2020-11-12 07:01:58');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_products_attributes`
--

CREATE TABLE `tbl_products_attributes` (
  `id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `meta_key` varchar(500) NOT NULL,
  `meta_value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
(3, 1, 'price', '250'),
(4, 1, 'description', 'product item 1'),
(5, 2, 'gallery', ''),
(6, 2, 'image', ''),
(7, 2, 'price', '130'),
(8, 2, 'description', 'product item 2'),
(9, 3, 'gallery', ''),
(10, 3, 'image', ''),
(11, 3, 'price', '150'),
(12, 3, 'description', 'product item 3'),
(13, 4, 'gallery', ''),
(14, 4, 'image', ''),
(15, 4, 'price', '260'),
(16, 4, 'description', 'product item 4'),
(17, 5, 'gallery', ''),
(18, 5, 'image', ''),
(19, 5, 'price', '220'),
(20, 5, 'description', 'product item 5'),
(21, 6, 'gallery', ''),
(22, 6, 'image', ''),
(23, 6, 'price', '130'),
(24, 6, 'description', 'product item 6'),
(25, 7, 'gallery', ''),
(26, 7, 'image', ''),
(27, 7, 'price', '460'),
(28, 7, 'description', 'product item 7'),
(29, 8, 'gallery', ''),
(30, 8, 'image', ''),
(31, 8, 'price', '350'),
(32, 8, 'description', 'product item 8'),
(33, 9, 'gallery', ''),
(34, 9, 'image', ''),
(35, 9, 'price', '355'),
(36, 9, 'description', 'product item 9'),
(37, 10, 'gallery', ''),
(38, 10, 'image', ''),
(39, 10, 'price', '332'),
(40, 10, 'description', 'product item 10'),
(41, 11, 'gallery', ''),
(42, 11, 'image', ''),
(43, 11, 'price', '120'),
(44, 11, 'description', 'product item 11'),
(45, 12, 'gallery', ''),
(46, 12, 'image', ''),
(47, 12, 'price', '125'),
(48, 12, 'description', 'product item 12'),
(49, 13, 'gallery', ''),
(50, 13, 'image', ''),
(51, 13, 'price', '145'),
(52, 13, 'description', 'product item 13'),
(53, 14, 'gallery', ''),
(54, 14, 'image', ''),
(55, 14, 'price', '165'),
(56, 14, 'description', 'product item 14'),
(57, 15, 'gallery', ''),
(58, 15, 'image', ''),
(59, 15, 'price', '170'),
(60, 15, 'description', 'product item 15');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `avatar` varchar(500) NOT NULL,
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

INSERT INTO `tbl_users` (`id`, `avatar`, `username`, `password`, `first_name`, `middle_name`, `last_name`, `type`, `status`, `date_created`) VALUES
(1, 'renier.jpg', 'renier', 'd033e22ae348aeb5660fc2140aec35850c4da997', 'Renier', '', 'Rumbaoa', 1, 1, '2020-06-27 21:53:14'),
(7, '', 'aa', 'e0c9035898dd52fc65c41454cec9c4d2611bfb37', 'aa', '', 'aa', 1, 0, '2020-11-08 13:27:22');

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
(12, 6, 'description', 'description content');

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
-- Indexes for table `tbl_products`
--
ALTER TABLE `tbl_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_products_attributes`
--
ALTER TABLE `tbl_products_attributes`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_brands_meta`
--
ALTER TABLE `tbl_brands_meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_products`
--
ALTER TABLE `tbl_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tbl_products_attributes`
--
ALTER TABLE `tbl_products_attributes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_products_meta`
--
ALTER TABLE `tbl_products_meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_users_meta`
--
ALTER TABLE `tbl_users_meta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
