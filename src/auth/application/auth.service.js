'use strict';

const repo = require('../infrastructure/auth.repository');

class AuthService {
  /**
   * Autentica um usuário comparando login e senha com TB_USUARIO.
   *
   * @param {string} login  - Login do usuário (USU_LOGIN)
   * @param {string} senha  - Senha em texto puro (USU_SENHA)
   * @returns {{ authenticated: boolean, user?: object }}
   */
  async authenticate(login, senha) {
    if (!login || !senha) {
      return { authenticated: false };
    }

    const result = await repo.findByLogin(login);

    if (!result) {
      return { authenticated: false };
    }

    // Comparação simples conforme regra de negócio descrita no contexto
    const match = result.senha === senha;

    if (!match) {
      return { authenticated: false };
    }

    return {
      authenticated: true,
      user: result.user,
    };
  }
}

module.exports = new AuthService();
