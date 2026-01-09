# Setup: `carousel-images` Supabase Storage Bucket

## 1. Create the bucket

- Go to your **Supabase project** → **Storage** (left sidebar).
- Click **New bucket**.
- Name: `carousel-images`
- Toggle **Public** to **ON** (required for public carousel image URLs).
- Click **Create bucket**.

## 2. How it works

- The Admin page now includes a **file upload input** for carousel images.
- When you upload an image, the app sends it to `carousel-images/<timestamp>-<filename>` in your bucket.
- Supabase returns a public URL which is stored in the `carousels` table `image_url` column.
- No external Drive links needed — everything is stored in your Supabase project.

## 3. Storage policies (optional)

- Since the bucket is **Public**, anyone can view the images.
- For upload restrictions, you can set up RLS policies in Supabase to allow only authenticated admins to upload (ask me if you need help with this).

## 4. Next step

- Go to Admin → **Manage Carousel** → **Add Carousel Item**.
- Upload an image file instead of pasting a URL.
- Images will be uploaded to `carousel-images` and accessible via public URLs on the Home page carousel.
