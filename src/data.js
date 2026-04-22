// ============================================================
// CORTEX — Catálogo de instrumentos Equilibrium Neuropsicologia
// Extraído dos Check Lists oficiais (Adulto, Escolar, Pré-Escolar)
// ============================================================

const TEST_CATALOG = {

  // ─── ADULTO ────────────────────────────────────────────────

  "Inteligência / Raciocínio": [
    { id: "wais3",   name: "WAIS-III",                  faixa: "16 – 89 anos",   avalia: "Inteligência Global (QI)",          populacao: ["Adulto","Idoso"] },
    { id: "beta3",   name: "BETA-III",                  faixa: "14 – 88 anos",   avalia: "Inteligência Não-Verbal",            populacao: ["Adulto","Idoso"] },
    { id: "wisc4",   name: "WISC-IV",                   faixa: "6a – 16a 11m",   avalia: "Inteligência Global (QI)",           populacao: ["Criança","Adolescente"] },
    { id: "son640",  name: "SON-R 6-40",                faixa: "6 – 40 anos",    avalia: "Inteligência Não-Verbal",            populacao: ["Criança","Adolescente","Adulto"] },
    { id: "cpmraven",name: "CPM-Raven",                 faixa: "5 – 11 anos",    avalia: "Inteligência Não-Verbal",            populacao: ["Criança"] },
    { id: "columbia",name: "Escala Columbia",           faixa: "Até 9a 11m",     avalia: "Maturidade Mental",                  populacao: ["Criança"] },
    { id: "tiahs",   name: "TIAH/S",                    faixa: "9 – 15 anos",    avalia: "Inteligência e Habilidades Sociais", populacao: ["Criança","Adolescente"] },
    { id: "wmt2",    name: "WMT-2 (Matrizes de Viena)", faixa: "7 – 80+",        avalia: "Inteligência Geral",                 populacao: ["Criança","Adolescente","Adulto","Idoso"] },
    { id: "son2_7",  name: "SON-R 2½-7",               faixa: "2a 6m – 7 anos", avalia: "Inteligência Não-Verbal",            populacao: ["Criança"] },
    { id: "binaut",  name: "Escala Binaut",             faixa: "3 – 7 anos",     avalia: "Maturidade Mental",                  populacao: ["Criança"] },
  ],

  "Atenção / Memória": [
    { id: "bpa2",    name: "BPA-2",       faixa: "6 – 94 anos",  avalia: "Atenção Geral",              populacao: ["Criança","Adolescente","Adulto","Idoso"] },
    { id: "d2r",     name: "Teste D2-R",  faixa: "9 – 60 anos",  avalia: "Atenção Concentrada",        populacao: ["Criança","Adolescente","Adulto"] },
    { id: "teaco",   name: "(TEACO/TEADI/TEALT)", faixa: "18 – 72 anos", avalia: "Atenção Conc., Dividida e Alternada", populacao: ["Adulto","Idoso"] },
    { id: "tavis4",  name: "TAVIS-4",     faixa: "6a – 17a 11m", avalia: "Atenção Visual",             populacao: ["Criança","Adolescente"] },
    { id: "tepicm2", name: "TEPIC-M-2",   faixa: "15 – 92 anos", avalia: "Memória Visual",             populacao: ["Adolescente","Adulto","Idoso"] },
    { id: "ravlt",   name: "RAVLT",       faixa: "6 – 92 anos",  avalia: "Memória Auditivo-Verbal",    populacao: ["Criança","Adolescente","Adulto","Idoso"] },
  ],

  "Funções Executivas": [
    { id: "bdefs",   name: "BDEFS",              faixa: "18 – 70 anos",  avalia: "Déficits na Função Executiva",           populacao: ["Adulto"] },
    { id: "fdt",     name: "FDT (Cinco Dígitos)", faixa: "6 – 90 anos",  avalia: "Flexibilidade Cognitiva",                populacao: ["Criança","Adolescente","Adulto","Idoso"] },
    { id: "torres",  name: "Torre de Londres",   faixa: "10 – 59 anos",  avalia: "Planejamento e Resolução de Problemas",  populacao: ["Criança","Adolescente","Adulto"] },
  ],

  "Linguagem / Leitura / Escrita / Matemática": [
    { id: "tisd",       name: "TISD",                  faixa: "6–11 anos (1º–5º)", avalia: "Sinais de Dislexia",                    populacao: ["Criança"] },
    { id: "anele1",     name: "ANELE Vol. 1 (PCFO)",   faixa: "3 – 9 anos",        avalia: "Consciência Fonológica",                populacao: ["Criança"] },
    { id: "anele2",     name: "ANELE Vol. 2 (T-NAR)",  faixa: "6 – 14 anos",       avalia: "Nomeação Automática Rápida",            populacao: ["Criança","Adolescente"] },
    { id: "anele3",     name: "ANELE Vol. 3 (TEPPE)",  faixa: "1º ao 9º ano",      avalia: "Escrita de Palavras/Pseudopalavras",    populacao: ["Criança","Adolescente"] },
    { id: "anele4",     name: "ANELE Vol. 4 (TLPP)",   faixa: "6 – 85 anos",       avalia: "Leitura de Palavras/Pseudopalavras",    populacao: ["Criança","Adolescente","Adulto","Idoso"] },
    { id: "prolec",     name: "PROLEC (Kit Fund.)",    faixa: "2º ao 5º ano",       avalia: "Processos de Leitura",                  populacao: ["Criança"] },
    { id: "prolecser",  name: "PROLEC-SE-R",           faixa: "6º ano ao Médio",    avalia: "Processos de Leitura",                  populacao: ["Adolescente"] },
    { id: "tde2",       name: "TDE-II",                faixa: "1º ao 9º ano",       avalia: "Desempenho Escolar (L/E/M)",            populacao: ["Criança","Adolescente"] },
    { id: "pronumero",  name: "PRONUMERO",             faixa: "2º ao 5º ano",       avalia: "Processamento Numérico",                populacao: ["Criança"] },
  ],

  "TEA / Autismo": [
    { id: "srs2a",      name: "SRS-2 (Adulto)",       faixa: "19+ anos",        avalia: "Responsividade Social",              populacao: ["Adulto","Idoso"] },
    { id: "srs2e",      name: "SRS-2 (Idade Escolar)", faixa: "5 – 18 anos",   avalia: "Responsividade Social",              populacao: ["Criança","Adolescente"] },
    { id: "srs2pe",     name: "SRS-2 (Pré-Escolar)",  faixa: "2a 5m – 4a 5m", avalia: "Responsividade e Habilidade Social", populacao: ["Criança"] },
    { id: "catq",       name: "CAT-Q",                faixa: "16+ anos",        avalia: "Camuflagem de Traços Autísticos",    populacao: ["Adolescente","Adulto"] },
    { id: "raads",      name: "RAADS-R-BR SCREEN",    faixa: "16+ anos",        avalia: "Rastreio de Autismo",                populacao: ["Adolescente","Adulto"] },
    { id: "qa16",       name: "QA16+",                faixa: "16+ anos",        avalia: "Rastreio de Autismo",                populacao: ["Adolescente","Adulto"] },
    { id: "cambridge",  name: "Esc. de Cambridge",    faixa: "Adultos",         avalia: "Empatia vs. Sistematização",         populacao: ["Adulto","Idoso"] },
    { id: "psens2",     name: "Perfil Sensorial 2",   faixa: "Adolesc./Adulto", avalia: "Processamento Sensorial",            populacao: ["Adolescente","Adulto"] },
    { id: "ados2m4",    name: "ADOS-2 Módulo 4",      faixa: "17 – 80+ anos",   avalia: "Avaliação Diagnóstica de TEA",       populacao: ["Adulto","Idoso"] },
    { id: "ados2m3",    name: "ADOS-2 Módulo 3",      faixa: "11 – 16 anos",    avalia: "Avaliação Diagnóstica de TEA",       populacao: ["Adolescente"] },
    { id: "ados2m2",    name: "ADOS-2 Módulo 2",      faixa: "3 – 10 anos",     avalia: "Avaliação Diagnóstica de TEA",       populacao: ["Criança"] },
    { id: "assq",       name: "ASSQ",                 faixa: "7 – 16 anos",     avalia: "Rastreio de Autismo",                populacao: ["Criança","Adolescente"] },
    { id: "ata",        name: "ATA",                  faixa: "2 – 18 anos",     avalia: "Traços Autísticos",                  populacao: ["Criança","Adolescente"] },
    { id: "aqadol",     name: "AQ (Versão Adolesc.)", faixa: "12 – 15 anos",    avalia: "Rastreio de Autismo",                populacao: ["Adolescente"] },
    { id: "protear",    name: "PROTEA-R-NV",          faixa: "2 – 5 anos",      avalia: "Sistema de Avaliação do TEA",        populacao: ["Criança"] },
    { id: "mchat",      name: "Escala M-CHAT",        faixa: "18 – 24 meses",   avalia: "Rastreio Precoce de Autismo",        populacao: ["Criança"] },
    { id: "escalaata",  name: "Escala ATA",           faixa: "2 – 18 anos",     avalia: "Traços Autísticos (Rastreio)",       populacao: ["Criança","Adolescente"] },
  ],

  "TDAH": [
    { id: "asrs18",     name: "ASRS-18",       faixa: "18+ anos",      avalia: "TDAH (Rastreio OMS)",              populacao: ["Adulto","Idoso"] },
    { id: "baars4",     name: "BAARS-IV",      faixa: "18+ anos",      avalia: "TDAH (Protocolo Barkley)",         populacao: ["Adulto","Idoso"] },
    { id: "etdahad",    name: "ETDAH-AD",      faixa: "12 – 87 anos",  avalia: "TDAH (Autoavaliação)",             populacao: ["Adolescente","Adulto","Idoso"] },
    { id: "snap4",      name: "SNAP-IV",       faixa: "1 – 17 anos",   avalia: "Sintomas TDAH e TOD",              populacao: ["Criança","Adolescente"] },
    { id: "etdahpais",  name: "ETDAH-PAIS",    faixa: "2 – 17 anos",   avalia: "Sintomas TDAH (Pais)",             populacao: ["Criança","Adolescente"] },
    { id: "escalasq",   name: "Escala ASQ",    faixa: "7 – 12 anos",   avalia: "Sintomas TDAH",                    populacao: ["Criança"] },
    { id: "etcd",       name: "ETCD",          faixa: "6 – 17 anos",   avalia: "Sintomas de TDAH, TOD e TC",       populacao: ["Criança","Adolescente"] },
    { id: "escalaabcica", name: "Escala ABC-ICA", faixa: "3 – 14 anos", avalia: "Comportamento Infantil",          populacao: ["Criança"] },
  ],

  "Humor / Ansiedade / Depressão": [
    { id: "bai",        name: "BAI",          faixa: "17 – 80 anos",  avalia: "Sintomas de Ansiedade",      populacao: ["Adolescente","Adulto","Idoso"] },
    { id: "bdi2",       name: "BDI-II",       faixa: "13 – 80 anos",  avalia: "Sintomas de Depressão",      populacao: ["Adolescente","Adulto","Idoso"] },
    { id: "ebadepa",    name: "EBADEP-A",     faixa: "Adultos",        avalia: "Sintomas de Depressão",      populacao: ["Adulto","Idoso"] },
    { id: "humoru",     name: "HUMOR-U",      faixa: "18 – 29 anos",  avalia: "Humor (Universitários)",     populacao: ["Adulto"] },
    { id: "scaredauto", name: "SCARED AUTO",  faixa: "9 – 18 anos",   avalia: "Transtornos de Ansiedade",   populacao: ["Criança","Adolescente"] },
    { id: "scaredhet",  name: "SCARED HETERO",faixa: "7 – 18 anos",   avalia: "Transtornos de Ansiedade",   populacao: ["Criança","Adolescente"] },
    { id: "ebadepij",   name: "EBADEP-IJ",    faixa: "7 – 18 anos",   avalia: "Sintomas de Depressão",      populacao: ["Criança","Adolescente"] },
    { id: "humorij",    name: "HUMOR-IJ",     faixa: "8 – 19 anos",   avalia: "Avaliação do Humor",         populacao: ["Criança","Adolescente"] },
  ],

  "Personalidade / Habilidades Sociais / Adaptativo": [
    { id: "bfp",        name: "BFP",          faixa: "16+ anos",       avalia: "Personalidade",                         populacao: ["Adolescente","Adulto","Idoso"] },
    { id: "pfister",    name: "PFISTER",      faixa: "18 – 66 anos",   avalia: "Personalidade (Projetivo)",             populacao: ["Adulto","Idoso"] },
    { id: "qcppbq",     name: "QCP/PBQ",      faixa: "15 – 94 anos",   avalia: "Conceitualização Cognitiva (Crenças)",  populacao: ["Adolescente","Adulto","Idoso"] },
    { id: "ihs2",       name: "IHS-2",        faixa: "16+ anos",       avalia: "Habilidades Sociais",                   populacao: ["Adolescente","Adulto","Idoso"] },
    { id: "vineland3",  name: "VINELAND-3",   faixa: "0 – 90 anos",    avalia: "Comportamento Adaptativo",              populacao: ["Criança","Adolescente","Adulto","Idoso"] },
    { id: "epqij",      name: "EPQ-IJ",       faixa: "10 – 16 anos",   avalia: "Personalidade",                         populacao: ["Criança","Adolescente"] },
    { id: "efa",        name: "EFA",          faixa: "6 – 15 anos",    avalia: "Funcionamento Adaptativo",              populacao: ["Criança","Adolescente"] },
  ],

  "Desenvolvimento Infantil": [
    { id: "idadi",      name: "IDADI",              faixa: "4 – 72 meses",    avalia: "Desenvolvimento Infantil",         populacao: ["Criança"] },
    { id: "bayley3",    name: "BAYLEY-III",          faixa: "1 – 42 meses",    avalia: "Desenvolvimento Global",           populacao: ["Criança"] },
    { id: "timer",      name: "TIME-R (Kit Completo)",faixa: "3a – 6a 11m",   avalia: "Memória de Curto Prazo",           populacao: ["Criança"] },
    { id: "psens2pe",   name: "Perfil Sensorial 2",  faixa: "0 – 3a 11m",     avalia: "Processamento Sensorial",          populacao: ["Criança"] },
  ],
};

// ── Etapas do fluxo ──────────────────────────────────────────
const STAGES = [
  { id: "anamnese",   label: "Anamnese",          color: "violet" },
  { id: "hipoteses",  label: "Hipóteses",          color: "teal" },
  { id: "checklist",  label: "Checklist",          color: "sky" },
  { id: "testes",     label: "Bateria de Testes",  color: "amber" },
  { id: "correcao",   label: "Correção",           color: "orange" },
  { id: "laudo",      label: "Laudo",              color: "rose" },
  { id: "devolutiva", label: "Devolutiva",         color: "emerald" },
];

// ── Data hoje ────────────────────────────────────────────────
const TODAY = new Date().toISOString().slice(0, 10);

// ── Calendário (vazio — vem do Supabase) ─────────────────────
const CALENDAR = [];

// Pacientes carregados do Supabase via hydratePacientes()
const PATIENTS = [];

window.CORTEX_DATA = { TEST_CATALOG, STAGES, TODAY, PATIENTS, CALENDAR };
