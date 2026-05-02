'use strict';

const svc = require('../application/price.service');

async function listPrices(req, res, next) {
  try {
    const { limit = 20, offset = 0, ...filters } = req.query;
    res.json(await svc.listPrices({ limit: Number(limit), offset: Number(offset), filters }));
  } catch (err) { next(err); }
}

async function getPrice(req, res, next) {
  try {
    res.json(await svc.getPriceById(req.params.id));
  } catch (err) { next(err); }
}

async function getPricesByProduct(req, res, next) {
  try {
    res.json(await svc.getPricesByProduct(req.params.productId));
  } catch (err) { next(err); }
}

module.exports = { listPrices, getPrice, getPricesByProduct };
