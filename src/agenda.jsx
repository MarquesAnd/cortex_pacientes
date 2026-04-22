// ============================================================
// CORTEX — Agenda (week calendar view)
// ============================================================

function AgendaView({ onOpenPatient }) {
  const { CALENDAR, PATIENTS, TODAY } = window.CORTEX_DATA;

  // Week starting on Monday that contains TODAY.
  const base = new Date(TODAY + "T00:00:00");
  const dow = (base.getDay() + 6) % 7; // 0=Mon
  const monday = new Date(base); monday.setDate(base.getDate() - dow);
  const days = Array.from({length: 7}, (_, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i);
    const iso = d.toISOString().slice(0,10);
    const wk = ['SEG','TER','QUA','QUI','SEX','SÁB','DOM'][i];
    return { iso, wk, num: d.getDate(), isToday: iso === TODAY };
  });

  const hours = Array.from({length: 12}, (_, i) => 8 + i); // 8h - 19h
  const hourHeight = 56;

  function eventStyle(e) {
    const [hh, mm] = e.hora.split(':').map(Number);
    const top = (hh - 8) * hourHeight + (mm/60) * hourHeight;
    const height = Math.max(30, (e.duracao / 60) * hourHeight - 3);
    return { top, height };
  }

  // now-line (approx 14:30)
  const nowTop = (14 - 8) * hourHeight + 0.5 * hourHeight;
  const todayColIdx = days.findIndex(d => d.isToday);

  return (
    <div>
      <div className="section-head">
        <h2>Agenda</h2>
        <span className="sub">semana de {fmtDateLong(days[0].iso)}{' — '}{fmtDateLong(days[6].iso)}</span>
        <div className="right">
          <div className="seg" style={{marginRight:8}}>
            <button className="active">Semana</button>
            <button>Mês</button>
            <button>Dia</button>
          </div>
          <button className="ghost-btn"><I.chevL /></button>
          <button className="ghost-btn">Hoje</button>
          <button className="ghost-btn"><I.chevR /></button>
          <button className="primary-btn"><I.plus /> Sessão</button>
        </div>
      </div>

      <div className="cal-wrap">
        <div className="cal-head">
          <div></div>
          {days.map(d => (
            <div key={d.iso} className={"daycol" + (d.isToday ? " today" : "")}>
              <div style={{fontSize:11}}>{d.wk}</div>
              <div className="num">{String(d.num).padStart(2,'0')}</div>
            </div>
          ))}
        </div>
        <div className="cal-grid">
          <div className="hour-col">
            {hours.map(h => <div className="hour-cell" key={h}>{String(h).padStart(2,'0')}:00</div>)}
          </div>
          {days.map((d, di) => {
            const events = CALENDAR.filter(e => e.data === d.iso);
            return (
              <div className="day-col" key={d.iso} style={{position:'relative'}}>
                {hours.map(h => <div className="hour-slot" key={h} />)}
                {d.isToday && <div className="now-line" style={{top: nowTop}} />}
                {events.map((e, i) => {
                  const pac = PATIENTS.find(p => p.id === e.pacId);
                  return (
                    <div
                      key={i}
                      className={"cal-event " + (e.tipo || '').toLowerCase().replace('ç','c').replace('ã','a')}
                      style={eventStyle(e)}
                      onClick={() => onOpenPatient(e.pacId)}
                      title={`${e.titulo} — ${pac ? pac.nome : ''}`}
                    >
                      <b>{e.hora} {e.titulo}</b>
                      <div style={{opacity:0.85, marginTop:2}}>{pac ? pac.nome.split(' ').slice(0,2).join(' ') : ''}</div>
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
