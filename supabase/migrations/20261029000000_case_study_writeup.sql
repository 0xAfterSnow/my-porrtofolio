-- Case studies as structured engineering write-ups.
-- Safe to run more than once. Nothing is dropped: the old challenge and solution
-- columns stay as a backup, and the app reads them as a fallback if brief or
-- approach are empty.

begin;

alter table public.case_studies
  add column if not exists subtitle text,
  add column if not exists context text,
  add column if not exists role text,
  add column if not exists timeframe text,
  add column if not exists key_facts jsonb not null default '[]'::jsonb,
  add column if not exists metrics jsonb,
  add column if not exists brief text,
  add column if not exists approach text,
  add column if not exists architecture jsonb not null default '[]'::jsonb,
  add column if not exists architecture_notes text,
  add column if not exists implementation text,
  add column if not exists results text,
  add column if not exists honest_review text,
  add column if not exists takeaways text,
  add column if not exists links jsonb not null default '[]'::jsonb,
  add column if not exists updated_at timestamptz not null default now();

-- Old required columns become optional; every section after the hero is optional now.
do $$
declare col text;
begin
  foreach col in array array['challenge', 'solution', 'results', 'client', 'image'] loop
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'case_studies' and column_name = col
    ) then
      execute format('alter table public.case_studies alter column %I drop not null', col);
    end if;
  end loop;
end $$;

-- Plain text to HTML: escape, blank lines become paragraphs, newlines become <br>.
create or replace function pg_temp.text_to_html(input text) returns text
language sql immutable as $$
  select case
    when input is null or btrim(input) = '' then null
    when btrim(input) ~* '^<(p|h[1-6]|ul|ol|blockquote|pre|table|figure|div)[\s>]' then btrim(input)
    else '<p>' || replace(
      replace(
        replace(replace(replace(btrim(input), '&', '&amp;'), '<', '&lt;'), '>', '&gt;'),
        E'\n\n', '</p><p>'
      ),
      E'\n', '<br>'
    ) || '</p>'
  end
$$;

update public.case_studies
set brief = pg_temp.text_to_html(challenge)
where (brief is null or brief = '') and challenge is not null;

update public.case_studies
set approach = pg_temp.text_to_html(solution)
where (approach is null or approach = '') and solution is not null;

update public.case_studies
set results = pg_temp.text_to_html(results)
where results is not null and results !~* '^\s*<';

-- metrics: {"label": "value"} becomes [{"value": "...", "label": "..."}]
update public.case_studies
set metrics = coalesce(
  (select jsonb_agg(jsonb_build_object('value', e.value #>> '{}', 'label', e.key))
   from jsonb_each(metrics) as e),
  '[]'::jsonb
)
where jsonb_typeof(metrics) = 'object';

update public.case_studies set metrics = '[]'::jsonb where metrics is null;
alter table public.case_studies alter column metrics set default '[]'::jsonb;
alter table public.case_studies alter column metrics set not null;

-- Unique slugs. Skipped with a notice if duplicates already exist, so the
-- migration never fails halfway; fix the duplicates and run it again.
do $$
begin
  if exists (select slug from public.case_studies group by slug having count(*) > 1) then
    raise notice 'Duplicate case study slugs found; unique index not created.';
  else
    create unique index if not exists case_studies_slug_key on public.case_studies (slug);
  end if;
end $$;

-- Keep updated_at fresh.
create or replace function public.case_studies_touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists case_studies_touch_updated_at on public.case_studies;
create trigger case_studies_touch_updated_at
  before update on public.case_studies
  for each row execute function public.case_studies_touch_updated_at();

commit;
