'use strict';

const jwt  = require('jsonwebtoken');
const repo = require('../infrastructure/auth.repository');
const env  = require('../../config/env');

class AuthService {
  async authenticate(login, senha) {
    if (!login || !senha) {
      return { authenticated: false, reason: 'invalid_credentials' };
    }

    const result = await repo.findByLogin(login);

    if (!result) {
      return { authenticated: false, reason: 'invalid_credentials' };
    }

    if (result.senha !== senha) {
      return { authenticated: false, reason: 'invalid_credentials' };
    }

    const payload = {
      sub:       result.user.id,
      login:     result.user.login,
      level:     result.user.level,
      salesmanId: result.user.salesmanId ?? null,
    };

    const token = jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

    return {
      authenticated: true,
      user: result.user,
      token,
    };
  }
}

module.exports = new AuthService();
