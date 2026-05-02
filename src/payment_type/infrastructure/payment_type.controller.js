'use strict';

const svc = require('../application/payment_type.service');

async function listPaymentTypes(req, res, next) {
  try {
    const { limit = 20, offset = 0, ...filters } = req.query;
    res.json(await svc.listPaymentTypes({ limit: Number(limit), offset: Number(offset), filters }));
  } catch (err) { next(err); }
}

async function getPaymentType(req, res, next) {
  try {
    res.json(await svc.getPaymentTypeById(req.params.id));
  } catch (err) { next(err); }
}

module.exports = { listPaymentTypes, getPaymentType };
