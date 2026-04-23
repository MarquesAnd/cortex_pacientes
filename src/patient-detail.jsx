// ============================================================
// CORTEX — Patient Detail view
// ============================================================

function PatientDetail({ patientId, onBack, onGoTo, onNewSessao }) {
  const { PATIENTS, STAGES, TEST_CATALOG, TODAY } = window.CORTEX_DATA;
  const pac = PATIENTS.find(p => p.id === patientId);
  const [tab, setTab] = React.useState('anamnese');
  const [editando, setEditando] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [avancando, setAvancando] = React.useState(false);

  const avancarEtapa = async () => {
    const stages = window.CORTEX_DATA.STAGES;
    const curIdx = stages.findIndex(s => s.id === pac.estagio);
    if (curIdx < 0 || curIdx >= stages.length - 1) return;
    const proxEtapa = stages[curIdx + 1];
    setAvancando(true);
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pac.id);
      if (isUUID) await window.CORTEX_SB.updatePaciente(pac.id, { estagio: proxEtapa.id });
      const idx = window.CORTEX_DATA.PATIENTS.findIndex(p => p.id === pac.id);
      if (idx >= 0) window.CORTEX_DATA.PATIENTS[idx].estagio = proxEtapa.id;
      pac.estagio = proxEtapa.id;
      window.dispatchEvent(new CustomEvent('cortex-data-updated'));
    } catch(e) { alert('Erro: ' + e.message); }
    finally { setAvancando(false); }
  };

  const deletarPaciente = async () => {
    try {
      // Só chama o Supabase se o ID for um UUID válido (pacientes reais)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pac.id);
      if (isUUID) {
        await window.CORTEX_SB.deletePaciente(pac.id);
      }
      window.CORTEX_DATA.PATIENTS = window.CORTEX_DATA.PATIENTS.filter(p => p.id !== pac.id);
      window.dispatchEvent(new CustomEvent('cortex-data-updated'));
      onBack();
    } catch(e) { alert('Erro ao deletar: ' + e.message); }
  };

  if (!pac) return <div>Paciente não encontrado</div>;

  const curIdx = stageIndex(pac.estagio);

  return (
    <div>
      {editando && (
        <ModalEditarPaciente
          pac={pac}
          onClose={() => setEditando(false)}
          onSaved={() => setEditando(false)}
        />
      )}

      {confirmDelete && (
        <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.65)',backdropFilter:'blur(4px)',display:'grid',placeItems:'center',padding:24}}>
          <div style={{background:'var(--surface)',borderRadius:16,padding:32,width:'min(440px,100%)',boxShadow:'0 24px 60px rgba(0,0,0,0.5)',border:'1px solid color-mix(in oklab,var(--danger) 30%,var(--border))'}}>
            <div style={{width:48,height:48,borderRadius:12,background:'color-mix(in oklab,var(--danger) 12%,var(--surface))',display:'grid',placeItems:'center',marginBottom:16}}>
              <I.trash style={{width:22,height:22,color:'var(--danger)'}} />
            </div>
            <h3 style={{margin:'0 0 8px',fontSize:18}}>Deletar paciente?</h3>
            <p style={{margin:'0 0 24px',color:'var(--text-2)',fontSize:14,lineHeight:1.55}}>
              Esta ação é <strong>irreversível</strong>. Todos os dados de <strong>{pac.nome}</strong> serão permanentemente removidos — anamnese, hipóteses, testes e sessões.
            </p>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button onClick={() => setConfirmDelete(false)}
                style={{padding:'10px 20px',borderRadius:8,border:'1px solid var(--border)',background:'var(--surface-2)',color:'var(--text-2)',cursor:'pointer',fontSize:14,fontWeight:500}}>
                Cancelar
              </button>
              <button onClick={deletarPaciente}
                style={{padding:'10px 20px',borderRadius:8,border:'none',background:'var(--danger)',color:'white',cursor:'pointer',fontSize:14,fontWeight:600}}>
                Sim, deletar permanentemente
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Back bar */}
      <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:14}}>
        <button className="ghost-btn" onClick={onBack}><I.chevL /> Pacientes</button>
        <span style={{color:'var(--text-3)', fontSize:13}}>/ {pac.nome}</span>
      </div>

      {/* Header */}
      <div className="pd-header">
        <div className={`pavatar-lg ${pac.corAvatar || 'violet'}`} style={{background:`linear-gradient(135deg, var(--${pac.corAvatar || 'violet'}-400, var(--accent)), var(--${pac.corAvatar || 'violet'}-500, var(--accent)))`}}>
          <div style={{position:'absolute', inset:0, display:'grid', placeItems:'center', fontSize:22, fontWeight:600, color:'white'}}>{initials(pac.nome)}</div>
          {pac.avatar_url
            ? <img src={pac.avatar_url} alt={pac.nome} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',borderRadius:'inherit',zIndex:1}} />
            : <img src={avatarUrl(pac)} alt={pac.nome} style={{position:'relative', zIndex:1}} />
          }
        </div>
        <div style={{flex:1, minWidth: 0}}>
          <h1>{pac.nome}</h1>
          <div className="meta-row">
            <span><b>{pac.tipo}</b>, {pac.idade} anos · nasc. {fmtDateBR(pac.dataNasc)}</span>
            <span>· {pac.escolaridade}</span>
            <span>· CPF <span style={{fontFamily:'var(--font-mono)'}}>{pac.cpf}</span></span>
            <span>· {pac.convenio}</span>
          </div>
          <div className="stage-strip">
            {STAGES.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className={"stage-pellet" + (i < curIdx ? " done" : "") + (i === curIdx ? " current" : "")}>
                  {i < curIdx && <I.check />}
                  {s.label}
                </div>
                {i < STAGES.length - 1 && <div className={"stage-connector" + (i < curIdx ? " done" : "")} />}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="pd-actions">
          <button className="ghost-btn" onClick={() => {
            const msg = `📋 ${pac.nome}\n📞 ${pac.telefone}\n📧 ${pac.email}\n👤 Responsável: ${pac.responsavel}`;
            navigator.clipboard?.writeText(msg).then(() => alert('Dados copiados para a área de transferência!'));
          }}><I.phone /> Contato</button>
          <button className="ghost-btn" onClick={() => setEditando(true)}><I.edit /> Editar</button>
          <button className="ghost-btn" onClick={() => setConfirmDelete(true)}
            style={{color:'var(--danger)', borderColor:'color-mix(in oklab,var(--danger) 40%,var(--border))'}}
            onMouseEnter={e=>{e.currentTarget.style.background='color-mix(in oklab,var(--danger) 10%,transparent)'}}
            onMouseLeave={e=>{e.currentTarget.style.background=''}}>
            <I.trash style={{width:14,height:14}} /> Deletar
          </button>
          {(() => {
            const stages = window.CORTEX_DATA.STAGES;
            const curIdx = stages.findIndex(s => s.id === pac.estagio);
            const proxima = stages[curIdx + 1];
            if (!proxima) return null;
            return (
              <button
                onClick={avancarEtapa}
                disabled={avancando}
                style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  padding:'8px 16px', borderRadius:8, border:'none',
                  background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  color:'white', fontWeight:600, fontSize:13, cursor:'pointer',
                  opacity: avancando ? 0.7 : 1,
                }}
                onMouseEnter={e=>{ if(!avancando) e.currentTarget.style.filter='brightness(1.1)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.filter=''; }}
              >
                {avancando ? '...' : <>→ {proxima.label}</>}
              </button>
            );
          })()}
          <button className="primary-btn" onClick={() => onNewSessao?.(patientId)}><I.plus /> Agendar sessão</button>
        </div>
      </div>

      <div className="pd-layout">
        {/* Left column */}
        <div>
          <div className="card info-card">
            <h4>Informações</h4>
            <div className="row"><span className="lbl">Responsável</span><span className="val">{pac.responsavel}</span></div>
            <div className="row"><span className="lbl">Telefone</span><span className="val" style={{fontFamily:'var(--font-mono)'}}>{pac.telefone}</span></div>
            <div className="row"><span className="lbl">Email</span><span className="val">{pac.email}</span></div>
            <div className="row"><span className="lbl">Escola / Profissão</span><span className="val">{pac.escola}</span></div>
            <div className="row"><span className="lbl">Endereço</span><span className="val">{pac.endereco}</span></div>
            <div className="row"><span className="lbl">Encaminhado por</span><span className="val">{pac.encaminhadoPor}</span></div>

            <h4>Avaliação</h4>
            <div className="row"><span className="lbl">Início</span><span className="val" style={{fontFamily:'var(--font-mono)'}}>{fmtDateBR(pac.inicio)}</span></div>
            <div className="row"><span className="lbl">Previsão laudo</span><span className="val" style={{fontFamily:'var(--font-mono)', color: pac.previsaoLaudo < TODAY && pac.estagio !== 'devolutiva' ? 'var(--danger)' : ''}}>{fmtDateBR(pac.previsaoLaudo)}</span></div>
            <div className="row"><span className="lbl">Progresso</span><span className="val" style={{display:'flex', alignItems:'center', gap:8, flex:1, maxWidth:'none'}}><Progress value={pac.progresso} thin /><span style={{fontFamily:'var(--font-mono)', fontSize:12}}>{pac.progresso}%</span></span></div>
          </div>

          {/* Upcoming sessions */}
          <div className="card" style={{marginTop:16}}>
            <h3>Próximas sessões</h3>
            <div className="timeline" style={{marginTop: 14}}>
              {(pac.sessoes || []).length === 0 && <div style={{color:'var(--text-3)', fontSize:12.5}}>Nenhuma sessão agendada.</div>}
              {(pac.sessoes || []).map((s, i) => (
                <div className={"tl-item" + (s.data < TODAY ? " past" : "")} key={i}>
                  <div className="date">{fmtDateLong(s.data)} · {s.hora} · {s.duracao}min</div>
                  <div className="title">{s.titulo}</div>
                  <div className="sub">{s.tipo}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Tabs */}
          <div className="tabs">
            <button className={tab==='anamnese'?'active':''} onClick={()=>setTab('anamnese')}>
              <I.file /> Anamnese
              <span className="cnt">{pac.anamnese?.completude || 0}%</span>
            </button>
            <button className={tab==='hipoteses'?'active':''} onClick={()=>setTab('hipoteses')}>
              <I.target /> Hipóteses
              <span className="cnt">{(pac.hipoteses||[]).length}</span>
            </button>
            <button className={tab==='escolar'?'active':''} onClick={()=>setTab('escolar')}>
              <I.school /> Relatório escolar
            </button>
            <button className={tab==='bateria'?'active':''} onClick={()=>setTab('bateria')}>
              <I.flask /> Bateria de testes
              <span className="cnt">{(pac.testes||[]).length}</span>
            </button>
            <button className={tab==='laudo'?'active':''} onClick={()=>setTab('laudo')}>
              <I.doc /> Laudo
            </button>
          </div>

          {tab === 'anamnese' && <TabAnamnese pac={pac} />}
          {tab === 'hipoteses' && <TabHipoteses pac={pac} />}
          {tab === 'escolar' && <TabEscolar pac={pac} />}
          {tab === 'bateria' && <TabBateria pac={pac} />}
          {tab === 'laudo' && <TabLaudo pac={pac} onNewSessao={onNewSessao} />}
        </div>
      </div>
    </div>
  );
}

// ---- Anamnese --------------------------------------------------------
// Componente separado para edição de seção da anamnese (hooks válidos)
function AnamneseSecaoModal({ sec, dados, saving, onClose, onSave }) {
  const [formSec, setFormSec] = React.useState(() =>
    sec.fields.reduce((acc, f) => ({ ...acc, [f.key]: dados[f.key] || f.val || '' }), {})
  );
  const inp = {width:'100%',padding:'9px 12px',borderRadius:8,border:'1px solid var(--border)',background:'var(--surface-2)',color:'var(--text)',fontFamily:'inherit',fontSize:13,resize:'vertical',outline:'none'};
  return (
    <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(4px)',display:'grid',placeItems:'center',padding:24}}>
      <div style={{background:'var(--surface)',borderRadius:16,padding:28,width:'min(560px,100%)',maxHeight:'85vh',overflowY:'auto',boxShadow:'0 24px 60px rgba(0,0,0,0.5)',border:'1px solid var(--border)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <h3 style={{margin:0}}>{sec.label}</h3>
          <button onClick={onClose} style={{background:'none',border:'none',color:'var(--text-3)',fontSize:20,cursor:'pointer'}}>✕</button>
        </div>
        {sec.fields.map(f => (
          <div key={f.key} style={{marginBottom:14}}>
            <label style={{display:'block',fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',color:'var(--text-3)',marginBottom:6}}>{f.lbl}</label>
            <textarea value={formSec[f.key] || ''} onChange={e => setFormSec(v => ({...v, [f.key]: e.target.value}))}
              rows={3} style={inp} placeholder={`Preencha ${f.lbl.toLowerCase()}...`} />
          </div>
        ))}
        <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:4}}>
          <button onClick={onClose} style={{padding:'10px 18px',borderRadius:8,border:'1px solid var(--border)',background:'var(--surface-2)',color:'var(--text-2)',cursor:'pointer',fontSize:13}}>Cancelar</button>
          <button onClick={() => onSave(sec.id, formSec)} disabled={saving}
            style={{padding:'10px 20px',borderRadius:8,border:'none',background:'linear-gradient(135deg,var(--teal-500),var(--pink-500))',color:'white',fontWeight:600,cursor:'pointer',fontSize:13}}>
            {saving ? 'Salvando...' : '✓ Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TabAnamnese({ pac }) {
  const [editSecao, setEditSecao] = React.useState(null); // id da seção sendo editada
  const [dados, setDados] = React.useState(pac.anamnese?.dados || {});
  const [secoes, setSecoes] = React.useState(pac.anamnese?.secoes || {});
  const [saving, setSaving] = React.useState(false);

  const sections = [
    { id:'identificacao', label:'Identificação', fields:[
      {lbl:'Queixa principal', key:'queixa_principal', val: pac.queixa},
      {lbl:'Encaminhado por', key:'encaminhado_por', val: pac.encaminhadoPor},
    ]},
    { id:'queixa', label:'Queixa e histórico', fields:[
      {lbl:'Início dos sintomas', key:'inicio_sintomas'},
      {lbl:'Fatores desencadeantes', key:'fatores_desencadeantes'},
    ]},
    { id:'desenvolvimento', label:'Desenvolvimento', fields:[
      {lbl:'Gestação / parto', key:'gestacao_parto'},
      {lbl:'Marcos motores', key:'marcos_motores'},
      {lbl:'Linguagem', key:'linguagem'},
    ]},
    { id:'familia', label:'Contexto familiar', fields:[
      {lbl:'Composição familiar', key:'composicao_familiar'},
      {lbl:'Antecedentes psiquiátricos', key:'antecedentes_psiq'},
    ]},
    { id:'escolar', label:'Histórico escolar', fields:[
      {lbl:'Escola atual', key:'escola_atual', val: pac.escola},
      {lbl:'Desempenho', key:'desempenho_escolar'},
    ]},
    { id:'saude', label:'Saúde e medicações', fields:[
      {lbl:'Condições', key:'condicoes_saude'},
      {lbl:'Medicações em uso', key:'medicacoes'},
    ]},
    { id:'social', label:'Social e emocional', fields:[
      {lbl:'Relacionamentos', key:'relacionamentos'},
      {lbl:'Sono / alimentação', key:'sono_alimentacao'},
    ]},
    { id:'medicacoes', label:'Outros profissionais', fields:[
      {lbl:'Equipe', key:'equipe_outros'},
    ]},
  ];

  const saveSecao = async (secId, newDados) => {
    setSaving(true);
    try {
      const updatedSecoes = { ...secoes, [secId]: true };
      const updatedDados  = { ...dados, ...newDados };
      const preenchidas = Object.values(updatedSecoes).filter(Boolean).length;
      const completude  = Math.round((preenchidas / sections.length) * 100);
      await window.CORTEX_SB.upsertAnamnese(pac.id, pac.clinica_id || window._clinicaId, {
        secoes: updatedSecoes, dados: updatedDados, completude,
      });
      setSecoes(updatedSecoes);
      setDados(updatedDados);
      const idx = window.CORTEX_DATA.PATIENTS.findIndex(p => p.id === pac.id);
      if (idx >= 0) window.CORTEX_DATA.PATIENTS[idx].anamnese = { completude, secoes: updatedSecoes, dados: updatedDados };
      window.recarregarPaciente?.(pac.id);
      window.dispatchEvent(new CustomEvent('cortex-data-updated'));
      setEditSecao(null);
    } catch(e) { alert('Erro ao salvar: ' + e.message); }
    finally { setSaving(false); }
  };

  const completude = Math.round((Object.values(secoes).filter(Boolean).length / sections.length) * 100);

  return (
    <div>
      <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:14}}>
        <strong style={{fontSize:14}}>Completude:</strong>
        <div style={{flex:1, maxWidth:240}}><Progress value={completude} /></div>
        <span style={{fontFamily:'var(--font-mono)', fontSize:13}}>{completude}%</span>
      </div>
      <div className="anamnese-grid">
        {sections.map(s => {
          const done = secoes[s.id];
          return (
            <div className="anamnese-section" key={s.id}>
              <div className="head">
                <strong>{s.label}</strong>
                <span className={"status" + (done ? "" : " pending")}>{done ? 'Preenchido' : 'Pendente'}</span>
                <button onClick={() => setEditSecao(s.id)} style={{marginLeft:'auto',background:'none',border:'1px solid var(--border)',borderRadius:6,padding:'2px 10px',fontSize:12,color:'var(--text-3)',cursor:'pointer'}}>
                  <I.edit style={{width:11,height:11}} /> {done ? 'Editar' : 'Preencher'}
                </button>
              </div>
              {s.fields.map((f, i) => (
                <div className="form-row" key={i}>
                  <label>{f.lbl}</label>
                  <div className={"value" + (done ? '' : ' placeholder')}>
                    {done ? (dados[f.key] || f.val || '—') : 'Ainda não preenchido'}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Modal de edição de seção — componente separado para respeitar regras de hooks */}
      {editSecao && (
        <AnamneseSecaoModal
          sec={sections.find(s => s.id === editSecao)}
          dados={dados}
          saving={saving}
          onClose={() => setEditSecao(null)}
          onSave={(secId, formData) => saveSecao(secId, formData)}
        />
      )}
    </div>
  );
}

// ---- Hipóteses -------------------------------------------------------
function HypModal({ hyp, onClose, onSave }) {
  const [f, setF] = React.useState({
    id: hyp?.id || null, titulo: hyp?.titulo || '', status: hyp?.status || 'em-investigacao',
    peso: hyp?.peso ?? 2, evidencias: hyp?.evidencias || [],
  });
  const [novaEvid, setNovaEvid] = React.useState('');
  const inp = {width:'100%',padding:'9px 12px',borderRadius:8,border:'1px solid var(--border)',background:'var(--surface-2)',color:'var(--text)',fontFamily:'inherit',fontSize:13,outline:'none'};
  return (
    <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(4px)',display:'grid',placeItems:'center',padding:24}}>
      <div style={{background:'var(--surface)',borderRadius:16,padding:28,width:'min(520px,100%)',boxShadow:'0 24px 60px rgba(0,0,0,0.5)',border:'1px solid var(--border)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <h3 style={{margin:0}}>{f.id ? 'Editar hipótese' : 'Nova hipótese'}</h3>
          <button onClick={onClose} style={{background:'none',border:'none',color:'var(--text-3)',fontSize:20,cursor:'pointer'}}>✕</button>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{display:'block',fontSize:11,fontWeight:600,textTransform:'uppercase',color:'var(--text-3)',marginBottom:6}}>Hipótese diagnóstica</label>
          <input value={f.titulo} onChange={e=>setF(v=>({...v,titulo:e.target.value}))} style={inp} placeholder="Ex: TDAH — Apresentação Combinada" autoFocus />
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
          <div>
            <label style={{display:'block',fontSize:11,fontWeight:600,textTransform:'uppercase',color:'var(--text-3)',marginBottom:6}}>Status</label>
            <select value={f.status} onChange={e=>setF(v=>({...v,status:e.target.value}))} style={inp}>
              <option value="em-investigacao">Em investigação</option>
              <option value="confirmada">Confirmada</option>
              <option value="descartada">Descartada</option>
            </select>
          </div>
          <div>
            <label style={{display:'block',fontSize:11,fontWeight:600,textTransform:'uppercase',color:'var(--text-3)',marginBottom:6}}>Peso clínico (0–3)</label>
            <input type="number" min={0} max={3} value={f.peso} onChange={e=>setF(v=>({...v,peso:e.target.value}))} style={inp} />
          </div>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{display:'block',fontSize:11,fontWeight:600,textTransform:'uppercase',color:'var(--text-3)',marginBottom:6}}>Evidências</label>
          <div style={{display:'flex',gap:8,marginBottom:8}}>
            <input value={novaEvid} onChange={e=>setNovaEvid(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&novaEvid.trim()){setF(v=>({...v,evidencias:[...v.evidencias,novaEvid.trim()]}));setNovaEvid('');}}}
              style={inp} placeholder="Ex: WISC-IV: FDI baixo (Enter para adicionar)" />
            <button onClick={()=>{if(novaEvid.trim()){setF(v=>({...v,evidencias:[...v.evidencias,novaEvid.trim()]}));setNovaEvid('');}}}
              style={{padding:'9px 14px',borderRadius:8,border:'none',background:'var(--teal-500)',color:'white',cursor:'pointer',whiteSpace:'nowrap',fontSize:13}}>+</button>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {f.evidencias.map((e,i) => (
              <span key={i} style={{display:'inline-flex',alignItems:'center',gap:4,padding:'3px 10px',borderRadius:999,background:'var(--surface-2)',border:'1px solid var(--border)',fontSize:12}}>
                {e}<button onClick={()=>setF(v=>({...v,evidencias:v.evidencias.filter((_,j)=>j!==i)}))} style={{background:'none',border:'none',color:'var(--text-3)',cursor:'pointer',padding:0,fontSize:14,lineHeight:1}}>✕</button>
              </span>
            ))}
          </div>
        </div>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <button onClick={onClose} style={{padding:'10px 18px',borderRadius:8,border:'1px solid var(--border)',background:'var(--surface-2)',color:'var(--text-2)',cursor:'pointer',fontSize:13}}>Cancelar</button>
          <button onClick={()=>onSave(f)} style={{padding:'10px 20px',borderRadius:8,border:'none',background:'linear-gradient(135deg,var(--teal-500),var(--pink-500))',color:'white',fontWeight:600,cursor:'pointer',fontSize:13}}>
            {f.id ? 'Salvar' : 'Criar hipótese'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TabHipoteses({ pac }) {
  const statusLabel = { 'em-investigacao':'Em investigação', 'confirmada':'Confirmada', 'descartada':'Descartada' };
  const [hyps, setHyps] = React.useState(pac.hipoteses || []);
  const [showModal, setShowModal] = React.useState(false);
  const [editHyp, setEditHyp] = React.useState(null);
  const clinicaId = pac.clinica_id || window._clinicaId;

  const syncLocal = (updated) => {
    setHyps(updated);
    const idx = window.CORTEX_DATA.PATIENTS.findIndex(p => p.id === pac.id);
    if (idx >= 0) window.CORTEX_DATA.PATIENTS[idx].hipoteses = updated;
    window.dispatchEvent(new CustomEvent('cortex-data-updated'));
  };

  const saveHyp = async (form) => {
    try {
      if (form.id) {
        await window.CORTEX_SB.updateHipotese(form.id, { titulo: form.titulo, status: form.status, peso: +form.peso, evidencias: form.evidencias });
        syncLocal(hyps.map(h => h.id === form.id ? {...h, ...form} : h));
      } else {
        const saved = await window.CORTEX_SB.createHipotese({ paciente_id: pac.id, titulo: form.titulo, status: form.status, peso: +form.peso, evidencias: form.evidencias }, clinicaId);
        syncLocal([...hyps, saved]);
      }
      window.recarregarPaciente?.(pac.id);
      setShowModal(false); setEditHyp(null);
    } catch(e) { alert('Erro: ' + e.message); }
  };

  const deleteHyp = async (id) => {
    if (!confirm('Remover esta hipótese?')) return;
    await window.CORTEX_SB.deleteHipotese(id).catch(()=>{});
    syncLocal(hyps.filter(h => h.id !== id));
  };

  return (
    <div>
      {(showModal || editHyp) && <HypModal hyp={editHyp} onClose={() => { setShowModal(false); setEditHyp(null); }} onSave={saveHyp} />}
      <div style={{display:'flex', alignItems:'center', marginBottom:14}}>
        <span className="sub" style={{color:'var(--text-3)', fontSize:13}}>Hipóteses diagnósticas com evidências vinculadas aos testes aplicados.</span>
        <button className="primary-btn" style={{marginLeft:'auto'}} onClick={() => setShowModal(true)}><I.plus /> Nova hipótese</button>
      </div>
      {hyps.map(h => (
        <div className={"hyp-card " + h.status} key={h.id}>
          <div className="title-row">
            <strong>{h.titulo}</strong>
            <span className={"pill " + (h.status === 'confirmada' ? 'ok' : h.status === 'descartada' ? '' : 'warn')}>{statusLabel[h.status]}</span>
            <div className="weight" title="Peso clínico">
              {[0,1,2,3].map(i => <span key={i} className={"w" + (i < h.peso ? " on" : "")} />)}
            </div>
            <button onClick={() => setEditHyp(h)} style={{marginLeft:'auto',background:'none',border:'1px solid var(--border)',borderRadius:6,padding:'2px 10px',fontSize:12,color:'var(--text-3)',cursor:'pointer'}}><I.edit style={{width:11,height:11}} /></button>
            <button onClick={() => deleteHyp(h.id)} style={{background:'none',border:'none',color:'var(--text-3)',cursor:'pointer',padding:4}} onMouseEnter={e=>e.currentTarget.style.color='var(--danger)'} onMouseLeave={e=>e.currentTarget.style.color='var(--text-3)'}><I.trash style={{width:13,height:13}} /></button>
          </div>
          <div style={{color:'var(--text-2)', fontSize:13, lineHeight:1.5}}>
            {h.status === 'confirmada' && 'Confirmada pelos achados nos testes e entrevista clínica.'}
            {h.status === 'em-investigacao' && 'Hipótese ativa — aguardando conclusão dos testes para fechamento.'}
            {h.status === 'descartada' && 'Descartada após análise dos resultados.'}
          </div>
          <div className="evidencias">
            <span style={{fontSize:11, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:600, alignSelf:'center', marginRight:4}}>Evidências:</span>
            {(h.evidencias||[]).length ? h.evidencias.map((e, i) => <span className="tag" key={i}>{e}</span>) : <span className="tag none">nenhuma vinculada ainda</span>}
          </div>
        </div>
      ))}
      {hyps.length === 0 && <div className="empty"><I.target /> Nenhuma hipótese cadastrada ainda.</div>}
    </div>
  );
}

// ---- Relatório escolar ----------------------------------------------
function TabEscolar({ pac, onNewSessao }) {
  const [r, setR] = React.useState(pac.relatorioEscolar || {});
  const [showAnotacao, setShowAnotacao] = React.useState(false);
  const [anotacao, setAnotacao] = React.useState(r.anotacao || '');
  const [saving, setSaving] = React.useState(false);
  const clinicaId = pac.clinica_id || window._clinicaId;

  const solicitarEscola = () => {
    const email = prompt('E-mail da escola para solicitar o relatório:');
    if (!email) return;
    const assunto = encodeURIComponent(`Relatório Escolar — ${pac.nome}`);
    const corpo = encodeURIComponent(
      `Prezada equipe escolar,\n\nSolicito relatório pedagógico referente ao(a) aluno(a) ${pac.nome} para fins de avaliação neuropsicológica.\n\nAgradecemos a colaboração.\n\nAtenciosamente,\nEquilíbrium Neuropsicologia`
    );
    window.open(`mailto:${email}?subject=${assunto}&body=${corpo}`);
  };

  const salvarAnotacao = async () => {
    setSaving(true);
    try {
      const updated = { ...r, anotacao };
      await window.CORTEX_SB.upsertRelatorioEscolar(pac.id, clinicaId, updated);
      setR(updated);
      const idx = window.CORTEX_DATA.PATIENTS.findIndex(p => p.id === pac.id);
      if (idx >= 0) window.CORTEX_DATA.PATIENTS[idx].relatorioEscolar = updated;
      setShowAnotacao(false);
    } catch(e) { alert('Erro: ' + e.message); }
    finally { setSaving(false); }
  };

  if (!r.recebido) {
    return (
      <div className="card" style={{textAlign:'center', padding: 40}}>
        <I.school style={{width:32, height:32, color:'var(--text-3)', margin:'0 auto'}} />
        <h3 style={{marginTop:12}}>Relatório escolar não recebido</h3>
        <div className="sub" style={{marginTop:4}}>{r.resumo || 'Ainda não foi solicitado.'}</div>
        <button className="primary-btn" style={{marginTop:14}} onClick={solicitarEscola}>
          <I.mail /> Solicitar à escola
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12}}>
        <h3>Relatório escolar</h3>
        <span className="pill ok">Recebido</span>
        <span style={{fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text-3)', marginLeft:'auto'}}>{fmtDateBR(r.data)}</span>
      </div>
      <p style={{color:'var(--text-2)', lineHeight:1.55, margin:0}}>
        {r.resumo || `A coordenação de ${pac.escola} enviou relatório pedagógico.`}
      </p>
      {r.anotacao && (
        <div style={{marginTop:12, padding:'10px 14px', borderRadius:8, background:'var(--surface-2)', border:'1px solid var(--border)', fontSize:13, color:'var(--text-2)', lineHeight:1.55}}>
          <strong style={{fontSize:11, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--text-3)'}}>Anotação clínica</strong>
          <p style={{margin:'6px 0 0'}}>{r.anotacao}</p>
        </div>
      )}
      <div style={{marginTop:14, display:'flex', gap:8}}>
        {r.arquivo_url && (
          <button className="ghost-btn" onClick={() => window.open(r.arquivo_url, '_blank')}>
            <I.file /> Abrir PDF original
          </button>
        )}
        <button className="ghost-btn" onClick={() => setShowAnotacao(true)}>
          <I.edit /> {r.anotacao ? 'Editar anotação' : 'Adicionar anotação'}
        </button>
      </div>

      {showAnotacao && (
        <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(4px)',display:'grid',placeItems:'center',padding:24}} onClick={() => setShowAnotacao(false)}>
          <div style={{background:'var(--surface)',borderRadius:16,padding:28,width:'min(520px,100%)',boxShadow:'0 24px 60px rgba(0,0,0,0.5)',border:'1px solid var(--border)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
              <h3 style={{margin:0}}>Anotação clínica</h3>
              <button onClick={() => setShowAnotacao(false)} style={{background:'none',border:'none',color:'var(--text-3)',fontSize:20,cursor:'pointer'}}>✕</button>
            </div>
            <textarea value={anotacao} onChange={e => setAnotacao(e.target.value)} rows={6}
              placeholder="Observações clínicas sobre o relatório escolar..."
              style={{width:'100%',padding:'10px 12px',borderRadius:8,border:'1px solid var(--border)',background:'var(--surface-2)',color:'var(--text)',fontFamily:'inherit',fontSize:13,resize:'vertical',outline:'none',marginBottom:16}} />
            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button onClick={() => setShowAnotacao(false)} style={{padding:'10px 18px',borderRadius:8,border:'1px solid var(--border)',background:'var(--surface-2)',color:'var(--text-2)',cursor:'pointer',fontSize:13}}>Cancelar</button>
              <button onClick={salvarAnotacao} disabled={saving} style={{padding:'10px 20px',borderRadius:8,border:'none',background:'linear-gradient(135deg,var(--teal-500),var(--pink-500))',color:'white',fontWeight:600,cursor:'pointer',fontSize:13}}>
                {saving ? 'Salvando...' : '✓ Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Bateria de testes ----------------------------------------------
function RegistrarModal({ teste, onClose, onConfirm }) {
  const [data, setData] = React.useState(new Date().toISOString().slice(0,10));
  return (
    <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(4px)',display:'grid',placeItems:'center',padding:24}}>
      <div style={{background:'var(--surface)',borderRadius:16,padding:28,width:'min(420px,100%)',boxShadow:'0 24px 60px rgba(0,0,0,0.5)',border:'1px solid var(--border)'}}>
        <h3 style={{margin:'0 0 20px'}}>Registrar aplicação</h3>
        <div style={{fontWeight:600,marginBottom:16,fontSize:14}}>{teste.name}</div>
        <div style={{marginBottom:20}}>
          <label style={{display:'block',fontSize:11,fontWeight:600,textTransform:'uppercase',color:'var(--text-3)',marginBottom:6}}>Data de aplicação</label>
          <input type="date" value={data} onChange={e=>setData(e.target.value)} style={{width:'100%',padding:'10px 12px',borderRadius:8,border:'1px solid var(--border)',background:'var(--surface-2)',color:'var(--text)',fontFamily:'inherit',fontSize:14,outline:'none'}} />
        </div>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
          <button onClick={onClose} style={{padding:'10px 18px',borderRadius:8,border:'1px solid var(--border)',background:'var(--surface-2)',color:'var(--text-2)',cursor:'pointer',fontSize:13}}>Cancelar</button>
          <button onClick={()=>onConfirm(data)} style={{padding:'10px 20px',borderRadius:8,border:'none',background:'linear-gradient(135deg,var(--teal-500),var(--pink-500))',color:'white',fontWeight:600,cursor:'pointer',fontSize:13}}>
            ✓ Confirmar aplicação
          </button>
        </div>
      </div>
    </div>
  );
}

function AdicionarTesteModal({ onClose, jaAdicionados, onAdicionar }) {
  const [q, setQ] = React.useState('');
  const [sel, setSel] = React.useState('');
  const [prevista, setPrevista] = React.useState('');
  const { TEST_CATALOG } = window.CORTEX_DATA;
  const todos = Object.entries(TEST_CATALOG).flatMap(([cat, ts]) => ts.map(t => ({...t, cat})));
  const filtrados = todos.filter(t => !jaAdicionados.has(t.id) && (!q || t.name.toLowerCase().includes(q.toLowerCase()) || t.avalia?.toLowerCase().includes(q.toLowerCase())));
  return (
    <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(4px)',display:'grid',placeItems:'center',padding:24}}>
      <div style={{background:'var(--surface)',borderRadius:16,padding:28,width:'min(560px,100%)',maxHeight:'80vh',display:'flex',flexDirection:'column',boxShadow:'0 24px 60px rgba(0,0,0,0.5)',border:'1px solid var(--border)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h3 style={{margin:0}}>Adicionar instrumento</h3>
          <button onClick={onClose} style={{background:'none',border:'none',color:'var(--text-3)',fontSize:20,cursor:'pointer'}}>✕</button>
        </div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar instrumento..." autoFocus style={{width:'100%',padding:'9px 12px',borderRadius:8,border:'1px solid var(--border)',background:'var(--surface-2)',color:'var(--text)',fontFamily:'inherit',fontSize:13,outline:'none',marginBottom:12}} />
        <div style={{flex:1,overflowY:'auto',marginBottom:16,border:'1px solid var(--border)',borderRadius:8}}>
          {filtrados.slice(0,40).map(t => (
            <div key={t.id} onClick={()=>setSel(t.id)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',cursor:'pointer',borderBottom:'1px solid var(--border)',background: sel===t.id ? 'var(--surface-2)' : 'transparent'}}>
              <div style={{width:16,height:16,borderRadius:4,border:`2px solid ${sel===t.id ? 'var(--teal-500)' : 'var(--border)'}`,background: sel===t.id ? 'var(--teal-500)' : 'transparent',display:'grid',placeItems:'center',flexShrink:0}}>
                {sel===t.id && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13}}>{t.name}</div>
                <div style={{fontSize:11,color:'var(--text-3)'}}>{t.avalia} · {t.faixa}</div>
              </div>
            </div>
          ))}
          {filtrados.length === 0 && <div style={{padding:20,textAlign:'center',color:'var(--text-3)',fontSize:13}}>Nenhum instrumento encontrado</div>}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{flex:1}}>
            <label style={{display:'block',fontSize:11,fontWeight:600,textTransform:'uppercase',color:'var(--text-3)',marginBottom:4}}>Data prevista</label>
            <input type="date" value={prevista} onChange={e=>setPrevista(e.target.value)} style={{width:'100%',padding:'9px 12px',borderRadius:8,border:'1px solid var(--border)',background:'var(--surface-2)',color:'var(--text)',fontFamily:'inherit',fontSize:13,outline:'none'}} />
          </div>
          <button onClick={()=>sel && onAdicionar(sel, prevista)} disabled={!sel}
            style={{padding:'10px 20px',borderRadius:8,border:'none',background:sel?'linear-gradient(135deg,var(--teal-500),var(--pink-500))':'var(--border)',color:'white',fontWeight:600,cursor:sel?'pointer':'not-allowed',fontSize:13,marginTop:20,whiteSpace:'nowrap'}}>
            + Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

function TabBateria({ pac }) {
  const { TEST_CATALOG, TODAY } = window.CORTEX_DATA;
  const testes = pac.testes || [];

  // Agrupar por categoria
  const byCat = {};
  testes.forEach(t => {
    const info = findTest(t.id);
    (byCat[info.cat] = byCat[info.cat] || []).push({ ...t, ...info });
  });
  const cats = Object.keys(byCat);

  const done = testes.filter(t => t.status === 'aplicado').length;

  const [localTestes, setLocalTestes] = React.useState(testes);
  const [showAddModal, setShowAddModal]       = React.useState(false);
  const [registrando, setRegistrando]         = React.useState(null); // teste sendo registrado
  const clinicaId = pac.clinica_id || window._clinicaId;

  const syncTestes = (updated) => {
    setLocalTestes(updated);
    const idx = window.CORTEX_DATA.PATIENTS.findIndex(p => p.id === pac.id);
    if (idx >= 0) window.CORTEX_DATA.PATIENTS[idx].testes = updated;
    window.dispatchEvent(new CustomEvent('cortex-data-updated'));
  };

  const registrarAplicacao = async (teste, dataAplicada) => {
    try {
      const patch = { status: 'aplicado', aplicada: dataAplicada };
      if (teste.dbId) {
        await window.CORTEX_SB.updateTestePaciente(teste.dbId, patch);
      }
      syncTestes(localTestes.map(t => t.id === teste.id ? {...t, ...patch} : t));
      await window.recarregarPaciente?.(pac.id);
      setRegistrando(null);
    } catch(e) { alert('Erro: ' + e.message); }
  };

  const adicionarTeste = async (testeId, prevista) => {
    try {
      const saved = await window.CORTEX_SB.createTestePaciente({ paciente_id: pac.id, teste_id: testeId, prevista, status: 'pendente' }, clinicaId);
      const info = findTest(testeId);
      const novo = { id: testeId, dbId: saved.id, status: 'pendente', prevista, aplicada: null, ...info };
      syncTestes([...localTestes, novo]);
      setShowAddModal(false);
    } catch(e) { alert('Erro: ' + e.message); }
  };

  const removerTeste = async (teste) => {
    if (!confirm('Remover este teste da bateria?')) return;
    if (teste.dbId) await window.CORTEX_SB.deleteTestePaciente(teste.dbId).catch(()=>{});
    syncTestes(localTestes.filter(t => t.id !== teste.id));
  };

  // Recalcular com localTestes
  const byCatLocal = {};
  localTestes.forEach(t => {
    const info = findTest(t.id);
    (byCatLocal[info.cat] = byCatLocal[info.cat] || []).push({ ...t, ...info });
  });
  const catsLocal = Object.keys(byCatLocal);
  const doneLocal = localTestes.filter(t => t.status === 'aplicado').length;





  if (localTestes.length === 0) {
    return (
      <>
        {showAddModal && <AdicionarTesteModal onClose={() => setShowAddModal(false)} jaAdicionados={new Set(localTestes.map(t => t.id))} onAdicionar={adicionarTeste} />}
        <div className="card" style={{textAlign:'center', padding: 40}}>
          <I.flask style={{width:32, height:32, color:'var(--text-3)', margin:'0 auto'}} />
          <h3 style={{marginTop:12}}>Bateria ainda não montada</h3>
          <div className="sub" style={{marginTop:4}}>Selecione testes do catálogo após concluir anamnese e hipóteses.</div>
          <button className="primary-btn" style={{marginTop:14}} onClick={() => setShowAddModal(true)}><I.plus /> Montar bateria</button>
        </div>
      </>
    );
  }

  return (
    <>
      {showAddModal && <AdicionarTesteModal onClose={() => setShowAddModal(false)} jaAdicionados={new Set(localTestes.map(t => t.id))} onAdicionar={adicionarTeste} />}
      {registrando && <RegistrarModal teste={registrando} onClose={() => setRegistrando(null)} onConfirm={(data) => registrarAplicacao(registrando, data)} />}
      <div>
        <div style={{display:'flex', gap:14, alignItems:'center', marginBottom:14}}>
          <strong style={{fontSize: 14}}>{doneLocal} de {localTestes.length} aplicados</strong>
          <div style={{flex:1, maxWidth: 240}}><Progress value={localTestes.length ? (doneLocal/localTestes.length)*100 : 0} /></div>
          <button className="ghost-btn" style={{marginLeft:'auto'}} onClick={() => setShowAddModal(true)}><I.plus /> Adicionar teste</button>
        </div>

        {catsLocal.map(cat => (
          <div className="battery-group" key={cat}>
            <h4>{cat} <span className="cnt">· {byCatLocal[cat].filter(t=>t.status==='aplicado').length}/{byCatLocal[cat].length}</span></h4>
            {byCatLocal[cat].map(t => {
              const overdue = isTestOverdue(t, TODAY);
              return (
                <div className={"test-row " + t.status} key={t.id + t.status}>
                  <div className="check">{t.status === 'aplicado' && <I.check />}</div>
                  <div>
                    <div className="name">{t.name}</div>
                    {t.obs && <span className="obs">{t.obs}</span>}
                  </div>
                  <div className="dates">
                    <span className="lbl">Prevista</span>
                    <span style={{color: overdue ? 'var(--danger)' : ''}}>{fmtDateBR(t.prevista)}</span>
                  </div>
                  <div className="dates">
                    <span className="lbl">Aplicada</span>
                    <span>{t.aplicada ? fmtDateBR(t.aplicada) : '—'}</span>
                  </div>
                  <div>
                    <span className={"pill " + (t.status === 'aplicado' ? 'ok' : t.status === 'agendado' ? 'teal' : overdue ? 'danger' : '')}>
                      {overdue ? 'Atrasado' : t.status === 'aplicado' ? 'Aplicado' : t.status === 'agendado' ? 'Agendado' : 'Pendente'}
                    </span>
                  </div>
                  {t.status === 'aplicado'
                    ? <button className="small" onClick={() => setRegistrando(t)}>Ver</button>
                    : <button className="small" onClick={() => setRegistrando(t)}>Registrar</button>
                  }
                  <button onClick={() => removerTeste(t)} style={{background:'none',border:'none',color:'var(--text-3)',cursor:'pointer',padding:4}} onMouseEnter={e=>e.currentTarget.style.color='var(--danger)'} onMouseLeave={e=>e.currentTarget.style.color='var(--text-3)'}><I.trash style={{width:12,height:12}} /></button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

// ---- Laudo -----------------------------------------------------------
function TabLaudo({ pac, onNewSessao }) {
  const hypsConfirm = (pac.hipoteses || []).filter(h => h.status === 'confirmada');
  const testsDone = (pac.testes || []).filter(t => t.status === 'aplicado').length;
  const ready = pac.progresso >= 70;

  return (
    <div className="laudo-grid">
      <div>
        <div className="laudo-section">
          <h4>Síntese do caso</h4>
          <p>
            <b>{pac.nome}</b>, {pac.idade} anos, {pac.escolaridade.toLowerCase()}. Encaminhado(a) por {pac.encaminhadoPor} para avaliação neuropsicológica em razão de: <i>{pac.queixa.toLowerCase()}</i>
          </p>
          <p>
            Foram realizadas {(pac.sessoes||[]).length + testsDone} sessões no total, com aplicação de {testsDone} instrumentos padronizados cobrindo funções intelectuais, atencionais, mnésicas, executivas, acadêmicas e emocionais.
          </p>
        </div>
        <div className="laudo-section" style={{marginTop:14}}>
          <h4>Conclusão diagnóstica</h4>
          {hypsConfirm.length ? hypsConfirm.map(h => (
            <div key={h.id} style={{padding:'10px 12px', background:'var(--accent-soft)', borderRadius:8, marginBottom:8, color:'var(--accent-ink)', fontWeight:500}}>
              ✓ {h.titulo}
            </div>
          )) : <p style={{color:'var(--text-3)'}}>Aguardando confirmação das hipóteses diagnósticas.</p>}
        </div>
        <div className="laudo-section" style={{marginTop:14}}>
          <h4>Recomendações</h4>
          <p style={{color:'var(--text-3)', fontStyle:'italic'}}>Esta seção será preenchida no fechamento do laudo — inclui encaminhamentos, orientações à família e à escola.</p>
        </div>
      </div>
      <div>
        <div className="card">
          <h3>Status do laudo</h3>
          <div style={{marginTop: 10, marginBottom: 14}}>
            <Progress value={pac.progresso} />
          </div>
          <div style={{fontSize:12, color:'var(--text-3)', marginBottom: 16}}>
            Entregar até <b style={{color: pac.previsaoLaudo < window.CORTEX_DATA.TODAY ? 'var(--danger)' : 'var(--text)'}}>{fmtDateBR(pac.previsaoLaudo)}</b>
          </div>
          <button className={ready ? 'primary-btn' : 'ghost-btn'} disabled={!ready}
            onClick={() => ready && window.print()}
            style={{width:'100%', justifyContent:'center'}}>
            <I.doc /> {ready ? 'Gerar PDF do laudo' : 'Aguardando testes'}
          </button>
          <button className="ghost-btn" onClick={() => onNewSessao?.(pac.id)} style={{width:'100%', justifyContent:'center', marginTop:8}}>
            <I.cal /> Agendar devolutiva
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal editar paciente
function ModalEditarPaciente({ pac, onClose, onSaved }) {
  const [form, setForm] = React.useState({
    nome: pac.nome || '',
    tipo: pac.tipo || 'Criança',
    data_nasc: pac.dataNasc || '',
    escolaridade: pac.escolaridade || '',
    escola: pac.escola || '',
    responsavel: pac.responsavel || '',
    telefone: pac.telefone || '',
    email: pac.email || '',
    convenio: pac.convenio || 'Particular',
    encaminhado_por: pac.encaminhadoPor || '',
    queixa: pac.queixa || '',
    estagio: pac.estagio || 'anamnese',
    progresso: pac.progresso || 0,
    previsao_laudo: pac.previsaoLaudo || '',
    ativo: pac.ativo !== false,
  });
  const [fotoUrl, setFotoUrl] = React.useState(pac.avatar_url || null);
  const [saving, setSaving] = React.useState(false);
  const [err, setErr] = React.useState('');
  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setErr('');
    try {
      const patch = { ...form };
      if (fotoUrl !== (pac.avatar_url || null)) patch.avatar_url = fotoUrl;
      // Limpar campos de data vazios — Supabase não aceita string vazia em campos date
      if (!patch.data_nasc)      patch.data_nasc      = null;
      if (!patch.previsao_laudo) patch.previsao_laudo = null;
      await window.CORTEX_SB.updatePaciente(pac.id, patch);
      // Atualizar localmente
      const idx = window.CORTEX_DATA.PATIENTS.findIndex(p => p.id === pac.id);
      if (idx >= 0) {
        window.CORTEX_DATA.PATIENTS[idx] = { ...window.CORTEX_DATA.PATIENTS[idx],
          nome: form.nome, tipo: form.tipo, dataNasc: form.data_nasc,
          escolaridade: form.escolaridade, escola: form.escola,
          responsavel: form.responsavel, telefone: form.telefone,
          email: form.email, convenio: form.convenio,
          encaminhadoPor: form.encaminhado_por, queixa: form.queixa,
          estagio: form.estagio, progresso: +form.progresso,
          previsaoLaudo: form.previsao_laudo, ativo: form.ativo,
          avatar_url: fotoUrl,
        };
      }
      window.dispatchEvent(new CustomEvent('cortex-data-updated'));
      onSaved?.();
      onClose();
    } catch(e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  const inp = {width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid var(--border)', background:'var(--surface-2)', color:'var(--text)', fontFamily:'inherit', fontSize:13, outline:'none'};
  const lbl = {display:'block', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--text-3)', marginBottom:5};
  const { STAGES } = window.CORTEX_DATA;
  // Convênios do banco (cache localStorage sincronizado com Supabase via hydratePacientes)
  const convenioOpts = window.getConveniosAtivos?.() || ['Particular','Unimed','Bradesco Saúde','Amil','Hapvida'];

  return (
    <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(4px)',display:'grid',placeItems:'center',padding:24}}>
      <form onSubmit={save} style={{background:'var(--surface)',borderRadius:16,padding:28,width:'min(680px,100%)',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 60px rgba(0,0,0,0.5)',border:'1px solid var(--border)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <h2 style={{margin:0,fontSize:18}}>Editar paciente</h2>
          <button type="button" onClick={onClose} style={{background:'none',border:'none',color:'var(--text-3)',fontSize:20,cursor:'pointer'}}>✕</button>
        </div>
        <div style={{display:'flex',gap:20,alignItems:'flex-start',marginBottom:20}}>
          <FotoUpload src={fotoUrl} onFile={setFotoUrl} size={80} shape="square" label="Foto do paciente" />
          <div style={{flex:1, color:'var(--text-2)', fontSize:13, lineHeight:1.6}}>
            <div style={{fontWeight:600, fontSize:14, marginBottom:4}}>{form.nome || 'Novo paciente'}</div>
            <div>{form.tipo} · {form.convenio || 'Convênio não definido'}</div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <div style={{gridColumn:'span 2'}}><label style={lbl}>Nome completo</label><input value={form.nome} onChange={e=>set('nome',e.target.value)} style={inp} required /></div>
          <div><label style={lbl}>Tipo</label><select value={form.tipo} onChange={e=>set('tipo',e.target.value)} style={inp}>{['Criança','Adolescente','Adulto','Idoso'].map(t=><option key={t}>{t}</option>)}</select></div>
          <div><label style={lbl}>Data nascimento</label><input type="date" value={form.data_nasc} onChange={e=>set('data_nasc',e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Escolaridade</label><input value={form.escolaridade} onChange={e=>set('escolaridade',e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Escola</label><input value={form.escola} onChange={e=>set('escola',e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Responsável</label><input value={form.responsavel} onChange={e=>set('responsavel',e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Telefone</label><input value={form.telefone} onChange={e=>set('telefone',e.target.value)} style={inp} /></div>
          <div><label style={lbl}>E-mail</label><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Convênio</label>
            <select value={form.convenio} onChange={e=>set('convenio',e.target.value)} style={inp}>
              {convenioOpts.map(c=><option key={c}>{c}</option>)}
              {!convenioOpts.includes(form.convenio) && <option value={form.convenio}>{form.convenio}</option>}
            </select>
          </div>
          <div><label style={lbl}>Encaminhado por</label><input value={form.encaminhado_por} onChange={e=>set('encaminhado_por',e.target.value)} style={inp} /></div>
          <div style={{gridColumn:'span 2'}}><label style={lbl}>Queixa principal</label><textarea value={form.queixa} onChange={e=>set('queixa',e.target.value)} rows={2} style={{...inp,resize:'vertical'}} /></div>
          <div><label style={lbl}>Etapa atual</label>
            <select value={form.estagio} onChange={e=>set('estagio',e.target.value)} style={inp}>
              {STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Progresso (%)</label><input type="number" min={0} max={100} value={form.progresso} onChange={e=>set('progresso',e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Previsão do laudo</label><input type="date" value={form.previsao_laudo} onChange={e=>set('previsao_laudo',e.target.value)} style={inp} /></div>
          <div style={{display:'flex',alignItems:'center',gap:10,paddingTop:20}}>
            <label style={{...lbl,margin:0}}>Ativo</label>
            <div onClick={()=>set('ativo',!form.ativo)} style={{width:40,height:22,borderRadius:11,background:form.ativo?'var(--teal-500)':'var(--border)',cursor:'pointer',position:'relative',transition:'background 0.2s'}}>
              <div style={{position:'absolute',top:2,left:form.ativo?20:2,width:18,height:18,borderRadius:9,background:'white',transition:'left 0.2s',boxShadow:'0 1px 3px rgba(0,0,0,0.3)'}}/>
            </div>
          </div>
        </div>
        {err && <div style={{marginTop:12,padding:'9px 12px',borderRadius:8,background:'color-mix(in oklab,var(--danger) 12%,var(--surface))',color:'var(--danger)',fontSize:13}}>⚠ {err}</div>}
        <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:20,position:'sticky',bottom:0,background:'var(--surface)',paddingTop:12,paddingBottom:4,borderTop:'1px solid var(--border)'}}>
          <button type="button" onClick={onClose} style={{padding:'10px 18px',borderRadius:8,border:'1px solid var(--border)',background:'var(--surface-2)',color:'var(--text-2)',cursor:'pointer',fontSize:13}}>Cancelar</button>
          <button type="submit" disabled={saving} style={{padding:'10px 20px',borderRadius:8,border:'none',background:'linear-gradient(135deg,var(--teal-500),var(--pink-500))',color:'white',fontWeight:600,cursor:'pointer',fontSize:13}}>
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}

Object.assign(window, { PatientDetail, TabAnamnese, TabHipoteses, TabEscolar, TabBateria, TabLaudo, ModalEditarPaciente });
