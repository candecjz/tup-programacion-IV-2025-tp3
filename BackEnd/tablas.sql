-- Tabla medicos
CREATE TABLE `medicos` (
  `idMedico` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `especialidad` varchar(45) NOT NULL,
  `matricula` varchar(45) NOT NULL,
  PRIMARY KEY (`idMedico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

-- Tabla pacientes
CREATE TABLE `pacientes` (
  `idPaciente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `DNI` varchar(45) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `obra_social` varchar(45) NOT NULL,
  PRIMARY KEY (`idPaciente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

-- Tabla turnos
CREATE TABLE `turnos` (
  `idTurno` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` enum('pendiente','atendido','cancelado') NOT NULL,
  `observaciones` varchar(45) NOT NULL,
  `paciente_id` int NOT NULL,
  `medico_id` int NOT NULL,
  PRIMARY KEY (`idTurno`),
  KEY `fk_medicoID_idx` (`medico_id`),
  KEY `fk_pacienteID_idx` (`paciente_id`),
  CONSTRAINT `fk_medicoID` FOREIGN KEY (`medico_id`) REFERENCES `medicos` (`idMedico`),
  CONSTRAINT `fk_pacienteID` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`idPaciente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

-- Tabla usuarios
CREATE TABLE `usuarios` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `contraseña` varchar(45) NOT NULL,
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

