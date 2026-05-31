-- Gallery items for transformation carousel
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  name_it text not null,
  name_en text not null,
  result_it text not null default '',
  result_en text not null default '',
  desc_it text not null default '',
  desc_en text not null default '',
  image_url text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index gallery_items_sort_idx on public.gallery_items (sort_order asc);

create trigger gallery_items_updated_at
  before update on public.gallery_items
  for each row execute function public.set_updated_at();

alter table public.gallery_items enable row level security;

create policy "Anyone can read published gallery items"
  on public.gallery_items for select
  using (is_published = true);

create policy "Admins can read all gallery items"
  on public.gallery_items for select
  using (public.is_admin());

create policy "Admins can insert gallery items"
  on public.gallery_items for insert
  with check (public.is_admin());

create policy "Admins can update gallery items"
  on public.gallery_items for update
  using (public.is_admin());

create policy "Admins can delete gallery items"
  on public.gallery_items for delete
  using (public.is_admin());

-- Storage bucket for gallery uploads
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

create policy "Public read gallery images"
  on storage.objects for select
  using (bucket_id = 'gallery');

create policy "Admins upload gallery images"
  on storage.objects for insert
  with check (bucket_id = 'gallery' and public.is_admin());

create policy "Admins update gallery images"
  on storage.objects for update
  using (bucket_id = 'gallery' and public.is_admin());

create policy "Admins delete gallery images"
  on storage.objects for delete
  using (bucket_id = 'gallery' and public.is_admin());

-- Seed existing transformation gallery (skip if already seeded)
insert into public.gallery_items (name_it, name_en, result_it, result_en, desc_it, desc_en, image_url, sort_order)
select * from (values
  ('Filippo', 'Filippo', '-24kg', '-24kg', 'Ricomposizione corporea', 'Body recomposition', '/images/transformations/01-filippo.jpg', 1),
  ('Mario', 'Mario', '-42kg', '-42kg', 'Ricomposizione corporea', 'Body recomposition', '/images/transformations/02-mario.jpg', 2),
  ('Juliana', 'Juliana', '-5kg', '-5kg', 'Ricomposizione + aumento massa muscolare', 'Recomposition + muscle mass increase', '/images/transformations/03-juliana.jpg', 3),
  ('Irina', 'Irina', '-5kg', '-5kg', 'Ricomposizione corporea', 'Body recomposition', '/images/transformations/04-irina.jpg', 4),
  ('Stacy', 'Stacy', '-14kg', '-14kg', 'Ricomposizione corporea', 'Body recomposition', '/images/transformations/05-stacy.jpg', 5),
  ('Cassia', 'Cassia', '+6kg', '+6kg', 'Ricomposizione corporea + aumento massa muscolare', 'Body recomposition + muscle mass increase', '/images/transformations/06-cassia.jpg', 6),
  ('Armando', 'Armando', '-27kg', '-27kg', 'Ricomposizione + aumento massa muscolare', 'Recomposition + muscle mass increase', '/images/transformations/07-armando.jpg', 7),
  ('Victoria', 'Victoria', '-4kg', '-4kg', 'Ricomposizione corporea', 'Body recomposition', '/images/transformations/08-victoria.jpg', 8),
  ('Alfredo', 'Alfredo', '+8kg', '+8kg', 'Ricomposizione corporea + aumento massa muscolare', 'Body recomposition + muscle mass increase', '/images/transformations/09-alfredo.jpg', 9),
  ('Claudia', 'Claudia', '+2kg', '+2kg', 'Aumento massa muscolare', 'Muscle mass increase', '/images/transformations/10-claudia.jpg', 10),
  ('Massimo', 'Massimo', '-11kg', '-11kg', 'Ricomposizione corporea', 'Body recomposition', '/images/transformations/11-massimo.jpg', 11),
  ('Vincenzo', 'Vincenzo', '+7kg', '+7kg', 'Aumento massa muscolare', 'Muscle mass increase', '/images/transformations/12-vincenzo.jpg', 12),
  ('Pietro', 'Pietro', '-6kg', '-6kg', 'Ricomposizione corporea', 'Body recomposition', '/images/transformations/13-pietro.jpg', 13),
  ('Luciana', 'Luciana', '-5kg', '-5kg', 'Ricomposizione corporea', 'Body recomposition', '/images/transformations/14-luciana.jpg', 14),
  ('Angela', 'Angela', '-7kg', '-7kg', 'Ricomposizione corporea', 'Body recomposition', '/images/transformations/15-angela.jpg', 15),
  ('Ferdinando', 'Ferdinando', '-5kg', '-5kg', 'Ricomposizione corporea', 'Body recomposition', '/images/transformations/16-ferdinando.jpg', 16)
) as seed(name_it, name_en, result_it, result_en, desc_it, desc_en, image_url, sort_order)
where not exists (select 1 from public.gallery_items limit 1);
