'use strict';

/* Nomes de exibição no escritório — um apelido estável por execução (mesma chave = mesma pessoa). */

(function (raiz) {
  const FAMILIAS = [
    ['principal', /^principal$/i],
    ['pesquisa', /^(explore|pesquisador|general-purpose|claude-code-guide)/i],
    ['plano', /^plan$/i],
    ['revisao', /^(revisor|code-review|simplify|review)/i],
    ['qa', /^(verificador|diagnostico|security|bugbot)/i],
    ['dados', /^analista/i],
    ['conhecimento', /^(curador|radar|entrega)/i],
  ];

  const POOLS = {
    principal: [
      'Capitão do Turno',
      'Chefão da Sessão',
      'Maestro do Chat',
      'Orquestrador',
    ],
    pesquisa: [
      'Detetive de Pastas',
      'Fuçador Pro',
      'Lupa 9000',
      'Periscópio do Código',
      'Sniffer de Repo',
      'Caçador de Achados',
      'Batedor de Código',
    ],
    plano: [
      'Cartógrafo do Caos',
      'GPS do Projeto',
      'Arquiteto de Planos',
      'Engenheiro de Sonhos',
      'Desenhista de Rotas',
    ],
    revisao: [
      'Juiz do Diff',
      'Fiscal de Vírgula',
      'Crítico de Sofá',
      'Guardião do Estilo',
      'Revisor Noturno',
    ],
    qa: [
      'Caçador de Fantasmas',
      'Ninja do QA',
      'Detetive do 404',
      'Perito do Bug',
      'Testador Relâmpago',
    ],
    dados: [
      'Ninja dos Números',
      'Sommelier de CSV',
      'Oráculo das Tabelas',
      'Contador de Bits',
    ],
    conhecimento: [
      'Bibliotecário Noturno',
      'Curador de Lore',
      'Guardião do Wiki',
      'Arquivista Zen',
    ],
    outro: [
      'Agente Secreto',
      'Freelancer do Futuro',
      'Sobrevivente Legacy',
      'Especialista Surpresa',
      'Operário do Imprevisto',
      'Estagiário do Caos',
    ],
  };

  function hash(texto) {
    let h = 2166136261;
    for (const ch of String(texto)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return h >>> 0;
  }

  function familiaDe(tipo) {
    return (FAMILIAS.find(([, pattern]) => pattern.test(String(tipo || ''))) || ['outro'])[0];
  }

  function tipoParaExecucao(exec) {
    if (exec.tipo_agente) return exec.tipo_agente;
    if (!exec.agent_id && !exec.pai_chave) return 'principal';
    return exec.tipo || 'subagente';
  }

  function nomeDe(exec) {
    const tipo = tipoParaExecucao(exec);
    const fam = familiaDe(tipo);
    const pool = POOLS[fam] || POOLS.outro;
    const chave = fam === 'principal'
      ? String(exec.session_id || exec.id || '')
      : `${exec.session_id || ''}|${exec.agent_id || ''}|${exec.id || ''}`;
    return pool[hash(chave) % pool.length];
  }

  const api = { nomeDe, familiaDe, hash, tipoParaExecucao };
  raiz.NomesAgentes = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
