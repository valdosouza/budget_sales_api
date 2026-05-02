'use strict';

const repo = require('../infrastructure/price.repository');

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

module.exports = { listPrices, getPriceById, getPricesByProduct };
