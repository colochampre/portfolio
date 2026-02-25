-- Migración para agregar columna 'role' a usuarios existentes
-- NOTA: Solo ejecutar si ya tienes la base de datos creada SIN la columna role
-- Si estás creando la BD desde cero, usa db.sql que ya incluye esta columna

USE snake_soccer;

-- Verificar si la columna ya existe antes de agregarla
ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin') DEFAULT 'user' AFTER password;