-- ═══════════════════════════════════════════════════════════════════
-- CORTEX — Schema completo
-- ═══════════════════════════════════════════════════════════════════

-- ── Clínicas (empresas) ──────────────────────────────────────────
create table if not exists clinicas (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  created_at  timestamptz default now()
);

-- ── Perfis de usuário ────────────────────────────────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  clinica_id  uuid references clinicas(id),
  nome        text,
  email       text,
  role        text default 'editor', -- admin | editor | viewer
  avatar_url  text,
  especialidade text,
  created_at  timestamptz default now()
);

-- ── Pacientes ────────────────────────────────────────────────────
create table if not exists pacientes (
  id              uuid primary key default gen_random_uuid(),
  clinica_id      uuid not null references clinicas(id) on delete cascade,
  created_by      uuid references auth.users(id),

  -- Identificação
  nome            text not null,
  data_nasc       date,
  cpf             text,
  tipo            text, -- Criança | Adolescente | Adulto | Idoso
  genero          text,
  escolaridade    text,
  escola          text,
  responsavel     text,
  telefone        text,
  email           text,
  endereco        text,
  convenio        text,
  encaminhado_por text,
  queixa          text,

  -- Avaliação
  estagio         text default 'anamnese',
  progresso       integer default 0,
  inicio          date,
  previsao_laudo  date,
  ativo           boolean default true,
  cor_avatar      text default 'violet',

  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ── Hipóteses diagnósticas ───────────────────────────────────────
create table if not exists hipoteses (
  id          uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  clinica_id  uuid not null references clinicas(id) on delete cascade,
  titulo      text not null,
  status      text default 'em-investigacao', -- em-investigacao | confirmada | descartada
  peso        integer default 2, -- 0-3
  evidencias  text[], -- array de strings
  created_at  timestamptz default now()
);

-- ── Bateria de testes por paciente ───────────────────────────────
create table if not exists testes_paciente (
  id          uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  clinica_id  uuid not null references clinicas(id) on delete cascade,
  teste_id    text not null, -- ref ao catálogo (ex: 'wisc5')
  status      text default 'pendente', -- pendente | agendado | aplicado
  prevista    date,
  aplicada    date,
  obs         text,
  created_at  timestamptz default now()
);

-- ── Sessões / Agenda ─────────────────────────────────────────────
create table if not exists sessoes (
  id          uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  clinica_id  uuid not null references clinicas(id) on delete cascade,
  created_by  uuid references auth.users(id),
  titulo      text not null,
  tipo        text, -- Anamnese | Aplicação | Correção | Devolutiva | Laudo | Planejamento
  data        date not null,
  hora        text, -- 'HH:MM'
  duracao     integer default 60, -- minutos
  notas       text,
  created_at  timestamptz default now()
);

-- ── Anamnese ─────────────────────────────────────────────────────
create table if not exists anamneses (
  id          uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  clinica_id  uuid not null references clinicas(id) on delete cascade,
  completude  integer default 0,
  secoes      jsonb default '{}', -- { identificacao: true, queixa: false, ... }
  dados       jsonb default '{}', -- dados completos de cada seção
  updated_at  timestamptz default now()
);

-- ── Relatório escolar ────────────────────────────────────────────
create table if not exists relatorios_escolares (
  id          uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  clinica_id  uuid not null references clinicas(id) on delete cascade,
  recebido    boolean default false,
  data        date,
  resumo      text,
  arquivo_url text,
  created_at  timestamptz default now()
);

-- ═══════════════════════════════════════════════════════════════════
-- TRIGGER: criar profile e clinica no primeiro signup
-- ═══════════════════════════════════════════════════════════════════
create or replace function public.handle_new_cortex_user()
returns trigger language plpgsql security definer as $$
declare
  v_clinica_id uuid;
begin
  -- Se metadata tem clinica_id, usa ela; senão cria nova
  if new.raw_user_meta_data->>'clinica_id' is not null then
    v_clinica_id := (new.raw_user_meta_data->>'clinica_id')::uuid;
  else
    -- Cria nova clínica
    insert into clinicas (nome)
    values (coalesce(new.raw_user_meta_data->>'clinica_nome', 'Minha Clínica'))
    returning id into v_clinica_id;
  end if;

  -- Cria profile
  insert into profiles (id, email, nome, clinica_id, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    v_clinica_id,
    coalesce(new.raw_user_meta_data->>'role', 'admin')
  )
  on conflict (id) do update
    set clinica_id = coalesce(excluded.clinica_id, profiles.clinica_id),
        nome = coalesce(excluded.nome, profiles.nome);

  return new;
end;
$$;

drop trigger if exists on_cortex_user_created on auth.users;
create trigger on_cortex_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_cortex_user();

-- ═══════════════════════════════════════════════════════════════════
-- HELPER: pegar clinica_id do usuário logado
-- ═══════════════════════════════════════════════════════════════════
create or replace function get_my_clinica_id()
returns uuid language sql security definer stable as $$
  select clinica_id from profiles where id = auth.uid();
$$;

-- ═══════════════════════════════════════════════════════════════════
-- RLS
-- ═══════════════════════════════════════════════════════════════════
alter table clinicas              enable row level security;
alter table profiles              enable row level security;
alter table pacientes             enable row level security;
alter table hipoteses             enable row level security;
alter table testes_paciente       enable row level security;
alter table sessoes               enable row level security;
alter table anamneses             enable row level security;
alter table relatorios_escolares  enable row level security;

-- Clinicas
create policy "Membro vê própria clínica" on clinicas for select
  using (id = get_my_clinica_id());

-- Profiles
create policy "Membro vê profiles da clínica" on profiles for select
  using (clinica_id = get_my_clinica_id() or id = auth.uid());
create policy "Usuário atualiza próprio profile" on profiles for update
  using (id = auth.uid());
create policy "Inserir próprio profile" on profiles for insert
  with check (id = auth.uid() or clinica_id = get_my_clinica_id());

-- Pacientes
create policy "Membro vê pacientes" on pacientes for select
  using (clinica_id = get_my_clinica_id());
create policy "Membro cria paciente" on pacientes for insert
  with check (clinica_id = get_my_clinica_id());
create policy "Membro edita paciente" on pacientes for update
  using (clinica_id = get_my_clinica_id());
create policy "Membro exclui paciente" on pacientes for delete
  using (clinica_id = get_my_clinica_id());

-- Hipóteses
create policy "Membro vê hipóteses" on hipoteses for select using (clinica_id = get_my_clinica_id());
create policy "Membro cria hipótese" on hipoteses for insert with check (clinica_id = get_my_clinica_id());
create policy "Membro edita hipótese" on hipoteses for update using (clinica_id = get_my_clinica_id());
create policy "Membro exclui hipótese" on hipoteses for delete using (clinica_id = get_my_clinica_id());

-- Testes
create policy "Membro vê testes" on testes_paciente for select using (clinica_id = get_my_clinica_id());
create policy "Membro cria teste" on testes_paciente for insert with check (clinica_id = get_my_clinica_id());
create policy "Membro edita teste" on testes_paciente for update using (clinica_id = get_my_clinica_id());
create policy "Membro exclui teste" on testes_paciente for delete using (clinica_id = get_my_clinica_id());

-- Sessões
create policy "Membro vê sessões" on sessoes for select using (clinica_id = get_my_clinica_id());
create policy "Membro cria sessão" on sessoes for insert with check (clinica_id = get_my_clinica_id());
create policy "Membro edita sessão" on sessoes for update using (clinica_id = get_my_clinica_id());
create policy "Membro exclui sessão" on sessoes for delete using (clinica_id = get_my_clinica_id());

-- Anamnese
create policy "Membro vê anamnese" on anamneses for select using (clinica_id = get_my_clinica_id());
create policy "Membro cria anamnese" on anamneses for insert with check (clinica_id = get_my_clinica_id());
create policy "Membro edita anamnese" on anamneses for update using (clinica_id = get_my_clinica_id());

-- Relatórios escolares
create policy "Membro vê relatório" on relatorios_escolares for select using (clinica_id = get_my_clinica_id());
create policy "Membro cria relatório" on relatorios_escolares for insert with check (clinica_id = get_my_clinica_id());
create policy "Membro edita relatório" on relatorios_escolares for update using (clinica_id = get_my_clinica_id());
