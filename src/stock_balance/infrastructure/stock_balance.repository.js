'use strict';

const { query }      = require('../../config/database');
const StockBalance   = require('../domain/stock_balance.entity');

const BASE_SELECT = `
  SELECT
    e.EST_CODIGO,
    e.EST_CODETS,
    e.EST_CODPRO,
    e.EST_QTDE,
    es.ETS_DESCRICAO,
    p.PRO_CODIGOFAB,
    p.PRO_DESCRICAO
  FROM TB_ESTOQUE e
  LEFT JOIN TB_ESTOQUES es ON es.ETS_CODIGO = e.EST_CODETS
  LEFT JOIN TB_PRODUTO   p  ON p.PRO_CODIGO  = e.EST_CODPRO
`;

class StockBalanceRepository {
  async findAll({ limit = 20, offset = 0, filters = {} } = {}) {
    const conditions = [];
    const params     = [];

    if (filters.stockListId) {
      conditions.push('e.EST_CODETS = ?');
      params.push(Number(filters.stockListId));
    }
    if (filters.productId) {
      conditions.push('e.EST_CODPRO = ?');
      params.push(Number(filters.productId));
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await query(
      `SELECT COUNT(*) AS TOTAL FROM TB_ESTOQUE e ${where}`, params
    );
    const total = Number(countResult[0]?.TOTAL ?? 0);

    const rows = await query(
      `SELECT FIRST ? SKIP ?
        e.EST_CODIGO, e.EST_CODETS, e.EST_CODPRO, e.EST_QTDE,
        es.ETS_DESCRICAO, p.PRO_CODIGOFAB, p.PRO_DESCRICAO
       FROM TB_ESTOQUE e
       LEFT JOIN TB_ESTOQUES es ON es.ETS_CODIGO = e.EST_CODETS
       LEFT JOIN TB_PRODUTO   p  ON p.PRO_CODIGO  = e.EST_CODPRO
       ${where}
       ORDER BY p.PRO_DESCRICAO ASC`,
      [Number(limit), Number(offset), ...params]
    );

    return { data: rows.map((r) => new StockBalance(r)), total };
  }

  async findById(id) {
    const rows = await query(`${BASE_SELECT} WHERE e.EST_CODIGO = ?`, [Number(id)]);
    if (!rows.length) return null;
    return new StockBalance(rows[0]);
  }

  /** Saldo consolidado de um produto em todos os estoques. */
  async findByProductId(productId) {
    const rows = await query(
      `${BASE_SELECT} WHERE e.EST_CODPRO = ? ORDER BY es.ETS_DESCRICAO ASC`,
      [Number(productId)]
    );
    return rows.map((r) => new StockBalance(r));
  }
}

module.exports = new StockBalanceRepository();
