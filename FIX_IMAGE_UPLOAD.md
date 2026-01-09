# Fix for Image Upload: Carousel-Images Bucket & RLS Setup

## 1. Create the `carousel-images` Storage Bucket

- Go to **Supabase** → **Storage** (left sidebar)
- Click **New bucket**
- Name: `carousel-images`
- Toggle **Public** to **ON**
- Click **Create bucket**

## 2. Set up Storage RLS for carousel-images

Go to **Supabase** → **Storage** → click on `carousel-images` bucket → **Policies** tab

**If no policies exist**, run this in SQL Editor:

```sql
-- Allow public READ access to carousel images
CREATE POLICY "allow_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'carousel-images');

-- Allow authenticated users to UPLOAD carousel images
CREATE POLICY "allow_auth_upload"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'carousel-images' AND 
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to UPDATE/DELETE their own files
CREATE POLICY "allow_auth_manage"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'carousel-images' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "allow_auth_delete"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'carousel-images' AND 
    auth.role() = 'authenticated'
  );
```

## 3. Ensure you're signed in as admin

Before uploading carousel images:
1. Click **Navbar** → **Admin** link
2. You should see the Admin Dashboard
3. Scroll to "Manage Carousel"
4. Click "Add Carousel Item"
5. Upload an image file

The image should now upload to Supabase Storage without RLS errors.

## 4. If still getting RLS errors

Try this simpler SQL first (allows any authenticated user):

```sql
-- Drop existing policies if they conflict
DROP POLICY IF EXISTS "allow_public_read" ON storage.objects;
DROP POLICY IF EXISTS "allow_auth_upload" ON storage.objects;
DROP POLICY IF EXISTS "allow_auth_manage" ON storage.objects;
DROP POLICY IF EXISTS "allow_auth_delete" ON storage.objects;

-- Simple policies: public read, authenticated write
CREATE POLICY "carousel_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'carousel-images');

CREATE POLICY "carousel_auth_write"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'carousel-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "carousel_auth_update"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'carousel-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "carousel_auth_delete"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'carousel-images' AND auth.uid() IS NOT NULL);
```

Then sign out and sign back in as admin, and retry the upload.
