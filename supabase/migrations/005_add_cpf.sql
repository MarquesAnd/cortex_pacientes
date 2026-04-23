-- Garantir coluna cpf na tabela pacientes
alter table pacientes add column if not exists cpf text;
