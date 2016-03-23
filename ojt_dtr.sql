-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Feb 22, 2016 at 11:22 AM
-- Server version: 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `ojt_dtr`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE IF NOT EXISTS `accounts` (
`account_id` int(1) NOT NULL,
  `account_username` varchar(30) NOT NULL,
  `account_password` varchar(30) NOT NULL,
  `account_person_id` int(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `account_username`, `account_password`, `account_person_id`) VALUES
(1, 'abs', 'misojt', 1),
(4, 'ddd', 'dddd', 2);

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE IF NOT EXISTS `admin` (
`admin_id` int(11) NOT NULL,
  `admin_fullname` varchar(200) NOT NULL,
  `admin_person_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE IF NOT EXISTS `attendance` (
`attendance_id` int(11) NOT NULL,
  `attendance_ojt_id` int(11) NOT NULL,
  `attendance_login` time NOT NULL,
  `attendance_logout` time DEFAULT NULL,
  `attendance_date` date NOT NULL,
  `attendance_hours_earned` double NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`attendance_id`, `attendance_ojt_id`, `attendance_login`, `attendance_logout`, `attendance_date`, `attendance_hours_earned`) VALUES
(75, 1, '11:09:31', '11:09:34', '2016-02-22', 0),
(76, 1, '11:12:11', '11:12:14', '2016-02-22', 0),
(77, 1, '11:13:49', '11:13:51', '2016-02-22', 0),
(78, 1, '11:15:28', '11:15:29', '2016-02-22', 0),
(79, 1, '11:17:05', '11:17:08', '2016-02-22', 0),
(80, 1, '11:21:48', '11:21:49', '2016-02-22', 0),
(81, 1, '11:21:59', '11:22:01', '2016-02-22', 0),
(82, 1, '11:24:58', '11:40:53', '2016-02-22', 0.16),
(83, 1, '11:47:33', '17:39:52', '2016-02-22', 5.92),
(84, 2, '07:59:18', '01:00:00', '2016-02-08', 33),
(85, 2, '03:00:00', '00:15:00', '2016-02-17', 102.1);

-- --------------------------------------------------------

--
-- Table structure for table `ojt`
--

CREATE TABLE IF NOT EXISTS `ojt` (
`ojt_id` int(11) NOT NULL,
  `ojt_person_id` int(11) NOT NULL,
  `ojt_hours_needed` int(3) NOT NULL,
  `ojt_school` varchar(200) NOT NULL,
  `status` enum('in','out') NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ojt`
--

INSERT INTO `ojt` (`ojt_id`, `ojt_person_id`, `ojt_hours_needed`, `ojt_school`, `status`) VALUES
(1, 2, 700, 'University of the Philippines', 'out'),
(2, 3, 400, 'MSU-Iligan\r\n', 'out'),
(3, 4, 200, 'MSU-Marawi', 'out');

-- --------------------------------------------------------

--
-- Table structure for table `person`
--

CREATE TABLE IF NOT EXISTS `person` (
`person_id` int(11) NOT NULL,
  `person_fullname` varchar(200) NOT NULL,
  `person_type` varchar(10) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `person`
--

INSERT INTO `person` (`person_id`, `person_fullname`, `person_type`) VALUES
(1, 'Abufirash Abdulhamid', 'admin'),
(2, 'John Loyd', 'ojt'),
(3, 'Piolo Pascual', 'ojt'),
(4, 'Roberto Sanchez', 'ojt');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
 ADD PRIMARY KEY (`account_id`), ADD UNIQUE KEY `account_ojt_id` (`account_person_id`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
 ADD PRIMARY KEY (`admin_id`), ADD KEY `admin_person_id` (`admin_person_id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
 ADD PRIMARY KEY (`attendance_id`), ADD KEY `attendance_ojt_id` (`attendance_ojt_id`);

--
-- Indexes for table `ojt`
--
ALTER TABLE `ojt`
 ADD PRIMARY KEY (`ojt_id`), ADD KEY `ojt_person_id` (`ojt_person_id`);

--
-- Indexes for table `person`
--
ALTER TABLE `person`
 ADD PRIMARY KEY (`person_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
MODIFY `account_id` int(1) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=86;
--
-- AUTO_INCREMENT for table `ojt`
--
ALTER TABLE `ojt`
MODIFY `ojt_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `person`
--
ALTER TABLE `person`
MODIFY `person_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`account_person_id`) REFERENCES `person` (`person_id`);

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`admin_person_id`) REFERENCES `person` (`person_id`);

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`attendance_ojt_id`) REFERENCES `ojt` (`ojt_id`);

--
-- Constraints for table `ojt`
--
ALTER TABLE `ojt`
ADD CONSTRAINT `ojt_ibfk_1` FOREIGN KEY (`ojt_person_id`) REFERENCES `person` (`person_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
