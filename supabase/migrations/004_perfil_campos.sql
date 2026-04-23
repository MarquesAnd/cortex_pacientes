-- Adicionar campos de perfil que faltam
alter table profiles add column if not exists crp text;
alter table profiles add column if not exists telefone text;
