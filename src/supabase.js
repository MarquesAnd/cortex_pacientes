// ============================================================
// CORTEX — Supabase client + data access layer
// ============================================================
// Configure com as suas chaves do Supabase:
const SUPABASE_URL  = 'https://evxcwjlfpntopddtbjmq.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eGN3amxmcG50b3BkZHRiam1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjI2NDksImV4cCI6MjA5MjM5ODY0OX0.FjCAEXP-ujTAJbtWNoD2_iKr9z8gQId_Wus1U7sguzQ';

// ── REST helper ─────────────────────────────────────────────
const SB_SESSION_KEY = 'cortex.session';

function sbSession() {
  try { return JSON.parse(localStorage.getItem(SB_SESSION_KEY) || 'null'); }
  catch { return null; }
}
function sbSetSession(s) {
  if (s) localStorage.setItem(SB_SESSION_KEY, JSON.stringify(s));
  else    localStorage.removeItem(SB_SESSION_KEY);
  window.dispatchEvent(new CustomEvent('cortex-session-changed', { detail: s }));
}
function sbHeaders(extra = {}) {
  const s = sbSession();
  return {
    apikey: SUPABASE_ANON,
    Authorization: `Bearer ${s?.access_token || SUPABASE_ANON}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}
async function sbRest(path, opts = {}) {
  const makeReq = (token) => fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...opts,
    headers: {
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(opts.prefer ? { Prefer: opts.prefer } : {}),
      ...(opts.headers || {}),
    },
  });

  let sess = sbSession();
  let res = await makeReq(sess?.access_token || SUPABASE_ANON);

  // Se 401, tentar renovar o token com refresh_token
  if (res.status === 401 && sess?.refresh_token) {
    try {
      const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST',
        headers: { apikey: SUPABASE_ANON, 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: sess.refresh_token }),
      });
      if (r.ok) {
        const newSess = await r.json();
        sbSetSession(newSess);
        res = await makeReq(newSess.access_token);
      } else {
        // Refresh falhou — redirecionar para login
        sbSetSession(null);
        window.location.replace('Login.html');
        return;
      }
    } catch(e) {
      sbSetSession(null);
      window.location.replace('Login.html');
      return;
    }
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase ${res.status}: ${err}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('json') ? res.json() : res.text();
}
async function sbAuth(path, body) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error_description || json.msg || json.error || 'Auth error');
  return json;
}

// ── Auth ─────────────────────────────────────────────────────
async function cortexSignIn(email, password) {
  const s = await sbAuth('/token?grant_type=password', { email, password });
  sbSetSession(s);
  return s;
}
async function cortexSignUp(email, password, meta = {}) {
  const s = await sbAuth('/signup', { email, password, data: meta });
  if (s.access_token) sbSetSession(s);
  return s;
}
async function cortexSignOut() {
  const s = sbSession();
  if (s?.access_token) {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${s.access_token}` },
      });
    } catch {}
  }
  sbSetSession(null);
}
async function cortexGetMe() {
  const s = sbSession();
  if (!s?.access_token) return null;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${s.access_token}` },
  });
  if (!res.ok) return null;
  return res.json();
}
async function cortexGetProfile(userId) {
  const rows = await sbRest(`/profiles?id=eq.${userId}&select=*`);
  return rows[0] || null;
}
async function cortexUpdateProfile(userId, patch) {
  return sbRest(`/profiles?id=eq.${userId}`, {
    method: 'PATCH', body: JSON.stringify(patch), prefer: 'return=representation',
  });
}

// ── Pacientes ────────────────────────────────────────────────
async function fetchPacientes(clinicaId) {
  return sbRest(`/pacientes?clinica_id=eq.${clinicaId}&select=*&order=created_at.desc&limit=500`);
}
async function createPaciente(data, clinicaId, userId) {
  const rows = await sbRest('/pacientes', {
    method: 'POST', prefer: 'return=representation',
    body: JSON.stringify({ ...data, clinica_id: clinicaId, created_by: userId }),
  });
  return rows[0];
}
async function updatePaciente(id, patch) {
  // Campos válidos da tabela pacientes — filtrar para não enviar campos do frontend
  const CAMPOS_VALIDOS = ['nome','tipo','data_nasc','cpf','genero','escolaridade',
    'escola','responsavel','telefone','email','endereco','convenio','encaminhado_por',
    'queixa','estagio','progresso','inicio','previsao_laudo','ativo','cor_avatar','avatar_url'];
  const patchLimpo = {};
  for (const k of CAMPOS_VALIDOS) {
    if (k in patch) patchLimpo[k] = patch[k];
  }
  patchLimpo.updated_at = new Date().toISOString();
  return sbRest(`/pacientes?id=eq.${id}`, {
    method: 'PATCH', prefer: 'return=representation',
    body: JSON.stringify(patchLimpo),
  });
}
async function deletePaciente(id) {
  return sbRest(`/pacientes?id=eq.${id}`, { method: 'DELETE' });
}

// ── Sessões ───────────────────────────────────────────────────
async function fetchSessoes(clinicaId) {
  return sbRest(`/sessoes?clinica_id=eq.${clinicaId}&select=*&order=data.asc,hora.asc&limit=1000`);
}
async function fetchSessoesPaciente(pacienteId) {
  return sbRest(`/sessoes?paciente_id=eq.${pacienteId}&select=*&order=data.asc`);
}
async function createSessao(data, clinicaId, userId) {
  const rows = await sbRest('/sessoes', {
    method: 'POST', prefer: 'return=representation',
    body: JSON.stringify({ ...data, clinica_id: clinicaId, created_by: userId }),
  });
  return rows[0];
}
async function updateSessao(id, patch) {
  return sbRest(`/sessoes?id=eq.${id}`, {
    method: 'PATCH', prefer: 'return=representation', body: JSON.stringify(patch),
  });
}
async function deleteSessao(id) {
  return sbRest(`/sessoes?id=eq.${id}`, { method: 'DELETE' });
}

// ── Hipóteses ─────────────────────────────────────────────────
async function fetchHipoteses(pacienteId) {
  return sbRest(`/hipoteses?paciente_id=eq.${pacienteId}&select=*&order=created_at.asc`);
}
async function createHipotese(data, clinicaId) {
  const rows = await sbRest('/hipoteses', {
    method: 'POST', prefer: 'return=representation',
    body: JSON.stringify({ ...data, clinica_id: clinicaId }),
  });
  return rows[0];
}
async function updateHipotese(id, patch) {
  return sbRest(`/hipoteses?id=eq.${id}`, {
    method: 'PATCH', prefer: 'return=representation', body: JSON.stringify(patch),
  });
}
async function deleteHipotese(id) {
  return sbRest(`/hipoteses?id=eq.${id}`, { method: 'DELETE' });
}

// ── Testes do paciente ────────────────────────────────────────
async function fetchTestesPaciente(pacienteId) {
  return sbRest(`/testes_paciente?paciente_id=eq.${pacienteId}&select=*&order=created_at.asc`);
}
async function createTestePaciente(data, clinicaId) {
  const rows = await sbRest('/testes_paciente', {
    method: 'POST', prefer: 'return=representation',
    body: JSON.stringify({ ...data, clinica_id: clinicaId }),
  });
  return rows[0];
}
async function updateTestePaciente(id, patch) {
  return sbRest(`/testes_paciente?id=eq.${id}`, {
    method: 'PATCH', prefer: 'return=representation', body: JSON.stringify(patch),
  });
}
async function deleteTestePaciente(id) {
  return sbRest(`/testes_paciente?id=eq.${id}`, { method: 'DELETE' });
}

// ── Anamnese ──────────────────────────────────────────────────
async function fetchAnamnese(pacienteId) {
  const rows = await sbRest(`/anamneses?paciente_id=eq.${pacienteId}&select=*`);
  return rows[0] || null;
}
async function upsertAnamnese(pacienteId, clinicaId, patch) {
  // Tenta update primeiro, se não existir cria
  const existing = await fetchAnamnese(pacienteId);
  if (existing) {
    return sbRest(`/anamneses?paciente_id=eq.${pacienteId}`, {
      method: 'PATCH', prefer: 'return=representation',
      body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
    });
  } else {
    return sbRest('/anamneses', {
      method: 'POST', prefer: 'return=representation',
      body: JSON.stringify({ ...patch, paciente_id: pacienteId, clinica_id: clinicaId }),
    });
  }
}

// ── Relatório escolar ─────────────────────────────────────────
async function fetchRelatorioEscolar(pacienteId) {
  const rows = await sbRest(`/relatorios_escolares?paciente_id=eq.${pacienteId}&select=*`);
  return rows[0] || null;
}
async function upsertRelatorioEscolar(pacienteId, clinicaId, patch) {
  const existing = await fetchRelatorioEscolar(pacienteId);
  if (existing) {
    return sbRest(`/relatorios_escolares?paciente_id=eq.${pacienteId}`, {
      method: 'PATCH', prefer: 'return=representation', body: JSON.stringify(patch),
    });
  } else {
    return sbRest('/relatorios_escolares', {
      method: 'POST', prefer: 'return=representation',
      body: JSON.stringify({ ...patch, paciente_id: pacienteId, clinica_id: clinicaId }),
    });
  }
}

// Expor tudo globalmente
// ── Configurações da clínica ─────────────────────────────────
async function fetchClinica(clinicaId) {
  const rows = await sbRest(`/clinicas?id=eq.${clinicaId}&select=*`);
  return rows[0] || null;
}
async function updateClinica(clinicaId, patch) {
  return sbRest(`/clinicas?id=eq.${clinicaId}`, {
    method: 'PATCH', prefer: 'return=representation',
    body: JSON.stringify(patch),
  });
}

window.CORTEX_SB = {
  sbSession, sbSetSession,
  cortexSignIn, cortexSignUp, cortexSignOut, cortexGetMe, cortexGetProfile, cortexUpdateProfile,
  fetchPacientes, createPaciente, updatePaciente, deletePaciente,
  fetchSessoes, fetchSessoesPaciente, createSessao, updateSessao, deleteSessao,
  fetchHipoteses, createHipotese, updateHipotese, deleteHipotese,
  fetchTestesPaciente, createTestePaciente, updateTestePaciente, deleteTestePaciente,
  fetchAnamnese, upsertAnamnese,
  fetchRelatorioEscolar, upsertRelatorioEscolar,
  fetchClinica, updateClinica,
};
