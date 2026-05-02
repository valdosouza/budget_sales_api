'use strict';

const svc = require('../application/salesman.service');

async function listSalesmen(req, res, next) {
  try {
    const { limit = 20, offset = 0, ...filters } = req.query;
    res.json(await svc.listSalesmen({ limit: Number(limit), offset: Number(offset), filters }));
  } catch (err) { next(err); }
}

async function getSalesman(req, res, next) {
  try {
    res.json(await svc.getSalesmanById(req.params.id));
  } catch (err) { next(err); }
}

module.exports = { listSalesmen, getSalesman };
