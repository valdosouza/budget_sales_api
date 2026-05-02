'use strict';

const repo = require('../infrastructure/payment_type.repository');

function notFound(id) {
  const err = new Error(`Forma de pagamento #${id} não encontrada.`);
  err.status = 404;
  return err;
}

async function listPaymentTypes({ limit = 20, offset = 0, filters = {} } = {}) {
  const l = Math.min(Math.max(Number(limit), 1), 100);
  const o = Math.max(Number(offset), 0);
  const { data, total } = await repo.findAll({ limit: l, offset: o, filters });
  return { data: data.map((p) => p.toJSON()), meta: { total, limit: l, offset: o } };
}

async function getPaymentTypeById(id) {
  const item = await repo.findById(id);
  if (!item) throw notFound(id);
  return item.toJSON();
}

module.exports = { listPaymentTypes, getPaymentTypeById };
