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

async function syncPrices(req, res, next) {
  try {
    const { tb_instituion_id, last_synch } = req.query;
    res.json(await svc.syncPrices({ institutionId: tb_instituion_id, lastSynch: last_synch }));
  } catch (err) { next(err); }
}

module.exports = { listPrices, getPrice, getPricesByProduct, syncPrices };
