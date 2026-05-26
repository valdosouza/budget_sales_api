'use strict';

const repo = require('../infrastructure/permission.repository');

function badRequest(msg) {
  const err = new Error(msg);
  err.status = 400;
  return err;
}

async function checkPermission({ userId, userLevel, menu, kind, situation }) {
  if (userId    === null || userId    === undefined) throw badRequest('Campo obrigatório ausente: userId.');
  if (userLevel === null || userLevel === undefined) throw badRequest('Campo obrigatório ausente: userLevel.');
  if (!kind)             throw badRequest('Campo obrigatório ausente: kind.');
  if (!situation)        throw badRequest('Campo obrigatório ausente: situation.');

  // Administradores (userLevel != 0) têm acesso irrestrito — espelha Gb_Nivel do Delphi
  if (Number(userLevel) !== 0) return { result: true };

  const allowed = await repo.check({ userId, menu, kind, situation });
  return { result: allowed };
}

module.exports = { checkPermission };
