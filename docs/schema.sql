-- Life-OS 2026 PostgreSQL Schema
-- Based on Superhábitos methodology

-- Year configuration (Vision, Mission)
CREATE TABLE year_settings (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL UNIQUE DEFAULT 2026,
    vision_5_years TEXT,
    mission TEXT,
    h1_priority VARCHAR(255),
    h2_priority VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Life roles (max 7)
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'Users',
    color VARCHAR(50) NOT NULL DEFAULT 'student',
    description TEXT,
    image_url TEXT, -- Custom image for role card
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Annual goals linked to roles
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    quarter SMALLINT CHECK (quarter BETWEEN 1 AND 4),
    semester SMALLINT CHECK (semester BETWEEN 1 AND 2),
    target_date DATE, -- Optional exact target date
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'deferred')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources for goals
CREATE TABLE goal_resources (
    id SERIAL PRIMARY KEY,
    goal_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    quantity_have DECIMAL(10,2) DEFAULT 0,
    quantity_needed DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Habits to track (linked to roles)
CREATE TABLE habits (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    frequency VARCHAR(20) DEFAULT 'daily',
    custom_days INTEGER[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily habit tracking log
CREATE TABLE habits_log (
    id SERIAL PRIMARY KEY,
    habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('completed', 'missed', 'day_off', 'other')),
    note TEXT,
    UNIQUE(habit_id, log_date)
);

-- Daily stone (main objective)
CREATE TABLE daily_stones (
    id SERIAL PRIMARY KEY,
    stone_date DATE NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    completed BOOLEAN DEFAULT FALSE,
    note TEXT
);

-- Deviations/Learning points
CREATE TABLE deviations (
    id SERIAL PRIMARY KEY,
    goal_id INTEGER REFERENCES goals(id) ON DELETE SET NULL,
    habit_id INTEGER REFERENCES habits(id) ON DELETE SET NULL,
    deviation_date DATE NOT NULL,
    what_happened TEXT NOT NULL,
    adjustment_action TEXT NOT NULL,
    lesson TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects for weekly planning (linked to goals)
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    goal_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    statuses TEXT[] DEFAULT ARRAY['Por hacer', 'En progreso', 'En revisión', 'Completada'],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project activities for kanban
CREATE TABLE project_activities (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(100) NOT NULL DEFAULT 'Por hacer',
    sort_order INTEGER DEFAULT 0,
    due_date DATE,
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fitness activities (NEAT and workouts)
CREATE TABLE fitness_activities (
    id SERIAL PRIMARY KEY,
    activity_date DATE NOT NULL,
    activity_type VARCHAR(20) NOT NULL CHECK (activity_type IN ('neat', 'workout')),
    name VARCHAR(255) NOT NULL,
    duration_minutes INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calendar events (birthdays, appointments, important dates)
CREATE TABLE calendar_events (
    id SERIAL PRIMARY KEY,
    event_date DATE NOT NULL,
    time VARCHAR(10), -- Optional time in HH:MM format
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tag VARCHAR(50) NOT NULL CHECK (tag IN ('cumpleaños', 'cita_medica', 'parcial', 'importante', 'recordatorio', 'otro')),
    custom_color VARCHAR(20), -- Optional custom color
    recurring BOOLEAN DEFAULT FALSE,
    recurring_type VARCHAR(20) CHECK (recurring_type IN ('weekly', 'monthly', 'yearly')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== NOTES SYSTEM ====================

-- Note tags for categorization
CREATE TABLE note_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(50) NOT NULL,
    tag_type VARCHAR(20) NOT NULL CHECK (tag_type IN ('role', 'goal', 'project', 'custom')),
    reference_id INTEGER, -- Links to role_id, goal_id, project_id depending on tag_type
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note folders for organization
CREATE TABLE note_folders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id INTEGER REFERENCES note_folders(id) ON DELETE CASCADE,
    color VARCHAR(50),
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes (rich text notes, whiteboards, or document references)
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    folder_id INTEGER REFERENCES note_folders(id) ON DELETE CASCADE,
    note_type VARCHAR(20) NOT NULL CHECK (note_type IN ('note', 'whiteboard', 'document')),
    title VARCHAR(255) NOT NULL,
    content TEXT, -- JSON for rich text (TipTap), JSON for whiteboard (Excalidraw), or description for documents
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-many relationship between notes and tags
CREATE TABLE note_tag_relations (
    note_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES note_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (note_id, tag_id)
);

-- Documents attached to notes (files stored externally, URLs stored here)
CREATE TABLE note_documents (
    id SERIAL PRIMARY KEY,
    note_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL, -- MIME type
    file_size INTEGER NOT NULL, -- Size in bytes
    file_url TEXT NOT NULL, -- URL to blob storage (NOT base64 data)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== INDEXES ====================

-- Existing indexes
CREATE INDEX idx_goals_role ON goals(role_id);
CREATE INDEX idx_goals_quarter ON goals(quarter);
CREATE INDEX idx_goals_target_date ON goals(target_date);
CREATE INDEX idx_habits_role ON habits(role_id);
CREATE INDEX idx_habits_log_date ON habits_log(log_date);
CREATE INDEX idx_habits_log_habit ON habits_log(habit_id);
CREATE INDEX idx_deviations_date ON deviations(deviation_date);
CREATE INDEX idx_projects_goal ON projects(goal_id);
CREATE INDEX idx_projects_due_date ON projects(due_date);
CREATE INDEX idx_activities_project ON project_activities(project_id);
CREATE INDEX idx_activities_status ON project_activities(status);
CREATE INDEX idx_activities_due_date ON project_activities(due_date);
CREATE INDEX idx_goal_resources_goal ON goal_resources(goal_id);
CREATE INDEX idx_fitness_date ON fitness_activities(activity_date);
CREATE INDEX idx_fitness_type ON fitness_activities(activity_type);
CREATE INDEX idx_calendar_date ON calendar_events(event_date);
CREATE INDEX idx_calendar_tag ON calendar_events(tag);

-- Notes system indexes
CREATE INDEX idx_note_folders_parent ON note_folders(parent_id);
CREATE INDEX idx_notes_folder ON notes(folder_id);
CREATE INDEX idx_notes_type ON notes(note_type);
CREATE INDEX idx_notes_pinned ON notes(is_pinned);
CREATE INDEX idx_note_documents_note ON note_documents(note_id);
CREATE INDEX idx_note_tags_type ON note_tags(tag_type);
CREATE INDEX idx_note_tag_relations_note ON note_tag_relations(note_id);
CREATE INDEX idx_note_tag_relations_tag ON note_tag_relations(tag_id);
