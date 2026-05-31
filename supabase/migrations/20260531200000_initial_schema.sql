-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  text text not null,
  author_name text not null,
  author_email text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reviews_status_created_at_idx on public.reviews (status, created_at desc);

-- Contact requests
create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  goal text,
  message text not null,
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger reviews_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

-- Admin check helper
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_requests enable row level security;

-- Profiles policies
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Reviews policies
create policy "Anyone can read approved reviews"
  on public.reviews for select
  using (status = 'approved');

create policy "Admins can read all reviews"
  on public.reviews for select
  using (public.is_admin());

create policy "Authenticated users can create reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Admins can update reviews"
  on public.reviews for update
  using (public.is_admin());

create policy "Admins can delete reviews"
  on public.reviews for delete
  using (public.is_admin());

-- Contact requests policies
create policy "Anyone can submit contact request"
  on public.contact_requests for insert
  with check (true);

create policy "Admins can read contact requests"
  on public.contact_requests for select
  using (public.is_admin());
