// ============================================================
// CORTEX — Patient Detail view
// ============================================================

function PatientDetail({ patientId, onBack, onGoTo }) {
  const { PATIENTS, STAGES, TEST_CATALOG, TODAY } = window.CORTEX_DATA;
  const pac = PATIENTS.find(p => p.id === patientId);
  const [tab, setTab] = React.useState('anamnese');

  if (!pac) return <div>Paciente não encontrado</div>;

  const curIdx = stageIndex(pac.estagio);

  return (
    <div>
      {/* Back bar */}
      <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:14}}>
        <button className="ghost-btn" onClick={onBack}><I.chevL /> Pacientes</button>
        <span style={{color:'var(--text-3)', fontSize:13}}>/ {pac.nome}</span>
      </div>

      {/* Header */}
      <div className="pd-header">
        <div className={`pavatar-lg ${pac.corAvatar}`} style={{background:`linear-gradient(135deg, var(--${pac.corAvatar}-400, var(--accent)), var(--${pac.corAvatar}-500, var(--accent)))`}}>
          <div style={{position:'absolute', inset:0, display:'grid', placeItems:'center', fontSize:22, fontWeight:600, color:'white'}}>{initials(pac.nome)}</div>
          <img src={avatarUrl(pac)} alt={pac.nome} style={{position:'relative', zIndex:1}} />
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
          <button className="ghost-btn"><I.phone /> Contato</button>
          <button className="ghost-btn"><I.edit /> Editar</button>
          <button className="primary-btn"><I.plus /> Agendar sessão</button>
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
          {tab === 'laudo' && <TabLaudo pac={pac} />}
        </div>
      </div>
    </div>
  );
}

// ---- Anamnese --------------------------------------------------------
function TabAnamnese({ pac }) {
  const sections = [
    { id:'identificacao', label:'Identificação', fields:[{lbl:'Queixa principal', val: pac.queixa}, {lbl:'Encaminhado por', val: pac.encaminhadoPor}] },
    { id:'queixa', label:'Queixa e histórico', fields:[
      {lbl:'Início dos sintomas', val: 'Há aproximadamente 2 anos, com agravamento progressivo.'},
      {lbl:'Fatores desencadeantes', val: 'Mudança de escola + pressão acadêmica crescente.'},
    ]},
    { id:'desenvolvimento', label:'Desenvolvimento', fields:[
      {lbl:'Gestação / parto', val: 'Sem intercorrências. Parto cesárea, 39 semanas.'},
      {lbl:'Marcos motores', val: 'Dentro do esperado. Engatinhou 8m, andou 13m.'},
      {lbl:'Linguagem', val: 'Primeiras palavras 12m; frases 24m.'},
    ]},
    { id:'familia', label:'Contexto familiar', fields:[
      {lbl:'Composição familiar', val: 'Mora com pais e irmão mais novo (5 anos).'},
      {lbl:'Antecedentes psiquiátricos', val: 'Tio materno com diagnóstico de TDAH.'},
    ]},
    { id:'escolar', label:'Histórico escolar', fields:[
      {lbl:'Escola atual', val: pac.escola},
      {lbl:'Desempenho', val: 'Oscilante. Boa em ciências, dificuldade persistente em português.'},
    ]},
    { id:'saude', label:'Saúde e medicações', fields:[
      {lbl:'Condições', val: 'Nega comorbidades clínicas relevantes.'},
      {lbl:'Medicações em uso', val: 'Nenhuma.'},
    ]},
    { id:'social', label:'Social e emocional', fields:[
      {lbl:'Relacionamentos', val: 'Bom com pares; retraída em novos contextos.'},
      {lbl:'Sono / alimentação', val: 'Sono fragmentado; alimentação seletiva.'},
    ]},
    { id:'medicacoes', label:'Outros profissionais', fields:[
      {lbl:'Equipe', val: 'Fonoaudióloga semanal, pediatra anual.'},
    ]},
  ];

  return (
    <div>
      <div style={{display:'flex', gap:10, alignItems:'center', marginBottom: 14}}>
        <strong style={{fontSize: 14}}>Completude:</strong>
        <div style={{flex:1, maxWidth: 240}}><Progress value={pac.anamnese?.completude || 0} /></div>
        <span style={{fontFamily:'var(--font-mono)', fontSize:13}}>{pac.anamnese?.completude || 0}%</span>
        <button className="ghost-btn" style={{marginLeft:'auto'}}><I.edit /> Editar</button>
      </div>
      <div className="anamnese-grid">
        {sections.map(s => {
          const done = pac.anamnese?.secoes?.[s.id];
          return (
            <div className="anamnese-section" key={s.id}>
              <div className="head">
                <strong>{s.label}</strong>
                <span className={"status" + (done ? "" : " pending")}>{done ? 'Preenchido' : 'Pendente'}</span>
              </div>
              {s.fields.map((f, i) => (
                <div className="form-row" key={i}>
                  <label>{f.lbl}</label>
                  <div className={"value" + (done ? '' : ' placeholder')}>{done ? f.val : 'Ainda não preenchido'}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Hipóteses -------------------------------------------------------
function TabHipoteses({ pac }) {
  const statusLabel = { 'em-investigacao':'Em investigação', 'confirmada':'Confirmada', 'descartada':'Descartada' };
  const hyps = pac.hipoteses || [];
  return (
    <div>
      <div style={{display:'flex', alignItems:'center', marginBottom:14}}>
        <span className="sub" style={{color:'var(--text-3)', fontSize:13}}>Hipóteses diagnósticas com evidências vinculadas aos testes aplicados.</span>
        <button className="primary-btn" style={{marginLeft:'auto'}}><I.plus /> Nova hipótese</button>
      </div>
      {hyps.map(h => (
        <div className={"hyp-card " + h.status} key={h.id}>
          <div className="title-row">
            <strong>{h.titulo}</strong>
            <span className={"pill " + (h.status === 'confirmada' ? 'ok' : h.status === 'descartada' ? '' : 'warn')}>{statusLabel[h.status]}</span>
            <div className="weight" title="Peso clínico">
              {[0,1,2,3].map(i => <span key={i} className={"w" + (i < h.peso ? " on" : "")} />)}
            </div>
          </div>
          <div style={{color:'var(--text-2)', fontSize:13, lineHeight:1.5}}>
            {h.status === 'confirmada' && 'Confirmada pelos achados nos testes e entrevista clínica.'}
            {h.status === 'em-investigacao' && 'Hipótese ativa — aguardando conclusão dos testes para fechamento.'}
            {h.status === 'descartada' && 'Descartada após análise dos resultados.'}
          </div>
          <div className="evidencias">
            <span style={{fontSize:11, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:600, alignSelf:'center', marginRight:4}}>Evidências:</span>
            {h.evidencias.length ? h.evidencias.map((e, i) => <span className="tag" key={i}>{e}</span>) : <span className="tag none">nenhuma vinculada ainda</span>}
          </div>
        </div>
      ))}
      {hyps.length === 0 && <div className="empty"><I.target /> Nenhuma hipótese cadastrada ainda.</div>}
    </div>
  );
}

// ---- Relatório escolar ----------------------------------------------
function TabEscolar({ pac }) {
  const r = pac.relatorioEscolar || {};
  if (!r.recebido) {
    return (
      <div className="card" style={{textAlign:'center', padding: 40}}>
        <I.school style={{width:32, height:32, color:'var(--text-3)', margin:'0 auto'}} />
        <h3 style={{marginTop:12}}>Relatório escolar não recebido</h3>
        <div className="sub" style={{marginTop:4}}>{r.resumo || 'Ainda não foi solicitado.'}</div>
        <button className="primary-btn" style={{marginTop:14}}><I.mail /> Solicitar à escola</button>
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
        {r.resumo || `A coordenação de ${pac.escola} enviou relatório detalhado apontando os principais pontos de atenção pedagógica observados em sala. Foram destacadas oscilações no desempenho em atividades de leitura e interpretação, além de dificuldade em sustentar a atenção durante tarefas mais longas. A equipe escolar sinaliza disponibilidade para colaborar com adaptações após o laudo.`}
      </p>
      <div style={{marginTop:14, display:'flex', gap:8}}>
        <button className="ghost-btn"><I.file /> Abrir PDF original</button>
        <button className="ghost-btn"><I.edit /> Adicionar anotação</button>
      </div>
    </div>
  );
}

// ---- Bateria de testes ----------------------------------------------
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

  if (testes.length === 0) {
    return (
      <div className="card" style={{textAlign:'center', padding: 40}}>
        <I.flask style={{width:32, height:32, color:'var(--text-3)', margin:'0 auto'}} />
        <h3 style={{marginTop:12}}>Bateria ainda não montada</h3>
        <div className="sub" style={{marginTop:4}}>Selecione testes do catálogo após concluir anamnese e hipóteses.</div>
        <button className="primary-btn" style={{marginTop:14}}><I.plus /> Montar bateria</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{display:'flex', gap:14, alignItems:'center', marginBottom:14}}>
        <strong style={{fontSize: 14}}>{done} de {testes.length} aplicados</strong>
        <div style={{flex:1, maxWidth: 240}}><Progress value={(done/testes.length)*100} /></div>
        <button className="ghost-btn" style={{marginLeft:'auto'}}><I.plus /> Adicionar teste</button>
      </div>

      {cats.map(cat => (
        <div className="battery-group" key={cat}>
          <h4>{cat} <span className="cnt">· {byCat[cat].filter(t=>t.status==='aplicado').length}/{byCat[cat].length}</span></h4>
          {byCat[cat].map(t => {
            const overdue = isTestOverdue(t, TODAY);
            return (
              <div className={"test-row " + t.status} key={t.id}>
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
                <button className="small">{t.status === 'aplicado' ? 'Ver' : 'Registrar'}</button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ---- Laudo -----------------------------------------------------------
function TabLaudo({ pac }) {
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
          <button className={ready ? 'primary-btn' : 'ghost-btn'} disabled={!ready} style={{width:'100%', justifyContent:'center'}}>
            <I.doc /> {ready ? 'Gerar PDF do laudo' : 'Aguardando testes'}
          </button>
          <button className="ghost-btn" style={{width:'100%', justifyContent:'center', marginTop:8}}>
            <I.cal /> Agendar devolutiva
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PatientDetail, TabAnamnese, TabHipoteses, TabEscolar, TabBateria, TabLaudo });
