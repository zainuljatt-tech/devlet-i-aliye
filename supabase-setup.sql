-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/plphuqltnutkywwqfsgp/sql/new)

CREATE TABLE registrations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ad TEXT NOT NULL,
  soyad TEXT NOT NULL,
  email TEXT NOT NULL,
  telefon TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert" ON registrations
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION get_registrations(admin_pass TEXT)
RETURNS SETOF registrations
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF admin_pass = 'dao-admin-2026' THEN
    RETURN QUERY SELECT * FROM registrations ORDER BY created_at DESC;
  ELSE
    RAISE EXCEPTION 'Unauthorized';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION get_registrations TO anon;
