// ============================================================
// CORTEX — Shared UI primitives + icons (Babel/JSX)
// ============================================================

// ---- Icons (feather-style, stroke only) ------------------------------
const I = {
  dash:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.4"/><rect x="14" y="3" width="7" height="5" rx="1.4"/><rect x="14" y="12" width="7" height="9" rx="1.4"/><rect x="3" y="16" width="7" height="5" rx="1.4"/></svg>,
  users:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  cal:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  flask:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6"/><path d="M10 3v7L5 20a2 2 0 0 0 1.7 3h10.6A2 2 0 0 0 19 20l-5-10V3"/><line x1="8" y1="15" x2="16" y2="15"/></svg>,
  file:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>,
  check:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  plus:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  filter: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  bell:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  clock:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  alert:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  chevR:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  chevL:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  arr:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  list:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>,
  board:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="4" height="8" rx="1"/></svg>,
  sun:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
  moon:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  sliders:(p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
  brain:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.142 4 4 0 0 0-2.526 5.77A4 4 0 0 0 6 18a3 3 0 0 0 6 0V5z"/><path d="M12 5a3 3 0 1 1 5.997.142 4 4 0 0 1 2.526 5.77A4 4 0 0 1 18 18a3 3 0 0 1-6 0V5z"/></svg>,
  target: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  doc:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  phone:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  mail:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  edit:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  more:   (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  close:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  trend:  (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  pin:    (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  school: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
};

// ---- Helpers ---------------------------------------------------------
const initials = (name) => name.split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase();
const ptTipo = (tipo) => tipo;
const fmtDateBR = (iso) => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y.slice(2)}`;
};
const fmtDateLong = (iso) => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${d} ${months[+m-1]} ${y}`;
};
const daysBetween = (a, b) => {
  const d1 = new Date(a), d2 = new Date(b);
  return Math.round((d2 - d1) / 86400000);
};
const stageIndex = (sid) => window.CORTEX_DATA.STAGES.findIndex(s => s.id === sid);
const stageColor = (sid) => (window.CORTEX_DATA.STAGES.find(s => s.id === sid) || {}).color || 'teal';
const stageLabel = (sid) => (window.CORTEX_DATA.STAGES.find(s => s.id === sid) || {}).label || sid;
const findTest = (id) => {
  for (const cat of Object.keys(window.CORTEX_DATA.TEST_CATALOG)) {
    const t = window.CORTEX_DATA.TEST_CATALOG[cat].find(x => x.id === id);
    if (t) return { ...t, cat };
  }
  return { id, name: id, cat: 'Outros', duration: 30 };
};
const isTestOverdue = (t, today) => t.status !== 'aplicado' && t.prevista && t.prevista < today;

// ---- Avatar ----------------------------------------------------------
// Generate a consistent photo-style avatar URL per patient (DiceBear notionists for people-like illustrations).
function avatarUrl(paciente) {
  const seed = encodeURIComponent(paciente.id + '-' + paciente.nome);
  // Pick a style appropriate to tipo
  const style = paciente.tipo === 'Criança' ? 'big-smile'
              : paciente.tipo === 'Adolescente' ? 'avataaars'
              : paciente.tipo === 'Idoso' ? 'personas'
              : 'notionists';
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&radius=50&backgroundType=gradientLinear`;
}

function PAvatar({ paciente, size = '', showPhoto = true }) {
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  // Usar foto real se existir, senão DiceBear
  const src = paciente.avatar_url || avatarUrl(paciente);
  return (
    <div className={`pavatar ${size} ${paciente.corAvatar || 'violet'}`}>
      <div className="initials-bg">{initials(paciente.nome)}</div>
      {showPhoto && !failed && (
        <img
          src={src}
          alt={paciente.nome}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s',
            width:'100%', height:'100%', objectFit:'cover', borderRadius:'inherit' }}
          loading="lazy"
        />
      )}
    </div>
  );
}

// ---- Progress bar ----------------------------------------------------
function Progress({ value, thin }) {
  return (
    <div className={"progress" + (thin ? " thin" : "")}>
      <span style={{ width: `${value}%` }} />
    </div>
  );
}

// ---- Stage pill ------------------------------------------------------
function StagePill({ stage }) {
  const s = window.CORTEX_DATA.STAGES.find(x => x.id === stage);
  if (!s) return null;
  return <span className={`pill dot ${s.color}`}>{s.label}</span>;
}

// Expose to window for other modules
// Helper: converte File/Blob para base64 redimensionado
async function fileToBase64(file, maxPx = 400) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxPx / img.width, maxPx / img.height, 1);
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Componente de upload de foto reutilizável
function FotoUpload({ src, onFile, size = 80, shape = 'round', label = 'Trocar foto' }) {
  const inputRef = React.useRef();
  const borderR = shape === 'round' ? '50%' : 12;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
      <div style={{ position:'relative', width:size, height:size, cursor:'pointer' }}
           onClick={() => inputRef.current?.click()}>
        <div style={{
          width:size, height:size, borderRadius:borderR,
          background:'var(--surface-2)', border:'2px solid var(--border)',
          overflow:'hidden', display:'grid', placeItems:'center',
        }}>
          {src
            ? <img src={src} alt="foto" style={{width:'100%',height:'100%',objectFit:'cover'}} />
            : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
          }
        </div>
        {/* Overlay câmera */}
        <div style={{
          position:'absolute', bottom:0, right:0,
          width: Math.round(size * 0.35), height: Math.round(size * 0.35),
          borderRadius:'50%', background:'var(--teal-500)',
          display:'grid', placeItems:'center',
          border:'2px solid var(--surface)',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white"
              strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
      </div>
      <span style={{fontSize:11, color:'var(--text-3)', cursor:'pointer'}}
            onClick={() => inputRef.current?.click()}>{label}</span>
      <input ref={inputRef} type="file" accept="image/*" style={{display:'none'}}
             onChange={async (e) => {
               const file = e.target.files?.[0];
               if (!file) return;
               try { onFile(await fileToBase64(file)); }
               catch(err) { console.error('foto upload:', err); }
               e.target.value = '';
             }} />
    </div>
  );
}

Object.assign(window, {
  I, PAvatar, Progress, StagePill, avatarUrl, FotoUpload, fileToBase64,
  initials, fmtDateBR, fmtDateLong, daysBetween,
  stageIndex, stageColor, stageLabel, findTest, isTestOverdue,
});
