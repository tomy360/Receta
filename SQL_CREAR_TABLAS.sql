-- Copia y pega esto en el SQL Editor de Supabase Dashboard

-- 1. Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de favoritos por usuario
CREATE TABLE IF NOT EXISTS favoritos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  recipe_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- 3. Agregar columnas a tips para user_id y avatar_url
ALTER TABLE tips ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE tips ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 4. Crear RLS (Row Level Security) para las nuevas tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;

-- Permitir anónimo SELECT/INSERT en usuarios (necesario para login y admin)
CREATE POLICY IF NOT EXISTS "anon_select_usuarios" ON usuarios FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "anon_insert_usuarios" ON usuarios FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "anon_all_favoritos" ON favoritos FOR ALL USING (true) WITH CHECK (true);

-- 5. Insertar usuario admin por defecto
-- Contraseña: admin1234 (SHA-256: ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270)
-- CAMBIA LA CONTRASEÑA DESPUÉS DEL PRIMER INICIO DE SESIÓN
INSERT INTO usuarios (id, username, password, avatar_url)
VALUES (
  'admin-' || gen_random_uuid()::text,
  'admin',
  'ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270',
  ''
) ON CONFLICT (username) DO NOTHING;
