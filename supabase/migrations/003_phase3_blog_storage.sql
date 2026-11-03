-- =============================================================================
-- STEWARD ADMIN & INSIGHTS — PHASE 3: SUPABASE STORAGE FOR BLOG IMAGES
-- Public read, admin-only write. Allowed: jpg, png, webp. Max size: 5 MB.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read policy on blog-images
drop policy if exists "Public visitors can view blog images" on storage.objects;
create policy "Public visitors can view blog images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'blog-images');

-- Authenticated MFA-verified admins can upload, update, and delete blog images
drop policy if exists "Admins can upload blog images" on storage.objects;
create policy "Admins can upload blog images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'blog-images'
    and public.is_authenticated_admin()
  );

drop policy if exists "Admins can update blog images" on storage.objects;
create policy "Admins can update blog images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'blog-images'
    and public.is_authenticated_admin()
  );

drop policy if exists "Admins can delete blog images" on storage.objects;
create policy "Admins can delete blog images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'blog-images'
    and public.is_authenticated_admin()
  );
