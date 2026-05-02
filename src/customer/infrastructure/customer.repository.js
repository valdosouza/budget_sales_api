'use strict';

const { query }  = require('../../config/database');
const Customer   = require('../domain/customer.entity');

const BASE_SELECT = `
  SELECT
    e.EMP_CODIGO,
    e.EMP_NOME,
    e.EMP_FANTASIA,
    e.EMP_CNPJ,
    e.EMP_PESSOA,
    e.EMP_EMAIL,
    e.EMP_SITE,
    c.CLI_ATIVO
  FROM TB_CLIENTE c
  INNER JOIN TB_EMPRESA e ON e.EMP_CODIGO = c.CLI_CODEMP
`;

class CustomerRepository {
  async findAll({ limit = 20, offset = 0, filters = {} } = {}) {
    const conditions = [];
    const params     = [];

    if (filters.active !== undefined) {
      conditions.push('c.CLI_ATIVO = ?');
      params.push(filters.active);
    }
    if (filters.person) {
      conditions.push('e.EMP_PESSOA = ?');
      params.push(filters.person);
    }
    if (filters.search) {
      conditions.push(
        '(UPPER(e.EMP_NOME) CONTAINING UPPER(?) OR UPPER(e.EMP_FANTASIA) CONTAINING UPPER(?) OR e.EMP_CNPJ CONTAINING ?)'
      );
      params.push(filters.search, filters.search, filters.search);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await query(
      `SELECT COUNT(*) AS TOTAL FROM TB_CLIENTE c INNER JOIN TB_EMPRESA e ON e.EMP_CODIGO = c.CLI_CODEMP ${where}`,
      params
    );
    const total = Number(countResult[0]?.TOTAL ?? 0);

    const rows = await query(
      `SELECT FIRST ? SKIP ?
        e.EMP_CODIGO, e.EMP_NOME, e.EMP_FANTASIA, e.EMP_CNPJ,
        e.EMP_PESSOA, e.EMP_EMAIL, e.EMP_SITE, c.CLI_ATIVO
       FROM TB_CLIENTE c
       INNER JOIN TB_EMPRESA e ON e.EMP_CODIGO = c.CLI_CODEMP
       ${where}
       ORDER BY e.EMP_NOME ASC`,
      [Number(limit), Number(offset), ...params]
    );

    return { data: rows.map((r) => new Customer(r)), total };
  }

  async findById(id) {
    const rows = await query(`${BASE_SELECT} WHERE e.EMP_CODIGO = ?`, [Number(id)]);
    if (!rows.length) return null;
    return new Customer(rows[0]);
  }
}

module.exports = new CustomerRepository();
