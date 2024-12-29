/*
  # Create wishes table for New Year 2025

  1. New Tables
    - `wishes`
      - `id` (uuid, primary key)
      - `name` (text, user's name)
      - `wish` (text, user's wish for 2025)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `wishes` table
    - Add policies for:
      - Anyone can read wishes
      - Anyone can insert wishes
*/

CREATE TABLE IF NOT EXISTS wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  wish text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read wishes"
  ON wishes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert wishes"
  ON wishes
  FOR INSERT
  TO public
  WITH CHECK (true);