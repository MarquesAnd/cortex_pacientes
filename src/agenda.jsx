// ============================================================
// CORTEX — Agenda (week/day calendar view)
// ============================================================

function AgendaView({ onOpenPatient, onNewSessao }) {
  const { CALENDAR, PATIENTS, TODAY } = window.CORTEX_DATA;

  const [viewMode, setViewMode] = React.useState('semana'); // semana | dia
  const [offsetWeeks, setOffsetWeeks] = React.useState(0);
  const [offsetDays, setOffsetDays] = React.useState(0);

  const hourHeight = 56;
  const hours = Array.from({length: 13}, (_, i) => 7 + i); // 7h–19h

  // Calcular semana atual com offset
  const baseDate = new Date(TODAY + 'T00:00:00');
  const dow = (baseDate.getDay() + 6) % 7; // 0=Mon
  const mondayBase = new Date(baseDate);
  mondayBase.setDate(baseDate.getDate() - dow + offsetWeeks * 7);

  const weekDays = Array.from({length: 7}, (_, i) => {
    const d = new Date(mondayBase);
    d.setDate(mondayBase.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    return { iso, wk: ['SEG','TER','QUA','QUI','SEX','SÁB','DOM'][i], num: d.getDate(), isToday: iso === TODAY };
  });

  // Dia único (modo Dia)
  const singleDay = (() => {
    const d = new Date(TODAY + 'T00:00:00');
    d.setDate(d.getDate() + offsetDays);
    const iso = d.toISOString().slice(0, 10);
    return { iso, isToday: iso === TODAY, num: d.getDate(), wk: ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'][d.getDay()] };
  })();

  const goBack  = () => viewMode === 'semana' ? setOffsetWeeks(o => o - 1) : setOffsetDays(o => o - 1);
  const goNext  = () => viewMode === 'semana' ? setOffsetWeeks(o => o + 1) : setOffsetDays(o => o + 1);
  const goToday = () => { setOffsetWeeks(0); setOffsetDays(0); };

  function eventStyle(e) {
    const [hh, mm] = (e.hora || '08:00').split(':').map(Number);
    const top    = (hh - 7) * hourHeight + (mm / 60) * hourHeight;
    const height = Math.max(28, ((e.duracao || 60) / 60) * hourHeight - 3);
    return { top, height };
  }

  // Linha de "agora"
  const now = new Date();
  const nowTop = (now.getHours() - 7) * hourHeight + (now.getMinutes() / 60) * hourHeight;

  const displayDays = viewMode === 'semana' ? weekDays : [singleDay];

  // Label do período
  const periodLabel = viewMode === 'semana'
    ? `semana de ${fmtDateLong(weekDays[0].iso)} — ${fmtDateLong(weekDays[6].iso)}`
    : `${singleDay.wk}, ${fmtDateLong(singleDay.iso)}`;

  return (
    <div>
      <div className="section-head">
        <h2>Agenda</h2>
        <span className="sub">{periodLabel}</span>
        <div className="right">
          <div className="seg" style={{marginRight:8}}>
            <button className={viewMode==='semana'?'active':''} onClick={() => setViewMode('semana')}>Semana</button>
            <button className={viewMode==='dia'?'active':''} onClick={() => setViewMode('dia')}>Dia</button>
          </div>
          <button className="ghost-btn" onClick={goBack}><I.chevL /></button>
          <button className="ghost-btn" onClick={goToday}
            style={{fontWeight: offsetWeeks===0 && offsetDays===0 ? 600 : 400}}>Hoje</button>
          <button className="ghost-btn" onClick={goNext}><I.chevR /></button>
          <button className="primary-btn" onClick={() => onNewSessao?.()}><I.plus /> Sessão</button>
        </div>
      </div>

      <div className="cal-wrap">
        {/* Cabeçalho com dias */}
        <div className="cal-head">
          <div></div>
          {displayDays.map(d => (
            <div key={d.iso} className={"daycol" + (d.isToday ? " today" : "")}
              onClick={() => { setViewMode('dia'); const diff = Math.round((new Date(d.iso) - new Date(TODAY)) / 86400000); setOffsetDays(diff); }}
              style={{cursor:'pointer'}}>
              <div style={{fontSize:11}}>{d.wk}</div>
              <div className="num">{String(d.num).padStart(2,'0')}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="cal-grid">
          <div className="hour-col">
            {hours.map(h => (
              <div className="hour-cell" key={h}>{String(h).padStart(2,'0')}:00</div>
            ))}
          </div>

          {displayDays.map((d) => {
            const events = CALENDAR.filter(e => e.data === d.iso);
            return (
              <div className="day-col" key={d.iso} style={{position:'relative'}}>
                {hours.map(h => (
                  <div className="hour-slot" key={h}
                    onClick={() => {
                      // Clicar num slot vazio abre modal de nova sessão
                      onNewSessao?.();
                    }}
                    style={{cursor:'pointer'}} />
                ))}
                {d.isToday && <div className="now-line" style={{top: nowTop}} />}
                {events.map((e, i) => {
                  const pac = PATIENTS.find(p => p.id === e.pacId);
                  return (
                    <div
                      key={i}
                      className={"cal-event " + (e.tipo || '').toLowerCase()
                        .replace(/ç/g,'c').replace(/ã/g,'a').replace(/ê/g,'e').replace(/é/g,'e').replace(/â/g,'a')}
                      style={eventStyle(e)}
                      onClick={(ev) => { ev.stopPropagation(); onOpenPatient(e.pacId); }}
                      title={`${e.titulo}${pac ? ' — ' + pac.nome : ''}`}
                    >
                      <b>{e.hora} {e.titulo}</b>
                      {pac && <div style={{opacity:0.85, marginTop:2, fontSize:11}}>{pac.nome.split(' ').slice(0,2).join(' ')}</div>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AgendaView });
