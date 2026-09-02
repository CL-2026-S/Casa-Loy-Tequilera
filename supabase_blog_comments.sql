-- =========================================================
-- TABLA: blog_comments (Comentarios interactivos para el Blog)
-- =========================================================

CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_slug TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT,
    comment_text TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices de consulta rápida por artículo
CREATE INDEX IF NOT EXISTS idx_blog_comments_slug ON blog_comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created ON blog_comments(created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública de comentarios aprobados
CREATE POLICY "Allow public read access to approved blog comments"
    ON blog_comments FOR SELECT
    USING (is_approved = true);

-- Política para permitir que cualquier visitante envíe un comentario
CREATE POLICY "Allow public insert into blog comments"
    ON blog_comments FOR INSERT
    WITH CHECK (true);

-- Política para actualizar likes (o administradores)
CREATE POLICY "Allow public update likes on blog comments"
    ON blog_comments FOR UPDATE
    USING (true);

-- =========================================================
-- AMPLIACIÓN OPCIONAL DE CAMPOS EN blog_posts (SI NO EXISTEN)
-- =========================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'author_photo') THEN
        ALTER TABLE blog_posts ADD COLUMN author_photo TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'author_role') THEN
        ALTER TABLE blog_posts ADD COLUMN author_role TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'author_bio') THEN
        ALTER TABLE blog_posts ADD COLUMN author_bio TEXT;
    END IF;
END $$;
