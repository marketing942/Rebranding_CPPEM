create type public.user_role as enum ('admin', 'editor');
create type public.contest_status as enum ('publicado','em-andamento','autorizado','banca-definida','comissao-formada','previsto','solicitado','encerrado');
create type public.contest_scope as enum ('estadual','federal','nacional');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  role public.user_role not null default 'editor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  modality text not null,
  description text not null,
  price_label text not null,
  old_price_label text,
  image_url text not null,
  href text not null,
  featured boolean not null default false,
  display_order integer not null default 0,
  published boolean not null default false,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contests (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  acronym text not null,
  organization text not null,
  career text not null,
  status public.contest_status not null,
  scope public.contest_scope not null default 'estadual',
  openings_label text not null,
  salary_label text not null,
  exam_board text not null,
  positions text[] not null default '{}',
  summary text not null,
  content_md text not null,
  requirements text[] not null default '{}',
  stages text[] not null default '{}',
  source_label text not null,
  source_url text not null check (source_url ~ '^https://'),
  last_verified_at date not null,
  published boolean not null default false,
  published_at date,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_requires_source check (not published or (source_label <> '' and source_url <> '' and last_verified_at is not null))
);

create table public.contest_locations (
  contest_id uuid not null references public.contests(id) on delete cascade,
  state_code char(2) not null check (state_code ~ '^[A-Z]{2}$'),
  primary key (contest_id, state_code)
);

create table public.contest_products (
  contest_id uuid not null references public.contests(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  display_order integer not null default 0,
  primary key (contest_id, product_id)
);

create table public.campaign_banners (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null,
  title text not null,
  highlight text not null,
  description text not null,
  image_url text not null,
  mobile_image_url text,
  cta_label text not null,
  href text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  display_order integer not null default 0,
  published boolean not null default false,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_banner_window check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  result text not null,
  quote text not null,
  image_url text not null,
  display_order integer not null default 0,
  published boolean not null default false,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.slug_redirects (
  id bigint generated always as identity primary key,
  entity_type text not null check (entity_type in ('contest','product')),
  old_slug text not null,
  new_slug text not null,
  created_at timestamptz not null default now(),
  unique(entity_type, old_slug)
);

create table public.content_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id),
  entity_type text not null,
  entity_id text not null,
  operation text not null check (operation in ('insert','update','delete')),
  changed_at timestamptz not null default now(),
  snapshot jsonb
);

create index contests_public_order_idx on public.contests (published, status, last_verified_at desc);
create index contests_slug_idx on public.contests (slug);
create index contest_locations_state_idx on public.contest_locations (state_code);
create index banners_window_idx on public.campaign_banners (published, starts_at, ends_at);

create or replace function public.current_role() returns public.user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_editor() returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role() in ('admin','editor'), false)
$$;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role() = 'admin', false)
$$;

create or replace function public.touch_content() returns trigger language plpgsql security invoker as $$
begin new.updated_at = now(); new.updated_by = auth.uid(); return new; end $$;

create or replace function public.audit_content() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.content_audit_log(actor_id,entity_type,entity_id,operation,snapshot)
  values(auth.uid(),TG_TABLE_NAME,coalesce(new.id::text,old.id::text),lower(TG_OP),case when TG_OP='DELETE' then to_jsonb(old) else to_jsonb(new) end);
  return coalesce(new,old);
end $$;

create or replace function public.track_slug_change() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if old.slug is distinct from new.slug then
    insert into public.slug_redirects(entity_type,old_slug,new_slug) values('contest',old.slug,new.slug)
    on conflict(entity_type,old_slug) do update set new_slug=excluded.new_slug,created_at=now();
  end if;
  return new;
end $$;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles(id,name) values(new.id,coalesce(new.raw_user_meta_data->>'name',split_part(new.email,'@',1))); return new; end $$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
create trigger contests_touch before update on public.contests for each row execute function public.touch_content();
create trigger products_touch before update on public.products for each row execute function public.touch_content();
create trigger banners_touch before update on public.campaign_banners for each row execute function public.touch_content();
create trigger testimonials_touch before update on public.testimonials for each row execute function public.touch_content();
create trigger contests_slug before update on public.contests for each row execute function public.track_slug_change();
create trigger contests_audit after insert or update or delete on public.contests for each row execute function public.audit_content();
create trigger products_audit after insert or update or delete on public.products for each row execute function public.audit_content();
create trigger banners_audit after insert or update or delete on public.campaign_banners for each row execute function public.audit_content();
create trigger testimonials_audit after insert or update or delete on public.testimonials for each row execute function public.audit_content();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.contests enable row level security;
alter table public.contest_locations enable row level security;
alter table public.contest_products enable row level security;
alter table public.campaign_banners enable row level security;
alter table public.testimonials enable row level security;
alter table public.slug_redirects enable row level security;
alter table public.content_audit_log enable row level security;

create policy "profiles own read" on public.profiles for select to authenticated using (id=auth.uid() or public.is_admin());
create policy "admins manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads products" on public.products for select using (published or public.is_editor());
create policy "editors manage products" on public.products for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "public reads contests" on public.contests for select using (published or public.is_editor());
create policy "editors manage contests" on public.contests for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "public reads locations" on public.contest_locations for select using (exists(select 1 from public.contests c where c.id=contest_id and (c.published or public.is_editor())));
create policy "editors manage locations" on public.contest_locations for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "public reads contest products" on public.contest_products for select using (exists(select 1 from public.contests c where c.id=contest_id and c.published));
create policy "editors manage contest products" on public.contest_products for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "public reads active banners" on public.campaign_banners for select using ((published and (starts_at is null or starts_at<=now()) and (ends_at is null or ends_at>=now())) or public.is_editor());
create policy "editors manage banners" on public.campaign_banners for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "public reads testimonials" on public.testimonials for select using (published or public.is_editor());
create policy "editors manage testimonials" on public.testimonials for all to authenticated using (public.is_editor()) with check (public.is_editor());
create policy "public reads redirects" on public.slug_redirects for select using (true);
create policy "admins read audit" on public.content_audit_log for select to authenticated using (public.is_admin());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('site-media','site-media',true,10485760,array['image/jpeg','image/png','image/webp','image/avif']) on conflict(id) do nothing;
create policy "public reads site media" on storage.objects for select using (bucket_id='site-media');
create policy "editors upload site media" on storage.objects for insert to authenticated with check (bucket_id='site-media' and public.is_editor());
create policy "editors update site media" on storage.objects for update to authenticated using (bucket_id='site-media' and public.is_editor());
create policy "admins delete site media" on storage.objects for delete to authenticated using (bucket_id='site-media' and public.is_admin());
