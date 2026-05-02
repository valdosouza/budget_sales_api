'use strict';

const svc = require('../application/stock_balance.service');

async function listStockBalances(req, res, next) {
  try {
    const { limit = 20, offset = 0, ...filters } = req.query;
    res.json(await svc.listStockBalances({ limit: Number(limit), offset: Number(offset), filters }));
  } catch (err) { next(err); }
}

async function getStockBalance(req, res, next) {
  try {
    res.json(await svc.getStockBalanceById(req.params.id));
  } catch (err) { next(err); }
}

async function getStockByProduct(req, res, next) {
  try {
    res.json(await svc.getStockByProduct(req.params.productId));
  } catch (err) { next(err); }
}

module.exports = { listStockBalances, getStockBalance, getStockByProduct };
