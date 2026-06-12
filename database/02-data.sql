-- 02-data.sql
-- Datos iniciales y de prueba para la plataforma ARIA

-- 1. Insertar Estados posibles de un reporte
INSERT INTO ESTADO (nombre) VALUES 
('Recibido'),
('En Revisión'),
('Atendido'),
('Descartado');

-- 2. Insertar Categorías de problemas ambientales
INSERT INTO CATEGORIA (nombre, descripcion, color_hex) VALUES 
('Acumulación de Basura', 'Basureros clandestinos, falta de recolección', '#FF5733'),
('Fuga de Agua', 'Desperdicio de agua potable en la vía pública', '#33A1FF'),
('Tala Ilegal / Áreas Verdes', 'Tala de árboles no autorizada o abandono de parques', '#33FF57'),
('Contaminación del Aire', 'Emisiones tóxicas, quemas clandestinas', '#8E44AD');

-- 3. Insertar Usuarios de prueba (contraseñas son hashes simulados)
INSERT INTO USUARIO (nombre_completo, correo_electronico, email_verificado, contrasena_hash, puntos_totales, nivel_ranking) VALUES 
('Juan Pérez', 'juan.perez@example.com', true, 'hashed_pwd_123', 150, 'Ciudadano Activo'),
('María Gómez', 'maria.gomez@example.com', true, 'hashed_pwd_456', 50, 'Novato'),
('Carlos Administrador', 'admin@ariaplataforma.org', true, 'hashed_admin_pwd', 1000, 'Guardián Ambiental');

-- 4. Asignar rol de Administrador
INSERT INTO ADMINISTRADOR (id, nivel_acceso, ultimo_acceso) VALUES 
(3, 'SuperAdmin', CURRENT_TIMESTAMP);

-- 5. Insertar Reportes de prueba usando PostGIS (POINT(longitud latitud))
-- Nota: SRID 4326 usa longitud (X) primero y latitud (Y) después. 
-- Coordenadas simuladas de ejemplo (CDMX).
INSERT INTO REPORTE (descripcion, ubicacion, severidad, url_evidencia_foto, puntos_asignados, estado_puntos, usuario_id, estado_id, categoria_id) VALUES 
(
    'Gran acumulación de basura en la esquina del parque',
    ST_GeogFromText('SRID=4326;POINT(-99.1622 19.4204)'),
    'Media',
    'https://example.com/fotos/basura1.jpg',
    50,
    'Otorgado',
    1, -- Creado por Juan Pérez
    1, -- Recibido
    1  -- Basura
),
(
    'Fuga de agua potable muy fuerte en la acera',
    ST_GeogFromText('SRID=4326;POINT(-99.1687 19.4056)'),
    'Critica',
    'https://example.com/fotos/fuga1.jpg',
    0,
    'Pendiente',
    2, -- Creado por María Gómez
    2, -- En Revisión
    2  -- Fuga de agua
);

-- 6. Insertar Notificaciones de prueba
INSERT INTO NOTIFICACION (mensaje, leido, tipo, usuario_id, reporte_id) VALUES 
('Tu reporte de basura ha sido recibido correctamente.', true, 'Sistema', 1, 1),
('Hemos comenzado a revisar la fuga de agua que reportaste.', false, 'Actualización', 2, 2);

-- 7. Insertar Dispositivos de prueba para notificaciones FCM
INSERT INTO DISPOSITIVO_USUARIO (usuario_id, fcm_token, dispositivo_info) VALUES
(1, 'fcm_token_test_juan_chrome_windows', 'Google Chrome en Windows 10/11 (Escritorio)'),
(2, 'fcm_token_test_maria_safari_ios', 'Apple Safari en iOS (Móvil)'),
(3, 'fcm_token_test_admin_edge_windows', 'Microsoft Edge en Windows 10/11 (Escritorio)');
