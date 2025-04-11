-- CreateMigration
CREATE OR REPLACE FUNCTION create_video_content() 
RETURNS void AS $$
DECLARE
    edito RECORD;
    new_text_content_id UUID;
    translation RECORD;
BEGIN
    -- Pour chaque edito
    FOR edito IN 
        SELECT e.id, e.content_text_content_id, tc.language_id 
        FROM editos e
        JOIN text_content tc ON tc.id = e.content_text_content_id
    LOOP
        -- Créer le TextContent principal pour la vidéo
        new_text_content_id := gen_random_uuid();
        INSERT INTO text_content (id, text, language_id, created_at, updated_at)
        SELECT 
            new_text_content_id,
            '', -- texte vide par défaut
            tc.language_id,
            NOW(),
            NOW()
        FROM text_content tc
        WHERE tc.id = edito.content_text_content_id;

        -- Créer les traductions correspondantes
        INSERT INTO translations (text_content_id, language_id, text, created_at, updated_at)
        SELECT 
            new_text_content_id,
            t.language_id,
            '', -- texte vide par défaut
            NOW(),
            NOW()
        FROM translations t
        WHERE t.text_content_id = edito.content_text_content_id;

        -- Mettre à jour l'edito avec le nouveau text_content_id
        UPDATE editos
        SET video_text_content_id = new_text_content_id
        WHERE id = edito.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- UpMigration
SELECT create_video_content();
DROP FUNCTION create_video_content();