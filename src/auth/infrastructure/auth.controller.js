'use strict';

const svc = require('../application/auth.service');

/**
 * POST /auth/login
 * Body: { login, senha }
 */
async function login(req, res, next) {
  try {
    const { login, senha } = req.body;

    if (!login || !senha) {
      return res.status(400).json({
        error: 'Os campos "login" e "senha" são obrigatórios.',
      });
    }

    const result = await svc.authenticate(login, senha);

    if (!result.authenticated) {
      return res.status(401).json({
        authenticated: false,
        error: 'Credenciais inválidas.',
      });
    }

    return res.status(200).json({
      authenticated: true,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
