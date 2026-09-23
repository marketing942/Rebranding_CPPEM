create type public.question_type as enum ('true_false','multiple_choice');

create table public.exam_questions (
  id text primary key,
  exam_slug text not null,
  organization text not null,
  organization_acronym text not null,
  position text not null,
  exam_board text not null,
  exam_board_label text not null,
  year integer not null,
  applied_at date,
  booklet text not null,
  block text,
  subject text not null,
  topic text,
  number integer not null,
  question_type public.question_type not null default 'true_false',
  support_text text,
  support_lines jsonb not null default '[]',
  instruction text,
  statement text,
  options jsonb,
  answer text,
  explanations jsonb not null default '{}',
  annulled boolean not null default false,
  needs_figure boolean not null default false,
  figures text[] not null default '{}',
  needs_review boolean not null default false,
  source_exam_url text not null check (source_exam_url ~ '^https?://'),
  source_answer_url text not null check (source_answer_url ~ '^https?://'),
  published boolean not null default false,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (exam_slug, number),
  constraint answer_required_unless_annulled check (annulled or answer is not null),
  constraint annulled_has_no_answer check (not annulled or answer is null),
  constraint figure_items_have_images check (not needs_figure or cardinality(figures) > 0),
  constraint answer_matches_type check (answer is null
    or (question_type = 'true_false' and answer in ('C','E'))
    or (question_type = 'multiple_choice' and answer in ('A','B','C','D','E'))),
  constraint options_match_type check ((question_type = 'multiple_choice') = (options is not null))
);

create index exam_questions_filter_idx on public.exam_questions (organization_acronym, exam_board, year, subject);
create index exam_questions_exam_idx on public.exam_questions (exam_slug, number);
create index exam_questions_published_idx on public.exam_questions (published, subject);
create index exam_questions_search_idx on public.exam_questions using gin (to_tsvector('portuguese', coalesce(statement,'') || ' ' || coalesce(instruction,'')));

create trigger exam_questions_touch before update on public.exam_questions for each row execute function public.touch_content();

alter table public.exam_questions enable row level security;

create policy "public reads questions" on public.exam_questions for select using (published or public.is_editor());
create policy "editors manage questions" on public.exam_questions for all to authenticated using (public.is_editor()) with check (public.is_editor());
