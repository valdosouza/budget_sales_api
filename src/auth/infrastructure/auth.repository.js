'use strict';

const { query } = require('../../config/database');
const User      = require('../domain/user.entity');

class AuthRepository {
  /**
   * Busca um usuário ativo pelo login.
   * Retorna null se não encontrado ou inativo.
   */
  async findByLogin(login) {
    const rows = await query(
      `SELECT USU_CODIGO, USU_NOME, USU_LOGIN, USU_SENHA, USU_LEVEL, USU_ATIVO
         FROM TB_USUARIO
        WHERE UPPER(USU_LOGIN) = UPPER(?)
          AND USU_ATIVO = 'S'`,
      [login]
    );

    if (!rows.length) return null;
    return { user: new User(rows[0]), senha: rows[0].USU_SENHA };
  }
}

module.exports = new AuthRepository();
