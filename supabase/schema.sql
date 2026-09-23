-- DA RA Portfolio V3 — Supabase schema
create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  name text not null default 'ĐA RA',
  role text not null default 'Administrator',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(), number text not null, slug text unique not null,
  title text not null, category text not null default 'MANAGEMENT', description text not null default '',
  tech text[] not null default '{}', icon text not null default '◈', role text not null default '',
  problem text not null default '', solution text not null default '', result text not null default '',
  features text[] not null default '{}', image text not null default '', demo_url text, github_url text,
  sort_order integer not null default 0, is_visible boolean not null default true, is_published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(), title text not null, slug text unique not null,
  description text not null default '', image_url text, event_date date, location text, status text not null default 'upcoming',
  sort_order integer not null default 0, is_visible boolean not null default true, is_published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.site_modules (
  id uuid primary key default gen_random_uuid(), key text unique not null, type text not null, title text not null,
  slug text, content jsonb not null default '{}'::jsonb, image_url text, sort_order integer not null default 0,
  is_visible boolean not null default true, is_published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(), site_name text not null default 'ĐA RA', slogan text not null default 'CONNECT. SOLVE. IMPROVE.',
  email text, phone text, location text, social_links jsonb not null default '{}'::jsonb, seo_title text, seo_description text,
  updated_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.events enable row level security;
alter table public.site_modules enable row level security;
alter table public.site_settings enable row level security;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.admin_profiles where user_id=auth.uid() and is_active=true);
$$;

create policy "public read published projects" on public.projects for select using (is_published=true and is_visible=true or public.is_admin());
create policy "admins manage projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());
create policy "public read published events" on public.events for select using (is_published=true and is_visible=true or public.is_admin());
create policy "admins manage events" on public.events for all using (public.is_admin()) with check (public.is_admin());
create policy "public read published modules" on public.site_modules for select using (is_published=true and is_visible=true or public.is_admin());
create policy "admins manage modules" on public.site_modules for all using (public.is_admin()) with check (public.is_admin());
create policy "admins read profile" on public.admin_profiles for select using (user_id=auth.uid() or public.is_admin());
create policy "public read settings" on public.site_settings for select using (true);
create policy "admins manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

insert into public.projects (number,slug,title,category,description,tech,icon,role,problem,solution,result,features,image,demo_url,sort_order,is_visible,is_published)
values
('01','workflow-it-manager','WorkFlow IT Manager','MANAGEMENT SYSTEM','Nền tảng quản lý vận hành IT, tập trung vào công việc, nhân sự, hỗ trợ và dữ liệu nội bộ.',ARRAY['React','TypeScript','Supabase'],'◈','Solution design · Frontend · Database','Công việc hỗ trợ và dữ liệu vận hành dễ bị phân tán giữa nhiều file, tin nhắn và thao tác thủ công.','Thiết kế một web app tập trung để quản lý dữ liệu, công việc và quy trình theo hướng dễ mở rộng.','Tạo nền tảng để tiếp tục mở rộng thành hệ thống quản lý vận hành IT thống nhất.',ARRAY['Dashboard','Task Management','Employee Management','Supabase Database'],'/images/workflow-it-manager.png','https://drait.lovable.app',1,true,true),
('02','it-operations-dashboard','IT Operations Dashboard','IT OPERATIONS','Dashboard theo dõi hoạt động IT và hỗ trợ quan sát tình trạng vận hành theo hướng trực quan.',ARRAY['Web App','Dashboard','Automation'],'◌','Product concept · UI · Development','Thông tin vận hành cần được nhìn thấy nhanh thay vì phải kiểm tra thủ công từ nhiều nguồn.','Thiết kế dashboard tập trung các chỉ số và khu vực thông tin quan trọng thành một giao diện dễ quét.','Giảm độ phức tạp khi quan sát và tạo nền tảng cho các workflow tiếp theo.',ARRAY['Dashboard','Operational Views','Quick Actions','Automation-ready'],'/images/it-operations-dashboard.png','https://ops-flow-46.lovable.app',2,true,true),
('03','printer-management','Printer Management','IT MANAGEMENT','Ứng dụng quản lý máy in, thiết bị, lịch sử thay mực và các hoạt động bảo trì.',ARRAY['React','Supabase','Vercel'],'▣','Full-stack · Data model · Deployment','Thông tin máy in và lịch sử mực/bảo trì cần được theo dõi tập trung để tránh thất lạc dữ liệu.','Xây dựng ứng dụng quản lý thiết bị, lịch sử thay mực và dữ liệu vận hành trên nền web.','Có hệ thống trực tuyến để truy cập nhanh dữ liệu máy in và lịch sử bảo trì.',ARRAY['Printer Records','Ink History','Maintenance','Online Deployment'],'/images/printer-management.png','https://dara-deploy.vercel.app',3,true,true),
('04','wms-pro','WMS Pro - Quản lý kho hàng & tài sản','WAREHOUSE / ASSET','Giải pháp quản lý kho hàng và tài sản theo hướng trực quan, hỗ trợ theo dõi và kiểm soát dữ liệu.',ARRAY['Web App','Inventory','Asset'],'▤','System concept · UI · Workflow','Quản lý kho và tài sản cần có cách nhìn trực quan hơn để giảm phụ thuộc vào bảng tính rời rạc.','Thiết kế workflow và dashboard quản lý dữ liệu kho/tài sản theo hướng tập trung.','Tạo một giao diện dễ quan sát để tiếp tục xây dựng quy trình quản lý chi tiết.',ARRAY['Inventory','Asset Tracking','Dashboard','Workflow'],'/images/wms-pro.png','https://dashboard-quanlyit-daraithelpdesk.bolt.host/',4,true,true)
on conflict (slug) do update set is_visible=excluded.is_visible,is_published=excluded.is_published;

-- After creating the Supabase Auth user, run:
-- insert into public.admin_profiles(user_id,name,role) values ('AUTH_USER_UUID','ĐA RA','Administrator');

-- Storage: create a public bucket named `portfolio` in Supabase Storage, then add policies allowing authenticated admins to upload.

-- Storage policy for the public `portfolio` bucket (create the bucket first in Storage UI).
create policy "admins upload portfolio media" on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio' and public.is_admin());
create policy "admins update portfolio media" on storage.objects for update to authenticated
using (bucket_id = 'portfolio' and public.is_admin()) with check (bucket_id = 'portfolio' and public.is_admin());
create policy "admins delete portfolio media" on storage.objects for delete to authenticated
using (bucket_id = 'portfolio' and public.is_admin());
