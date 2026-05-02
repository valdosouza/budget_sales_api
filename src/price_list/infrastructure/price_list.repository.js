'use strict';

const { query }   = require('../../config/database');
const PriceList   = require('../domain/price_list.entity');

class PriceListRepository {
  async findAll({ limit = 20, offset = 0, filters = {} } = {}) {
    const conditions = [];
    const params     = [];

    if (filters.active !== undefined) {
      conditions.push('TPR_ATIVA = ?');
      params.push(filters.active);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await query(`SELECT COUNT(*) AS TOTAL FROM TB_TABELA_PRECO ${where}`, params);
    const total = Number(countResult[0]?.TOTAL ?? 0);

    const rows = await query(
      `SELECT FIRST ? SKIP ? TPR_CODIGO, TPR_NOME, TPR_ATIVA FROM TB_TABELA_PRECO ${where} ORDER BY TPR_NOME ASC`,
      [Number(limit), Number(offset), ...params]
    );

    return { data: rows.map((r) => new PriceList(r)), total };
  }

  async findById(id) {
    const rows = await query(
      `SELECT TPR_CODIGO, TPR_NOME, TPR_ATIVA FROM TB_TABELA_PRECO WHERE TPR_CODIGO = ?`,
      [Number(id)]
    );
    if (!rows.length) return null;
    return new PriceList(rows[0]);
  }
}

module.exports = new PriceListRepository();
