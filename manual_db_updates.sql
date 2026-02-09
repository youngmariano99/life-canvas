-- Update fitness_routines table to include 'rounds' column
ALTER TABLE fitness_routines ADD COLUMN IF NOT EXISTS rounds TEXT;

CREATE TABLE IF NOT EXISTS sub_goals (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  goal_id uuid REFERENCES goals(id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
  updated_at timestamp DEFAULT now()
);

-- Migration for Resources table (from type/url/desc to quantitative model)
ALTER TABLE resources 
  ADD COLUMN IF NOT EXISTS name varchar(255),
  ADD COLUMN IF NOT EXISTS quantity_have numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quantity_needed numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unit varchar(50);

-- Migrate data if title exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='resources' AND column_name='title') THEN
     UPDATE resources SET name = title WHERE name IS NULL;
  END IF;
END $$;

-- Drop old columns safely
ALTER TABLE resources 
  DROP COLUMN IF EXISTS title,
  DROP COLUMN IF EXISTS type,
  DROP COLUMN IF EXISTS url,
  DROP COLUMN IF EXISTS description;
