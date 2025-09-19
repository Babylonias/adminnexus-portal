-- Script d'initialisation de la base de données CampusWA

-- Table des universités
CREATE TABLE IF NOT EXISTS universities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('active', 'draft')),
    photos TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des amphithéâtres
CREATE TABLE IF NOT EXISTS amphitheaters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    university_id INTEGER REFERENCES universities(id) ON DELETE CASCADE,
    location VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    equipment TEXT[],
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('active', 'maintenance', 'draft')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT FALSE,
    user_id VARCHAR(255), -- Pour une future gestion des utilisateurs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_universities_status ON universities(status);
CREATE INDEX IF NOT EXISTS idx_amphitheaters_university_id ON amphitheaters(university_id);
CREATE INDEX IF NOT EXISTS idx_amphitheaters_status ON amphitheaters(status);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Données d'exemple
INSERT INTO universities (name, slug, location, description, status, photos) VALUES
('Université Paris Tech', 'paris-tech', 'Paris, France', 'Institution de référence en sciences et technologies', 'active', ARRAY['https://images.unsplash.com/photo-1562774053-701939374585?w=400']),
('Sorbonne Université', 'sorbonne', 'Paris, France', 'Université pluridisciplinaire de recherche intensive', 'active', ARRAY['https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400']),
('Université Lyon 1', 'lyon-1', 'Lyon, France', 'Sciences, technologies, santé', 'draft', ARRAY['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400'])
ON CONFLICT (slug) DO NOTHING;

-- Notifications d'exemple
INSERT INTO notifications (title, message, type, is_read) VALUES
('Nouveau amphithéâtre ajouté', 'L''amphithéâtre Sciences 200 a été ajouté avec succès à l''Université Paris Tech', 'success', false),
('Maintenance programmée', 'Maintenance prévue pour l''Amphi Central le 15 mars 2024', 'warning', false),
('Mise à jour système', 'Le système CampusWA a été mis à jour vers la version 2.1.0', 'info', true)
ON CONFLICT DO NOTHING;