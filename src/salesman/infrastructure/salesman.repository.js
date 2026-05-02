'use strict';

const { query }  = require('../../config/database');
const Salesman   = require('../domain/salesman.entity');

const BASE_SELECT = `
  SELECT
    cl.CLB_CODIGO,
    cl.CLB_NOME,
    cl.CLB_CODCRG,
    cl.CLB_ADMISSAO,
    cl.CLB_DEMISSAO,
    cr.CRG_DESCRICAO
  FROM TB_COLABORADOR cl
  LEFT JOIN TB_CARGO cr ON cr.CRG_CODIGO = cl.CLB_CODCRG
`;

class SalesmanRepository {
  async findAll({ limit = 20, offset = 0, filters = {} } = {}) {
    const conditions = [];
    const params     = [];

    // active=true → sem data de demissão; active=false → com demissão
    if (filters.active !== undefined) {
      if (filters.active === 'true' || filters.active === true) {
        conditions.push('cl.CLB_DEMISSAO IS NULL');
      } else {
        conditions.push('cl.CLB_DEMISSAO IS NOT NULL');
      }
    }
    if (filters.search) {
      conditions.push('UPPER(cl.CLB_NOME) CONTAINING UPPER(?)');
      params.push(filters.search);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await query(
      `SELECT COUNT(*) AS TOTAL FROM TB_COLABORADOR cl ${where}`, params
    );
    const total = Number(countResult[0]?.TOTAL ?? 0);

    const rows = await query(
      `SELECT FIRST ? SKIP ?
        cl.CLB_CODIGO, cl.CLB_NOME, cl.CLB_CODCRG, cl.CLB_ADMISSAO, cl.CLB_DEMISSAO, cr.CRG_DESCRICAO
       FROM TB_COLABORADOR cl
       LEFT JOIN TB_CARGO cr ON cr.CRG_CODIGO = cl.CLB_CODCRG
       ${where}
       ORDER BY cl.CLB_NOME ASC`,
      [Number(limit), Number(offset), ...params]
    );

    return { data: rows.map((r) => new Salesman(r)), total };
  }

  async findById(id) {
    const rows = await query(`${BASE_SELECT} WHERE cl.CLB_CODIGO = ?`, [Number(id)]);
    if (!rows.length) return null;
    return new Salesman(rows[0]);
  }
}

module.exports = new SalesmanRepository();
