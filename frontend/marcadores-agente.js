'use strict';

/* Cor do losango sobre a cabeça: carga de trabalho e tipo de atividade. */

(function (raiz) {
  const ATIVOS = new Set(['trabalhando', 'delegando', 'aguardando']);

  const CORES = {
    cargaAlta: '#ff2d2d',
    cargaMedia: '#fff500',
    cargaBaixa: '#00e676',
    pesquisa: '#c77dff',
    pesquisaWeb: '#ff4500',
    plano: '#2979ff',
    revisao: '#00e5ff',
    qa: '#ff4081',
    inativo: '#6b6b75',
    orfa: '#ff2d2d',
  };

  const ANEIS = {
    'carga-alta': '#7f1d1d',
    'carga-media': '#713f12',
    'carga-baixa': '#065f46',
    pesquisa: '#4c1d95',
    'pesquisa-web': '#9a3412',
    plano: '#1e3a8a',
    revisao: '#155e75',
    qa: '#9d174d',
    inativo: '#3f3f46',
    orfa: '#7f1d1d',
  };

  const ROTULOS = {
    'carga-alta': 'carga alta',
    'carga-media': 'carga média',
    'carga-baixa': 'carga baixa',
    pesquisa: 'pesquisa no código',
    'pesquisa-web': 'pesquisa na web',
    plano: 'planejamento',
    revisao: 'revisão',
    qa: 'qualidade / segurança',
    inativo: 'encerrada',
    orfa: 'órfã',
  };

  function tipoTexto(exec) {
    return String(exec.tipo_agente || exec.tipo || '').toLowerCase();
  }

  function ehPrincipal(exec) {
    return exec.tipo_agente === 'principal' || (!exec.agent_id && !exec.pai_chave && !exec.execucao_pai_id);
  }

  function ehPesquisaWeb(tipo) {
    return /web|internet|browser|fetch|mcp.*web|websearch|web-search|webfetch/i.test(tipo);
  }

  function ehPesquisaCodigo(tipo) {
    return /explore|pesquisador|general-purpose|research|claude-code-guide/i.test(tipo);
  }

  function ehPlano(tipo) {
    return /^plan$|planej|planner/i.test(tipo);
  }

  function ehRevisao(tipo) {
    return /revisor|code-review|review|simplify/i.test(tipo);
  }

  function ehQa(tipo) {
    return /verificador|diagnostico|security|ci-investigator|bugbot/i.test(tipo);
  }

  function atividadeEspecial(exec) {
    const tipo = tipoTexto(exec);
    if (ehPesquisaWeb(tipo)) return 'pesquisa-web';
    if (ehPesquisaCodigo(tipo)) return 'pesquisa';
    if (ehPlano(tipo)) return 'plano';
    if (ehRevisao(tipo)) return 'revisao';
    if (ehQa(tipo)) return 'qa';
    return null;
  }

  function contextoSala(execucoes) {
    const filhosAtivosPorSessao = {};
    for (const ex of execucoes || []) {
      if (!ATIVOS.has(ex.status)) continue;
      if (ehPrincipal(ex)) continue;
      const sid = ex.session_id;
      if (!sid) continue;
      filhosAtivosPorSessao[sid] = (filhosAtivosPorSessao[sid] || 0) + 1;
    }
    return { filhosAtivosPorSessao };
  }

  function nivelCarga(exec, ctx) {
    const status = exec.status;
    const desde = Number(exec.desde_segundos) || 0;
    const filhos = ctx.filhosAtivosPorSessao[exec.session_id] || 0;

    if (status === 'aguardando') return 'carga-baixa';
    if (status === 'delegando') return 'carga-alta';
    if (status !== 'trabalhando') return 'carga-baixa';

    if (ehPrincipal(exec)) {
      if (filhos >= 2) return 'carga-alta';
      if (filhos >= 1) return 'carga-media';
      return desde > 45 ? 'carga-media' : 'carga-baixa';
    }

    if (desde > 120) return 'carga-alta';
    if (desde > 35) return 'carga-media';
    return 'carga-baixa';
  }

  function corMarcador(exec, ctx) {
    const status = exec.status;
    if (status === 'concluida') {
      return { cor: CORES.inativo, categoria: 'inativo', anel: ANEIS.inativo };
    }
    if (status === 'orfa') {
      return { cor: CORES.orfa, categoria: 'orfa', anel: ANEIS.orfa };
    }

    if (['trabalhando', 'delegando'].includes(status)) {
      const especial = atividadeEspecial(exec);
      if (especial) {
        const mapa = {
          pesquisa: 'pesquisa',
          'pesquisa-web': 'pesquisaWeb',
          plano: 'plano',
          revisao: 'revisao',
          qa: 'qa',
        };
        const chave = mapa[especial];
        return { cor: CORES[chave], categoria: especial, anel: ANEIS[especial] };
      }
    }

    const categoria = nivelCarga(exec, ctx);
    const corMap = {
      'carga-alta': CORES.cargaAlta,
      'carga-media': CORES.cargaMedia,
      'carga-baixa': CORES.cargaBaixa,
    };
    return { cor: corMap[categoria], categoria, anel: ANEIS[categoria] };
  }

  function rotuloCategoria(categoria) {
    return ROTULOS[categoria] || categoria;
  }

  const api = { CORES, corMarcador, contextoSala, rotuloCategoria, nivelCarga, atividadeEspecial };
  raiz.MarcadoresAgente = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
