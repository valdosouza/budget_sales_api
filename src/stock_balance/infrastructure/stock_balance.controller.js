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

async function syncStockBalance(req, res, next) {
  try {
    const { tb_instituion_id, last_synch } = req.query;
    const result = await svc.syncStockBalance({ institutionId: tb_instituion_id, lastSynch: last_synch });
    res.json(result);
  } catch (err) {
    console.error('[SYNCH] erro:', err.message, err.stack);
    next(err);
  }
}

module.exports = { listStockBalances, getStockBalance, getStockByProduct, syncStockBalance };
