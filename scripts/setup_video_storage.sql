
-- Create 'videos' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access to videos bucket
CREATE POLICY "Public Videos Read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'videos' );

-- Policy: Allow authenticated users (admins) to upload to videos bucket
CREATE POLICY "Admin Videos Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'videos' );

-- Policy: Allow authenticated users to update/delete
CREATE POLICY "Admin Videos Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'videos' );

CREATE POLICY "Admin Videos Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'videos' );
