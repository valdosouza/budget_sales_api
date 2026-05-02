'use strict';

const svc = require('../application/price_list.service');

async function listPriceLists(req, res, next) {
  try {
    const { limit = 20, offset = 0, ...filters } = req.query;
    res.json(await svc.listPriceLists({ limit: Number(limit), offset: Number(offset), filters }));
  } catch (err) { next(err); }
}

async function getPriceList(req, res, next) {
  try {
    res.json(await svc.getPriceListById(req.params.id));
  } catch (err) { next(err); }
}

module.exports = { listPriceLists, getPriceList };
