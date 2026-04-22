-- Adicionar coluna avatar_url na tabela pacientes
alter table pacientes add column if not exists avatar_url text;
