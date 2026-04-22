// ============================================================
// CORTEX — Dashboard view
// ============================================================

function Dashboard({ onOpenPatient, onGoTo }) {
  const { PATIENTS, CALENDAR, TODAY, STAGES } = window.CORTEX_DATA;
  const today = TODAY;

  // KPIs
  const activePatients = PATIENTS.filter(p => p.ativo);
  const testsPending = PATIENTS.reduce((sum, p) => sum + (p.testes || []).filter(t => t.status !== 'aplicado').length, 0);
  const overdueReports = PATIENTS.filter(p => p.previsaoLaudo < today && p.estagio !== 'devolutiva').length;
  const todaysSessions = CALENDAR.filter(e => e.data === today);
  const sessionsThisWeek = CALENDAR.filter(e => e.data >= today && daysBetween(today, e.data) < 7).length;

  // Funnel count by stage
  const funnelByStage = STAGES.map(s => ({
    ...s, count: activePatients.filter(p => p.estagio === s.id).length,
  }));

  // Atenção: testes pendentes de correção (status aplicado mas estagio é correcao or before), laudos em atraso
  const attnItems = [];
  PATIENTS.forEach(p => {
    if (p.previsaoLaudo < today && p.estagio !== 'devolutiva') {
      attnItems.push({ pac: p, why: `laudo ${daysBetween(p.previsaoLaudo, today)}d atrasado`, type: 'laudo' });
    }
    if (p.estagio === 'correcao' && p.diasNaEtapa >= 7) {
      attnItems.push({ pac: p, why: `${p.diasNaEtapa}d em correção`, type: 'correcao' });
    }
    (p.testes || []).forEach(t => {
      if (isTestOverdue(t, today)) {
        const info = findTest(t.id);
        attnItems.push({ pac: p, why: `${info.name} vencido ${daysBetween(t.prevista, today)}d`, type: 'teste' });
      }
    });
  });
  const attn = attnItems.slice(0, 6);

  // Alertas — combinados
  const alerts = [];
  attnItems.filter(a => a.type === 'laudo').slice(0, 2).forEach(a => alerts.push({ critical: true, title: `Laudo em atraso — ${a.pac.nome.split(' ')[0]}`, sub: `Previsão era ${fmtDateBR(a.pac.previsaoLaudo)}.` }));
  const correcaoPendente = attnItems.filter(a => a.type === 'correcao').length;
  if (correcaoPendente) alerts.push({ critical: false, title: `${correcaoPendente} teste(s) aguardando correção`, sub: `Há mais de 7 dias parados.` });
  alerts.push({ critical: false, title: `Relatório escolar pendente`, sub: `Joaquim Pessanha — solicitado 12/04.` });

  return (
    <div>
      {/* KPI Row */}
      <div className="kpi-row">
        <div className="kpi">
          <div className="ico"><I.users /></div>
          <div className="label">Pacientes ativos</div>
          <div className="value">{activePatients.length}</div>
          <div className="delta up"><I.trend style={{width:12, height:12}} /> +2 este mês</div>
        </div>
        <div className="kpi">
          <div className="ico"><I.clock /></div>
          <div className="label">Sessões esta semana</div>
          <div className="value">{sessionsThisWeek}</div>
          <div className="delta">{todaysSessions.length} hoje</div>
        </div>
        <div className="kpi">
          <div className="ico"><I.flask /></div>
          <div className="label">Testes pendentes</div>
          <div className="value">{testsPending}</div>
          <div className="delta">em {new Set(PATIENTS.filter(p => (p.testes||[]).some(t=>t.status!=='aplicado')).map(p=>p.id)).size} pacientes</div>
        </div>
        <div className="kpi">
          <div className="ico"><I.alert /></div>
          <div className="label">Laudos em atraso</div>
          <div className="value" style={{ color: overdueReports > 0 ? 'var(--danger)' : 'inherit' }}>{overdueReports}</div>
          <div className="delta down">requer atenção</div>
        </div>
      </div>

      {/* Main grid */}
      <div className="dash-grid">
        {/* Agenda de hoje */}
        <div className="card">
          <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:14}}>
            <h3>Agenda de hoje</h3>
            <span className="sub" style={{marginLeft:4}}>• {fmtDateLong(today)} — Quarta-feira</span>
            <button className="ghost-btn" style={{marginLeft:'auto'}} onClick={() => onGoTo('agenda')}>
              Ver semana <I.arr />
            </button>
          </div>
          <div className="today-schedule">
            {todaysSessions.length === 0 ? (
              <div className="empty"><I.cal /> Sem sessões agendadas hoje</div>
            ) : todaysSessions.map((s, i) => {
              const pac = PATIENTS.find(p => p.id === s.pacId);
              return (
                <div className="row" key={i} onClick={() => onOpenPatient(pac.id)}>
                  <div className="time-chip"><b>{s.hora}</b>{s.duracao}min</div>
                  <PAvatar paciente={pac} size="sm" />
                  <div>
                    <div className="title">{s.titulo}</div>
                    <div className="sub">{pac.nome} · {ptTipo(pac.tipo)}, {pac.idade}a</div>
                  </div>
                  <span className={`pill ${evtColor(s.tipo)}`}>{s.tipo}</span>
                </div>
              );
            })}
          </div>

          {/* Funnel */}
          <div style={{marginTop:22, paddingTop:16, borderTop:'1px dashed var(--border)'}}>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:4}}>
              <h3 style={{margin:0}}>Pacientes por etapa</h3>
              <span className="sub" style={{marginLeft:4}}>fluxo completo da avaliação</span>
            </div>
            <div className="funnel">
              {funnelByStage.map(s => (
                <div className="stage" key={s.id} onClick={() => onGoTo('pacientes')} style={{cursor:'pointer'}}>
                  <div className="lbl">{s.label}</div>
                  <div className="cnt">{s.count}</div>
                  <div className="bar" style={{ width: `${Math.min(100, s.count * 20)}%`, background: `var(--${s.color === 'teal' ? 'accent' : s.color+'-500'}, var(--accent))` }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right stack */}
        <div style={{display:'flex', flexDirection:'column', gap:18}}>
          {/* Precisa de atenção */}
          <div className="card">
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:10}}>
              <h3>Precisa de ação</h3>
              <span className="pill danger" style={{marginLeft:'auto'}}>{attn.length}</span>
            </div>
            <div className="attn-list">
              {attn.map((a, i) => (
                <div className="row" key={i} onClick={() => onOpenPatient(a.pac.id)}>
                  <PAvatar paciente={a.pac} size="sm" />
                  <div>
                    <div className="title">{a.pac.nome}</div>
                    <div className="sub">{stageLabel(a.pac.estagio)} · {a.pac.diasNaEtapa}d na etapa</div>
                  </div>
                  <div className="why">{a.why}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Alertas */}
          <div className="card">
            <h3 style={{marginBottom:10}}>Alertas</h3>
            {alerts.map((a, i) => (
              <div key={i} className={"alert-row" + (a.critical ? " critical" : "")}>
                <div className="dot" />
                <div>
                  <div className="title">{a.title}</div>
                  <div className="sub">{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function evtColor(tipo) {
  return ({
    'Aplicação': 'amber',
    'Correção': 'orange',
    'Devolutiva': 'emerald',
    'Laudo': 'rose',
    'Anamnese': 'violet',
    'Planejamento': 'sky',
  })[tipo] || 'teal';
}

Object.assign(window, { Dashboard, evtColor });
