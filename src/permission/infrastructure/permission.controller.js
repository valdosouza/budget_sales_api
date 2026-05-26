'use strict';

const svc = require('../application/permission.service');

async function checkPermission(req, res, next) {
  try {
    const { userId, userLevel, menu, kind, situation } = req.body;
    res.json(await svc.checkPermission({ userId, userLevel, menu, kind, situation }));
  } catch (err) {
    next(err);
  }
}

module.exports = { checkPermission };
