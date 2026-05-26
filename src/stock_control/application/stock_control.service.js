'use strict';

const repo = require('../infrastructure/stock_control.repository');

function badRequest(msg) {
  const err = new Error(msg);
  err.status = 400;
  return err;
}

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) throw badRequest(`Data inválida: ${value}`);
  return d;
}

async function createStockControl(data) {
  if (data.terminal   == null) throw badRequest('Campo obrigatório ausente: terminal.');
  if (!data.link)              throw badRequest('Campo obrigatório ausente: link.');
  if (data.productId  == null) throw badRequest('Campo obrigatório ausente: productId.');
  if (data.stockListId == null) throw badRequest('Campo obrigatório ausente: stockListId.');
  if (data.quantity   == null) throw badRequest('Campo obrigatório ausente: quantity.');
  if (!data.operation)         throw badRequest('Campo obrigatório ausente: operation.');

  const record = await repo.create({
    ...data,
    date: parseDate(data.date),
  });

  return record.toJSON();
}

module.exports = { createStockControl };
