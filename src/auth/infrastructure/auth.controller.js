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
        authenticated: false,
        error: 'Os campos login e senha sao obrigatorios.',
      });
    }

    const result = await svc.authenticate(login, senha);

    if (!result.authenticated) {
      const message = result.reason === 'not_salesman'
        ? 'Erro de autenticacao ou usuario nao e vendedor.'
        : 'Credenciais invalidas.';

      return res.status(401).json({
        authenticated: false,
        error: message,
      });
    }

    return res.status(200).json({
      authenticated: true,
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
