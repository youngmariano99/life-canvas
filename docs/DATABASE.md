# Schema de Base de Datos - Life-OS 2026

## Ubicación

El schema SQL completo está en: `docs/schema.sql`

---

## Diagrama ER

```
┌─────────────────┐
│   year_settings │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐      1:N      ┌─────────────────┐
│      roles      │──────────────►│      goals      │
└────────┬────────┘               └────────┬────────┘
         │                                 │
         │ 1:N                            │ 1:N
         ▼                                 ▼
┌─────────────────┐               ┌─────────────────┐
│     habits      │               │    projects     │
└────────┬────────┘               └────────┬────────┘
         │                                 │
         │ 1:N                            │ 1:N
         ▼                                 ▼
┌─────────────────┐               ┌─────────────────┐
│   habit_logs    │               │project_activities│
└─────────────────┘               └─────────────────┘

┌─────────────────┐               ┌─────────────────┐
│   deviations    │               │  daily_stones   │
└─────────────────┘               └─────────────────┘

┌─────────────────┐               ┌─────────────────┐
│fitness_activities│              │ calendar_events │
└─────────────────┘               └─────────────────┘

┌─────────────────┐      1:N      ┌─────────────────┐
│  note_folders   │──────────────►│      notes      │
└─────────────────┘               └────────┬────────┘
                                           │
                              ┌────────────┴────────────┐
                              │ 1:N                 N:M │
                              ▼                         ▼
                    ┌─────────────────┐     ┌─────────────────────┐
                    │ note_documents  │     │ note_tag_relations  │
                    └─────────────────┘     └──────────┬──────────┘
                                                       │
                                                       │ N:1
                                                       ▼
                                           ┌─────────────────┐
                                           │    note_tags    │
                                           └─────────────────┘
```

---

## Tablas Principales

### year_settings

```sql
CREATE TABLE year_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL DEFAULT 2026,
  vision_5_years TEXT DEFAULT '',
  vision_images TEXT[] DEFAULT '{}',
  mission TEXT DEFAULT '',
  h1_priority TEXT DEFAULT '',
  h2_priority TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, year)
);
```

### roles

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) DEFAULT 'circle',
  color VARCHAR(50) DEFAULT 'student',
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### goals

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  quarter SMALLINT CHECK (quarter BETWEEN 1 AND 4),
  semester SMALLINT CHECK (semester BETWEEN 1 AND 2),
  target_date DATE,
  status VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed', 'deferred')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### goal_resources

```sql
CREATE TABLE goal_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  quantity_have DECIMAL(10,2) DEFAULT 0,
  quantity_needed DECIMAL(10,2) DEFAULT 0,
  unit VARCHAR(50)
);
```

### habits

```sql
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  frequency VARCHAR(20) DEFAULT 'daily'
    CHECK (frequency IN ('daily', 'weekdays', 'weekends', 'custom')),
  custom_days SMALLINT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### habit_logs

```sql
CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'completed'
    CHECK (status IN ('completed', 'missed', 'day_off', 'other')),
  note TEXT,
  UNIQUE(habit_id, date)
);
```

### daily_stones

```sql
CREATE TABLE daily_stones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  completed BOOLEAN DEFAULT false,
  note TEXT,
  UNIQUE(user_id, date)
);
```

### projects

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  statuses TEXT[] DEFAULT '{"Por hacer", "En progreso", "En revisión", "Completada"}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### project_activities

```sql
CREATE TABLE project_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(100) DEFAULT 'Por hacer',
  sort_order INTEGER DEFAULT 0,
  due_date DATE,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### deviations

```sql
CREATE TABLE deviations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  habit_id UUID REFERENCES habits(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  what_happened TEXT NOT NULL,
  adjustment_action TEXT NOT NULL,
  lesson TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### fitness_activities

```sql
CREATE TABLE fitness_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) CHECK (type IN ('neat', 'workout')),
  name VARCHAR(255) NOT NULL,
  duration INTEGER,
  notes TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### calendar_events

```sql
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME,
  end_date DATE,
  tag VARCHAR(50) DEFAULT 'personal'
    CHECK (tag IN ('birthday', 'reminder', 'appointment', 'exam', 'deadline', 'personal', 'custom')),
  custom_tag_label VARCHAR(100),
  custom_color VARCHAR(20),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Tablas del Sistema de Notas

### note_folders

```sql
CREATE TABLE note_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES note_folders(id) ON DELETE CASCADE,
  color VARCHAR(20),
  icon VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### notes

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES note_folders(id) ON DELETE CASCADE,
  type VARCHAR(20) DEFAULT 'note'
    CHECK (type IN ('note', 'whiteboard', 'document')),
  title VARCHAR(255) NOT NULL,
  content TEXT DEFAULT '',
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### note_tags

```sql
CREATE TABLE note_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(20) DEFAULT '#6B7280',
  type VARCHAR(20) DEFAULT 'custom'
    CHECK (type IN ('role', 'goal', 'project', 'custom')),
  reference_id UUID
);
```

### note_tag_relations

```sql
CREATE TABLE note_tag_relations (
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES note_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);
```

### note_documents

```sql
CREATE TABLE note_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Índices Recomendados

```sql
-- Búsquedas frecuentes
CREATE INDEX idx_goals_role ON goals(role_id);
CREATE INDEX idx_goals_quarter ON goals(quarter);
CREATE INDEX idx_habits_role ON habits(role_id);
CREATE INDEX idx_habit_logs_date ON habit_logs(date);
CREATE INDEX idx_habit_logs_habit ON habit_logs(habit_id);
CREATE INDEX idx_daily_stones_date ON daily_stones(date);
CREATE INDEX idx_activities_project ON project_activities(project_id);
CREATE INDEX idx_activities_status ON project_activities(status);
CREATE INDEX idx_fitness_date ON fitness_activities(date);
CREATE INDEX idx_calendar_date ON calendar_events(date);
CREATE INDEX idx_notes_folder ON notes(folder_id);
CREATE INDEX idx_folders_parent ON note_folders(parent_id);
```

---

## Row Level Security (RLS)

### Política Base

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE year_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
-- ... repetir para todas las tablas

-- Política: usuarios solo ven sus datos
CREATE POLICY "Users can only access own data"
ON roles
FOR ALL
USING (auth.uid() = user_id);

-- Repetir para cada tabla con user_id
```

### Políticas Especiales

```sql
-- Habit logs: acceso por usuario dueño del hábito
CREATE POLICY "Users can access own habit logs"
ON habit_logs
FOR ALL
USING (
  habit_id IN (
    SELECT id FROM habits WHERE user_id = auth.uid()
  )
);

-- Project activities: acceso por usuario dueño del proyecto
CREATE POLICY "Users can access own project activities"
ON project_activities
FOR ALL
USING (
  project_id IN (
    SELECT p.id FROM projects p
    JOIN goals g ON p.goal_id = g.id
    WHERE g.user_id = auth.uid()
  )
);
```

---

## Migración desde localStorage

### Script de Migración

```typescript
async function migrateToSupabase(userId: string) {
  const localData = JSON.parse(localStorage.getItem('life-os-2026') || '{}');
  
  // 1. Year Settings
  if (localData.yearSettings) {
    await supabase.from('year_settings').insert({
      user_id: userId,
      ...localData.yearSettings
    });
  }
  
  // 2. Roles (guardar mapeo de IDs)
  const roleIdMap = new Map();
  for (const role of localData.roles || []) {
    const { data } = await supabase.from('roles').insert({
      user_id: userId,
      name: role.name,
      icon: role.icon,
      color: role.color,
      description: role.description
    }).select().single();
    roleIdMap.set(role.id, data.id);
  }
  
  // 3. Goals (usando mapeo de roles)
  // ... continuar con el resto de entidades
  
  // Limpiar localStorage después de migración exitosa
  localStorage.removeItem('life-os-2026');
}
```
