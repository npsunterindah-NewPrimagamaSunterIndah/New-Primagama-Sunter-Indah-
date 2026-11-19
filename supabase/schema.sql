-- New Primagama Sunter Indah: Tes Diagnostik
-- Jalankan melalui Supabase SQL Editor. Semua akses tabel dilakukan lewat Edge Functions.
create extension if not exists pgcrypto;

create table if not exists public.diagnostic_students (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  school_name text not null,
  parent_name text not null,
  parent_phone text not null,
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.diagnostic_questions (
  id uuid primary key default gen_random_uuid(),
  level text not null check (level in ('SD','SMP','SMA','SMK')),
  grade smallint not null check (grade between 1 and 12),
  subject text not null,
  topic text not null,
  question_text text not null,
  options jsonb not null,
  answer_key text not null check (answer_key in ('A','B','C','D')),
  explanation text,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) = 4)
);

create index if not exists diagnostic_questions_lookup
on public.diagnostic_questions(level, grade, subject, is_active);

create table if not exists public.diagnostic_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.diagnostic_students(id) on delete cascade,
  level text not null,
  grade smallint not null,
  subject text not null,
  status text not null default 'in_progress' check (status in ('in_progress','completed','expired')),
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  completed_at timestamptz,
  score smallint,
  correct_count smallint,
  total_questions smallint not null default 20
);

create table if not exists public.diagnostic_session_questions (
  session_id uuid not null references public.diagnostic_sessions(id) on delete cascade,
  question_id uuid not null references public.diagnostic_questions(id),
  position smallint not null,
  primary key (session_id, question_id),
  unique (session_id, position)
);

create table if not exists public.diagnostic_answers (
  session_id uuid not null references public.diagnostic_sessions(id) on delete cascade,
  question_id uuid not null references public.diagnostic_questions(id),
  selected_answer text check (selected_answer is null or selected_answer in ('A','B','C','D')),
  is_correct boolean not null,
  answered_at timestamptz not null default now(),
  primary key (session_id, question_id)
);

alter table public.diagnostic_students enable row level security;
alter table public.diagnostic_questions enable row level security;
alter table public.diagnostic_sessions enable row level security;
alter table public.diagnostic_session_questions enable row level security;
alter table public.diagnostic_answers enable row level security;

-- Tidak membuat policy publik. Anon key dari browser tidak dapat membaca tabel.
-- Edge Functions memakai service role di server untuk memproses tes.
-- Jangan pernah memasukkan SUPABASE_SERVICE_ROLE_KEY ke file website.

-- Setelah bank soal dimasukkan dan diperiksa tim akademik, aktifkan:
-- update public.diagnostic_questions set is_active = true where ...;
