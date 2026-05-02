'use strict';

const svc = require('../application/stock_list.service');

async function listStockLists(req, res, next) {
  try {
    const { limit = 20, offset = 0, ...filters } = req.query;
    res.json(await svc.listStockLists({ limit: Number(limit), offset: Number(offset), filters }));
  } catch (err) { next(err); }
}

async function getStockList(req, res, next) {
  try {
    res.json(await svc.getStockListById(req.params.id));
  } catch (err) { next(err); }
}

module.exports = { listStockLists, getStockList };
