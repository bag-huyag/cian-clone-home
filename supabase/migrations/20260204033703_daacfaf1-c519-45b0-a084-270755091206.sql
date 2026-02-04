-- Create storage bucket for listing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view listing images (public bucket)
CREATE POLICY "Anyone can view listing images"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-images');

-- Allow authenticated users to upload listing images
CREATE POLICY "Authenticated users can upload listing images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listing-images');

-- Allow users to update their own listing images
CREATE POLICY "Users can update their listing images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'listing-images');

-- Allow users to delete their listing images
CREATE POLICY "Users can delete listing images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'listing-images');