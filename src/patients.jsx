// ============================================================
// CORTEX — Pacientes views (List + Kanban)
// ============================================================

function PatientsView({ view, onOpenPatient, showOnlyActive, viewToggle, onNewPaciente }) {
  const { PATIENTS, STAGES } = window.CORTEX_DATA;
  const [q, setQ] = React.useState('');
  const [stageFilter, setStageFilter] = React.useState('all');

  let list = PATIENTS;
  if (showOnlyActive) list = list.filter(p => p.ativo);
  if (stageFilter !== 'all') list = list.filter(p => p.estagio === stageFilter);
  if (q.trim()) {
    const ql = q.toLowerCase();
    list = list.filter(p => p.nome.toLowerCase().includes(ql) || (p.queixa||'').toLowerCase().includes(ql));
  }

  return (
    <div>
      <div className="section-head">
        <h2>Pacientes</h2>
        <span className="sub">{list.length} de {PATIENTS.length} pacientes</span>
        <div className="right">
          {viewToggle}
          <button className="ghost-btn"><I.filter /> Filtros</button>
          <button className="primary-btn" onClick={onNewPaciente}><I.plus /> Novo paciente</button>
        </div>
      </div>

      <div className="list-toolbar">
        <div className="topbar search" style={{background:'var(--surface)', margin:0, width: 320}}>
          <I.search style={{width:14, height:14, color:'var(--text-3)'}} />
          <input placeholder="Buscar por nome ou queixa..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <button className={"chip-filter" + (stageFilter === 'all' ? " active" : "")} onClick={() => setStageFilter('all')}>
          Todas etapas
        </button>
        {STAGES.map(s => (
          <button key={s.id} className={"chip-filter" + (stageFilter === s.id ? " active" : "")} onClick={() => setStageFilter(s.id)}>
            {s.label}
          </button>
        ))}
      </div>

      {view === 'list' && <ListTable patients={list} onOpenPatient={onOpenPatient} />}
      {view === 'kanban' && <KanbanBoard patients={list} onOpenPatient={onOpenPatient} />}
    </div>
  );
}

function ListTable({ patients, onOpenPatient }) {
  const { TODAY } = window.CORTEX_DATA;
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Paciente</th>
          <th>Queixa principal</th>
          <th>Etapa</th>
          <th>Progresso</th>
          <th>Previsão laudo</th>
          <th>Convênio</th>
        </tr>
      </thead>
      <tbody>
        {patients.map(p => (
          <tr key={p.id} onClick={() => onOpenPatient(p.id)}>
            <td>
              <div className="pname">
                <PAvatar paciente={p} size="sm" />
                <div>
                  <b>{p.nome}</b>
                  <span>{p.tipo}, {p.idade} anos · {p.escolaridade}</span>
                </div>
              </div>
            </td>
            <td style={{maxWidth: 340, color:'var(--text-2)', fontSize: 13}}>
              <div style={{overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical'}}>
                {p.queixa}
              </div>
            </td>
            <td><StagePill stage={p.estagio} /></td>
            <td>
              <div className="mini-progress">
                <Progress value={p.progresso} thin />
                <span style={{fontSize:12, color:'var(--text-3)', fontFamily:'var(--font-mono)'}}>{p.progresso}%</span>
              </div>
            </td>
            <td style={{fontFamily:'var(--font-mono)', fontSize:12.5, color: p.previsaoLaudo < TODAY && p.estagio !== 'devolutiva' ? 'var(--danger)' : 'var(--text-2)'}}>
              {fmtDateBR(p.previsaoLaudo)}
            </td>
            <td><span className="pill">{p.convenio}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function KanbanBoard({ patients, onOpenPatient }) {
  const { STAGES } = window.CORTEX_DATA;
  return (
    <div className="kanban-scroll">
      <div className="kanban">
        {STAGES.map(s => {
          const inStage = patients.filter(p => p.estagio === s.id);
          return (
            <div className="kcol" key={s.id}>
              <div className="kcol-head">
                <div className="dot" style={{background: `var(--${s.color === 'teal' ? 'accent' : s.color+'-500'}, var(--accent))`}} />
                <div className="lbl">{s.label}</div>
                <div className="cnt">{inStage.length}</div>
              </div>
              {inStage.map(p => (
                <div className="kcard" key={p.id} onClick={() => onOpenPatient(p.id)}>
                  <div className="name">
                    <PAvatar paciente={p} size="sm" />
                    <div style={{overflow:'hidden'}}>
                      <div style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{p.nome}</div>
                      <div className="age">{p.tipo}, {p.idade}a · {p.escolaridade}</div>
                    </div>
                  </div>
                  <div className="queixa">{p.queixa}</div>
                  <Progress value={p.progresso} thin />
                  <div className="footer">
                    {(p.hipoteses || [])[0] && (
                      <span className="pill" style={{fontSize: 10.5}}>{p.hipoteses[0].titulo.slice(0, 22)}{p.hipoteses[0].titulo.length > 22 ? '…' : ''}</span>
                    )}
                    <span className="dias">{p.diasNaEtapa}d</span>
                  </div>
                </div>
              ))}
              {inStage.length === 0 && (
                <div style={{color:'var(--text-3)', fontSize:12, textAlign:'center', padding: 20}}>
                  Vazio
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { PatientsView, ListTable, KanbanBoard });
