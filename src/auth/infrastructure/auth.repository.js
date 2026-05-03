'use strict';

const { query } = require('../../config/database');
const User      = require('../domain/user.entity');

class AuthRepository {
  /**
   * Busca usuario ativo pelo login.
   * Faz JOIN com TB_COLABORADOR para trazer CLB_CODIGO (codigo do vendedor).
   * Retorna null se nao encontrado ou inativo.
   */
  async findByLogin(login) {
    const rows = await query(
      `SELECT u.USU_CODIGO,
              u.USU_NOME,
              u.USU_LOGIN,
              u.USU_SENHA,
              u.USU_LEVEL,
              u.USU_ATIVO,
              c.CLB_CODIGO
         FROM TB_USUARIO u
         LEFT JOIN TB_COLABORADOR c ON c.CLB_CODUSU = u.USU_CODIGO
        WHERE UPPER(u.USU_LOGIN) = UPPER(?)
          AND u.USU_ATIVO = 'S'`,
      [login]
    );

    if (!rows.length) return null;
    return { user: new User(rows[0]), senha: rows[0].USU_SENHA };
  }
}

module.exports = new AuthRepository();
