'use strict';

const repo = require('../infrastructure/auth.repository');

class AuthService {
  /**
   * Autentica um usuario comparando login e senha com TB_USUARIO.
   * Valida tambem se o usuario possui vinculo com TB_COLABORADOR (e vendedor).
   *
   * Possiveis retornos:
   *   { authenticated: false, reason: 'invalid_credentials' }
   *   { authenticated: false, reason: 'not_salesman' }
   *   { authenticated: true,  user: { ... } }
   */
  async authenticate(login, senha) {
    if (!login || !senha) {
      return { authenticated: false, reason: 'invalid_credentials' };
    }

    const result = await repo.findByLogin(login);

    if (!result) {
      return { authenticated: false, reason: 'invalid_credentials' };
    }

    // Comparacao simples conforme regra de negocio
    if (result.senha !== senha) {
      return { authenticated: false, reason: 'invalid_credentials' };
    }

    // Valida vinculo com colaborador — usuario precisa ser vendedor
    const salesmanId = result.user.salesmanId;
    if (!salesmanId || salesmanId === 0) {
      return { authenticated: false, reason: 'not_salesman' };
    }

    return {
      authenticated: true,
      user: result.user,
    };
  }
}

module.exports = new AuthService();
