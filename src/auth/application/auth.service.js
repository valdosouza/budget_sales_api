'use strict';

const repo = require('../infrastructure/auth.repository');

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

    return {
      authenticated: true,
      user: result.user,
    };
  }
}

module.exports = new AuthService();
