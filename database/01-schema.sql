-- Habilitar extensión PostGIS para funciones espaciales (geolocalización)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. TIPOS ENUMERADOS (PostgreSQL requiere crearlos explícitamente)
CREATE TYPE severidad_enum AS ENUM ('Baja', 'Media', 'Alta', 'Critica');
CREATE TYPE estado_puntos_enum AS ENUM ('Pendiente', 'Otorgado', 'Rechazado');

-- 2. TABLAS CATÁLOGO
CREATE TABLE ESTADO (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE CATEGORIA (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    color_hex VARCHAR(7)
);

-- 3. TABLAS DE USUARIOS
CREATE TABLE USUARIO (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    correo_electronico VARCHAR(150) UNIQUE NOT NULL,
    email_verificado BOOLEAN DEFAULT FALSE,
    contrasena_hash VARCHAR(255) NOT NULL,
    puntos_totales INT DEFAULT 0, 
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nivel_ranking VARCHAR(50) DEFAULT 'Novato'
);

-- Tabla para gestionar tokens de validación y recuperación de contraseñas
CREATE TABLE TOKEN_AUTENTICACION (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES USUARIO(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- Ej: 'VERIFICACION_CORREO', 'RECUPERACION_PASSWORD'
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira_en TIMESTAMP NOT NULL,
    usado BOOLEAN DEFAULT FALSE
);

CREATE TABLE ADMINISTRADOR (
    id INT PRIMARY KEY REFERENCES USUARIO(id) ON DELETE CASCADE,
    nivel_acceso VARCHAR(50) NOT NULL,
    ultimo_acceso TIMESTAMP
);

-- 4. TABLA CENTRAL: REPORTE (Con PostGIS para optimización espacial)
CREATE TABLE REPORTE (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    
    -- Tipo espacial de PostGIS (SRID 4326 es el estándar GPS)
    ubicacion GEOGRAPHY(POINT, 4326) NOT NULL,
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    
    severidad severidad_enum DEFAULT 'Baja',
    url_evidencia_foto VARCHAR(255),
    
    puntos_asignados INT DEFAULT 0,
    estado_puntos estado_puntos_enum DEFAULT 'Pendiente',
    
    usuario_id INT NOT NULL REFERENCES USUARIO(id) ON DELETE CASCADE,
    estado_id INT NOT NULL REFERENCES ESTADO(id),
    categoria_id INT NOT NULL REFERENCES CATEGORIA(id)
);

-- Índice GIST esencial para que las consultas geográficas sean inmediatas
CREATE INDEX idx_reporte_ubicacion ON REPORTE USING GIST (ubicacion);

-- 5. TABLA DE NOTIFICACIONES
CREATE TABLE NOTIFICACION (
    id SERIAL PRIMARY KEY,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    tipo VARCHAR(50),
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NOT NULL REFERENCES USUARIO(id) ON DELETE CASCADE,
    reporte_id INT REFERENCES REPORTE(id) ON DELETE SET NULL
);
