'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const nomes = require(path.join(__dirname, '..', '..', 'frontend', 'nomes-agentes.js'));

test('mesma execução, mesmo apelido', () => {
  const exec = { session_id: 's1', agent_id: 'a1', id: 42, tipo_agente: 'explore' };
  assert.equal(nomes.nomeDe(exec), nomes.nomeDe({ ...exec }));
});

test('principal usa pool da sessão', () => {
  const a = nomes.nomeDe({ session_id: 'alpha', id: 1, tipo_agente: 'principal' });
  const b = nomes.nomeDe({ session_id: 'beta', id: 1, tipo_agente: 'principal' });
  assert.ok(a.length > 2);
  assert.ok(b.length > 2);
});

test('explore cai na família pesquisa', () => {
  assert.equal(nomes.familiaDe('Explore'), 'pesquisa');
  assert.equal(nomes.familiaDe('explore'), 'pesquisa');
});
