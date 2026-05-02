'use strict';

const svc = require('../application/customer.service');

async function listCustomers(req, res, next) {
  try {
    const { limit = 20, offset = 0, ...filters } = req.query;
    res.json(await svc.listCustomers({ limit: Number(limit), offset: Number(offset), filters }));
  } catch (err) { next(err); }
}

async function getCustomer(req, res, next) {
  try {
    res.json(await svc.getCustomerById(req.params.id));
  } catch (err) { next(err); }
}

module.exports = { listCustomers, getCustomer };
