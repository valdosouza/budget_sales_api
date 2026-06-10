'use strict';

const repo = require('../infrastructure/price.repository');
const { parseLastSynch } = require('../../shared/synch.utils');

function notFound(id) {
  const err = new Error(`Preço #${id} não encontrado.`);
  err.status = 404;
  return err;
}

async function listPrices({ limit = 20, offset = 0, filters = {} } = {}) {
  const l = Math.min(Math.max(Number(limit), 1), 100);
  const o = Math.max(Number(offset), 0);
  const { data, total } = await repo.findAll({ limit: l, offset: o, filters });
  return { data: data.map((p) => p.toJSON()), meta: { total, limit: l, offset: o } };
}

async function getPriceById(id) {
  const item = await repo.findById(id);
  if (!item) throw notFound(id);
  return item.toJSON();
}

async function getPricesByProduct(productId) {
  const items = await repo.findByProductId(productId);
  return items.map((p) => p.toJSON());
}

async function syncPrices({ institutionId, lastSynch }) {
  if (!institutionId) {
    const err = new Error('Parâmetro tb_instituion_id é obrigatório.');
    err.status = 400;
    throw err;
  }
  const date  = parseLastSynch(lastSynch);
  const items = await repo.findSynch(institutionId, date);
  return { data: items, meta: { tb_instituion_id: Number(institutionId), last_synch: lastSynch } };
}

module.exports = { listPrices, getPriceById, getPricesByProduct, syncPrices };
