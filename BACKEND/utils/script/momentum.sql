-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-05-2025 a las 20:52:28
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `momentum`
--
CREATE DATABASE IF NOT EXISTS `momentum` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `momentum`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas`
--

DROP TABLE IF EXISTS `tareas`;
CREATE TABLE IF NOT EXISTS `tareas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` varchar(50) NOT NULL,
  `prioridad` varchar(50) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_finalizacion` timestamp NULL DEFAULT NULL,
  `fecha_edicion` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_creador` int(11) DEFAULT NULL,
  `lista_id` varchar(255) DEFAULT NULL,
  `etiquetas` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_creador` (`id_creador`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` varchar(50) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_edicion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `correo`, `usuario`, `contrasena`, `rol`, `fecha_creacion`, `fecha_edicion`) VALUES
(5, 'Superadmin', 'admin@admin.com', 'Superadmin', '$2b$10$qTaLDqJe9BxGQ0rjxFVFiekqmAApjxBu9BYUZodwSZSy9iCmAzi.C', 'SUPERADMIN', '2025-05-05 16:11:10', '2025-05-08 17:47:09'),
(8, 'Placido Jung', 'plapar@alu.edu.gva.es', 'plapar', '$2b$10$Z5t3EuhRKmsWMYnmAI3wqOVGh0rVTayMKuMhklh3LvkWZLLTgXnyC', 'ADMIN', '2025-05-07 21:18:25', '2025-05-07 21:18:25'),
(10, 'user', 'user@gmail.com', 'user', '$2b$10$Ae5FukYlFKjsOA8263Ddx.wCiyuXettziKAmh/9pA0otDYEmLIDei', 'USER', '2025-05-08 16:04:05', '2025-05-08 16:04:05');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD CONSTRAINT `tareas_ibfk_1` FOREIGN KEY (`id_creador`) REFERENCES `usuario` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
