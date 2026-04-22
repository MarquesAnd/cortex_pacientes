-- Adicionar campos de configuração na tabela clinicas
alter table clinicas add column if not exists convenios jsonb default '[]';
alter table clinicas add column if not exists etapas_fluxo jsonb default '[]';
alter table clinicas add column if not exists config jsonb default '{}';

-- RLS: membros podem atualizar própria clínica
create policy "Membro atualiza clínica" on clinicas for update
  using (id = get_my_clinica_id());
