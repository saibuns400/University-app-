-- University Application Portal - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  phone text,
  date_of_birth date,
  nationality text,
  address text,
  high_school text,
  graduation_year integer,
  gpa numeric(3,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Universities
create table public.universities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  short_name text,
  country text not null,
  city text,
  website text,
  logo_url text,
  description text,
  created_at timestamptz default now()
);

-- Programs offered by universities
create table public.programs (
  id uuid default uuid_generate_v4() primary key,
  university_id uuid references public.universities(id) on delete cascade not null,
  name text not null,
  degree_type text not null, -- Bachelor, Master, PhD, Diploma, Certificate
  duration_years numeric(3,1),
  description text,
  requirements text,
  application_deadline date,
  created_at timestamptz default now()
);

-- Applications
create table public.applications (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  university_id uuid references public.universities(id) on delete cascade not null,
  program_id uuid references public.programs(id) on delete cascade not null,
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'under_review', 'accepted', 'rejected', 'waitlisted')),
  personal_statement text,
  additional_info text,
  submitted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(student_id, program_id) -- one application per program per student
);

-- Documents
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  application_id uuid references public.applications(id) on delete set null,
  file_name text not null,
  file_path text not null,
  file_type text not null,
  file_size integer not null,
  document_type text not null, -- transcript, id, certificate, essay, recommendation, other
  created_at timestamptz default now()
);

-- Indexes for performance
create index idx_applications_student on public.applications(student_id);
create index idx_applications_university on public.applications(university_id);
create index idx_applications_status on public.applications(status);
create index idx_programs_university on public.programs(university_id);
create index idx_documents_student on public.documents(student_id);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.universities enable row level security;
alter table public.programs enable row level security;
alter table public.applications enable row level security;
alter table public.documents enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Universities & Programs are public (read-only for students)
create policy "Anyone can view universities"
  on public.universities for select
  using (true);

create policy "Anyone can view programs"
  on public.programs for select
  using (true);

-- Applications policies
create policy "Users can view own applications"
  on public.applications for select
  using (auth.uid() = student_id);

create policy "Users can create own applications"
  on public.applications for insert
  with check (auth.uid() = student_id);

create policy "Users can update own applications"
  on public.applications for update
  using (auth.uid() = student_id);

-- Documents policies
create policy "Users can view own documents"
  on public.documents for select
  using (auth.uid() = student_id);

create policy "Users can upload own documents"
  on public.documents for insert
  with check (auth.uid() = student_id);

create policy "Users can delete own documents"
  on public.documents for delete
  using (auth.uid() = student_id);

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage bucket for documents (run this in Storage section or via SQL)
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', false);

-- Storage policies would be added in Supabase dashboard for the 'documents' bucket.