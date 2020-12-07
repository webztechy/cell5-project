-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 06, 2020 at 02:59 PM
-- Server version: 5.6.16
-- PHP Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `urlaptop`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_attributes`
--

CREATE TABLE IF NOT EXISTS `tbl_attributes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `date_created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

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

CREATE TABLE IF NOT EXISTS `tbl_attributes_meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `meta_key` varchar(500) NOT NULL,
  `meta_value` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;

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

CREATE TABLE IF NOT EXISTS `tbl_brands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `date_created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

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

CREATE TABLE IF NOT EXISTS `tbl_brands_meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `meta_key` varchar(500) NOT NULL,
  `meta_value` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

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

CREATE TABLE IF NOT EXISTS `tbl_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `brand_id` mediumint(5) NOT NULL,
  `price` float NOT NULL,
  `featured_status` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `date_created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=16 ;

--
-- Dumping data for table `tbl_products`
--

INSERT INTO `tbl_products` (`id`, `name`, `brand_id`, `price`, `featured_status`, `status`, `date_created`) VALUES
(1, 'product item 1', 1, 200, 0, 1, '2020-11-12 06:47:52'),
(2, 'product item 2', 7, 250, 0, 1, '2020-11-12 06:59:02'),
(3, 'product item 3', 8, 100, 0, 1, '2020-11-12 06:59:18'),
(4, 'product item 4', 6, 120, 0, 1, '2020-11-12 06:59:32'),
(5, 'product item 5', 1, 125, 0, 1, '2020-11-12 06:59:45'),
(6, 'product item 6', 7, 236, 0, 1, '2020-11-12 07:00:06'),
(7, 'product item 7', 5, 200, 0, 1, '2020-11-12 07:00:18'),
(8, 'product item 8', 7, 125, 0, 1, '2020-11-12 07:00:30'),
(9, 'product item 9', 8, 366, 0, 1, '2020-11-12 07:00:38'),
(10, 'product item 10', 6, 222, 0, 1, '2020-11-12 07:00:51'),
(11, 'product item 11', 7, 569, 0, 1, '2020-11-12 07:01:23'),
(12, 'product item 12', 5, 254, 0, 1, '2020-11-12 07:01:31'),
(13, 'product item 13', 6, 321, 0, 1, '2020-11-12 07:01:38'),
(14, 'product item 14', 7, 256, 0, 1, '2020-11-12 07:01:48'),
(15, 'product item 15', 5, 146, 0, 1, '2020-11-12 07:01:58');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_products_attributes`
--

CREATE TABLE IF NOT EXISTS `tbl_products_attributes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `meta_key` varchar(500) NOT NULL,
  `meta_value` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_products_meta`
--

CREATE TABLE IF NOT EXISTS `tbl_products_meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `meta_key` varchar(500) NOT NULL,
  `meta_value` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=61 ;

--
-- Dumping data for table `tbl_products_meta`
--

INSERT INTO `tbl_products_meta` (`id`, `group_id`, `meta_key`, `meta_value`) VALUES
(1, 1, 'gallery', ''),
(2, 1, 'image', ''),
(4, 1, 'description', 'product item 1'),
(5, 2, 'gallery', ''),
(6, 2, 'image', ''),
(8, 2, 'description', 'product item 2'),
(9, 3, 'gallery', ''),
(10, 3, 'image', ''),
(12, 3, 'description', 'product item 3'),
(13, 4, 'gallery', ''),
(14, 4, 'image', ''),
(16, 4, 'description', 'product item 4'),
(17, 5, 'gallery', ''),
(18, 5, 'image', ''),
(20, 5, 'description', 'product item 5'),
(21, 6, 'gallery', ''),
(22, 6, 'image', ''),
(24, 6, 'description', 'product item 6'),
(25, 7, 'gallery', ''),
(26, 7, 'image', ''),
(28, 7, 'description', 'product item 7'),
(29, 8, 'gallery', ''),
(30, 8, 'image', ''),
(32, 8, 'description', 'product item 8'),
(33, 9, 'gallery', ''),
(34, 9, 'image', ''),
(36, 9, 'description', 'product item 9'),
(37, 10, 'gallery', ''),
(38, 10, 'image', ''),
(40, 10, 'description', 'product item 10'),
(41, 11, 'gallery', ''),
(42, 11, 'image', ''),
(44, 11, 'description', 'product item 11'),
(45, 12, 'gallery', ''),
(46, 12, 'image', ''),
(48, 12, 'description', 'product item 12'),
(49, 13, 'gallery', ''),
(50, 13, 'image', ''),
(52, 13, 'description', 'product item 13'),
(53, 14, 'gallery', ''),
(54, 14, 'image', ''),
(56, 14, 'description', 'product item 14'),
(57, 15, 'gallery', ''),
(58, 15, 'image', ''),
(60, 15, 'description', 'product item 15');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE IF NOT EXISTS `tbl_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `avatar` varchar(500) NOT NULL,
  `username` varchar(500) NOT NULL,
  `password` text NOT NULL,
  `first_name` varchar(250) NOT NULL,
  `middle_name` varchar(250) NOT NULL,
  `last_name` varchar(250) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '2',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `date_created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

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

CREATE TABLE IF NOT EXISTS `tbl_users_meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `meta_key` varchar(500) NOT NULL,
  `meta_value` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `tbl_users_meta`
--

INSERT INTO `tbl_users_meta` (`id`, `group_id`, `meta_key`, `meta_value`) VALUES
(4, 1, 'email', 'freelance.renier@gmail.com'),
(6, 1, 'contact_number', '0526229546'),
(8, 1, 'address', 'al barsha 1, dubai, uae'),
(12, 6, 'description', 'description content');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
