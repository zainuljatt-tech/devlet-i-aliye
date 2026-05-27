-- Run ALL of this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/plphuqltnutkywwqfsgp/sql/new

-- Enable RLS (safe to run even if already enabled)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit the form
CREATE POLICY "anon_insert" ON registrations
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create the password-protected function for admin to view data
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

-- Allow anonymous users to call this function
GRANT EXECUTE ON FUNCTION get_registrations TO anon;
