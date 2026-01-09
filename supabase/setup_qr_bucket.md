Setup: `qrcodes` Supabase Storage Bucket

1. Create the bucket
- Go to your Supabase project → Storage → New bucket
- Name: `qrcodes`
- Public: Yes (so public URLs work) — alternatively set up signed URLs if you want private access

2. Optional: set CORS and cache control
- You can leave defaults; we set `cacheControl: 3600` during upload in the client code.

3. RLS / Policies
- Storage buckets don't use SQL RLS; ensure your Supabase anon/public key has access to read public files when bucket is public.
- For write/upload operations, use authenticated users or a server function. Our client code uses the logged-in user's Supabase client to upload; ensure uploads are allowed for authenticated users.

4. Use in app
- The client (`src/components/QrDownload.jsx`) uploads PNGs to `qrcodes/<timestamp>-<filename>` and fetches a public URL.
- If you want to persist the URL to the DB, add a column to your `orders` table, e.g. `qr_url text`, and save it when creating the order on verification.

SQL to add column to `orders` table (run in Supabase SQL editor):

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS qr_url text;

-- Grant insert/update access via your application policies as appropriate.

5. Notes
- If you prefer Google Drive, you'll need an OAuth server flow to upload as a service account; Supabase Storage is simpler and free within limits.
