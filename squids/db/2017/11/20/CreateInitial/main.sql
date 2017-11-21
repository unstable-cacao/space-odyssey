-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 21, 2017 at 09:30 AM
-- Server version: 5.7.20-0ubuntu0.16.04.1-log
-- PHP Version: 7.1.7-1+ubuntu16.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


-- --------------------------------------------------------

--
-- Table structure for table `Log`
--

CREATE TABLE `Log` (
  `ID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `LogDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Data` json DEFAULT NULL,
  `Note` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Party`
--

CREATE TABLE `Party` (
  `ID` int(11) NOT NULL,
  `Created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Deleted` datetime NOT NULL DEFAULT '3999-12-31 23:59:59',
  `Name` varchar(128) NOT NULL,
  `Description` text,
  `Thumbnail` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `PartyMember`
--

CREATE TABLE `PartyMember` (
  `UserID` int(11) NOT NULL,
  `PartyID` int(11) NOT NULL,
  `Created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Deleted` datetime NOT NULL DEFAULT '3999-12-31 23:59:59',
  `Role` enum('Owner','Admin','Peasant') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Personality`
--

CREATE TABLE `Personality` (
  `ID` int(11) NOT NULL,
  `Created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Deleted` datetime NOT NULL DEFAULT '3999-12-31 23:59:59',
  `Name` varchar(128) NOT NULL,
  `Description` text,
  `IsGlobal` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `PersonalTrait`
--

CREATE TABLE `PersonalTrait` (
  `ID` int(11) NOT NULL,
  `Created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Deleted` datetime NOT NULL DEFAULT '3999-12-31 23:59:59',
  `Name` varchar(128) NOT NULL,
  `Descritpion` text,
  `PersonalityPoints` int(11) NOT NULL,
  `IsGlobal` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Session`
--

CREATE TABLE `Session` (
  `ID` char(128) NOT NULL,
  `Created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UserID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Skill`
--

CREATE TABLE `Skill` (
  `ID` int(11) NOT NULL,
  `Created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Deleted` datetime NOT NULL DEFAULT '3999-12-31 23:59:59',
  `Name` varchar(128) NOT NULL,
  `Description` text,
  `Category` varchar(128) DEFAULT NULL,
  `PointDescriptions` json DEFAULT NULL,
  `IsGlobal` tinyint(1) NOT NULL DEFAULT 0,
  `Thumbnail` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `ID` int(11) NOT NULL,
  `Created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Deleted` datetime NOT NULL DEFAULT '3999-12-31 23:59:59',
  `Username` varchar(128) NOT NULL,
  `Password` varchar(256) NOT NULL,
  `Email` varchar(256) NOT NULL,
  `Fullname` varchar(256) DEFAULT NULL,
  `DateOfBirth` datetime DEFAULT NULL,
  `Sex` enum('Female','Male') DEFAULT NULL,
  `IsBanned` tinyint(1) NOT NULL DEFAULT 0,
  `Thumbnail` varchar(256) DEFAULT NULL,
  `Description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Log`
--
ALTER TABLE `Log`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `fk_Log_User` (`UserID`);

--
-- Indexes for table `Party`
--
ALTER TABLE `Party`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `PartyMember`
--
ALTER TABLE `PartyMember`
  ADD PRIMARY KEY (`UserID`,`PartyID`),
  ADD KEY `fk_PartyMember_Party` (`PartyID`);

--
-- Indexes for table `Personality`
--
ALTER TABLE `Personality`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `PersonalTrait`
--
ALTER TABLE `PersonalTrait`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `Session`
--
ALTER TABLE `Session`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `fk_Session_User` (`UserID`);

--
-- Indexes for table `Skill`
--
ALTER TABLE `Skill`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Log`
--
ALTER TABLE `Log`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Party`
--
ALTER TABLE `Party`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Personality`
--
ALTER TABLE `Personality`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `PersonalTrait`
--
ALTER TABLE `PersonalTrait`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Skill`
--
ALTER TABLE `Skill`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `Log`
--
ALTER TABLE `Log`
  ADD CONSTRAINT `fk_Log_User` FOREIGN KEY (`UserID`) REFERENCES `User` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `PartyMember`
--
ALTER TABLE `PartyMember`
  ADD CONSTRAINT `fk_PartyMember_Party` FOREIGN KEY (`PartyID`) REFERENCES `Party` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_PartyMember_User` FOREIGN KEY (`UserID`) REFERENCES `User` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Session`
--
ALTER TABLE `Session`
  ADD CONSTRAINT `fk_Session_User` FOREIGN KEY (`UserID`) REFERENCES `User` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
