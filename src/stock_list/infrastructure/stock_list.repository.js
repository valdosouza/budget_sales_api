'use strict';

const { query }   = require('../../config/database');
const StockList   = require('../domain/stock_list.entity');

class StockListRepository {
  async findAll({ limit = 20, offset = 0, filters = {} } = {}) {
    const conditions = [];
    const params     = [];

    if (filters.warehouseId) {
      conditions.push('ETS_CODMHA = ?');
      params.push(Number(filters.warehouseId));
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await query(`SELECT COUNT(*) AS TOTAL FROM TB_ESTOQUES ${where}`, params);
    const total = Number(countResult[0]?.TOTAL ?? 0);

    const rows = await query(
      `SELECT FIRST ? SKIP ? ETS_CODIGO, ETS_CODMHA, ETS_DESCRICAO, ETS_PRINCIPAL
       FROM TB_ESTOQUES ${where} ORDER BY ETS_DESCRICAO ASC`,
      [Number(limit), Number(offset), ...params]
    );

    return { data: rows.map((r) => new StockList(r)), total };
  }

  async findById(id) {
    const rows = await query(
      `SELECT ETS_CODIGO, ETS_CODMHA, ETS_DESCRICAO, ETS_PRINCIPAL FROM TB_ESTOQUES WHERE ETS_CODIGO = ?`,
      [Number(id)]
    );
    if (!rows.length) return null;
    return new StockList(rows[0]);
  }
}

module.exports = new StockListRepository();
