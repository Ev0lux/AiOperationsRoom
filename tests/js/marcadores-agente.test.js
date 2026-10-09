'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const marcas = require(path.join(__dirname, '..', '..', 'frontend', 'marcadores-agente.js'));

test('explore ativo usa roxo de pesquisa', () => {
  const ctx = marcas.contextoSala([]);
  const { categoria, cor } = marcas.corMarcador({
    status: 'trabalhando',
    tipo_agente: 'explore',
    session_id: 's',
    desde_segundos: 5,
  }, ctx);
  assert.equal(categoria, 'pesquisa');
  assert.equal(cor, marcas.CORES.pesquisa);
  assert.ok(marcas.corMarcador({ status: 'trabalhando', tipo_agente: 'WebSearch', session_id: 's' }, ctx).cor !== marcas.CORES.cargaMedia);
});

test('web search usa laranja', () => {
  const ctx = marcas.contextoSala([]);
  const { categoria } = marcas.corMarcador({
    status: 'trabalhando',
    tipo_agente: 'WebSearch',
    session_id: 's',
  }, ctx);
  assert.equal(categoria, 'pesquisa-web');
});

test('principal delegando = carga alta', () => {
  const ctx = marcas.contextoSala([
    { status: 'delegando', tipo_agente: 'principal', session_id: 's' },
  ]);
  const { categoria } = marcas.corMarcador({
    status: 'delegando',
    tipo_agente: 'principal',
    session_id: 's',
  }, ctx);
  assert.equal(categoria, 'carga-alta');
});

test('aguardando = carga baixa', () => {
  const ctx = marcas.contextoSala([]);
  const { categoria } = marcas.corMarcador({
    status: 'aguardando',
    tipo_agente: 'subagente',
    session_id: 's',
  }, ctx);
  assert.equal(categoria, 'carga-baixa');
});
