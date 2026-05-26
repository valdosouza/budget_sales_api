'use strict';

const svc = require('../application/stock_control.service');

async function createStockControl(req, res, next) {
  try {
    const record = await svc.createStockControl(req.body);
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
}

module.exports = { createStockControl };
