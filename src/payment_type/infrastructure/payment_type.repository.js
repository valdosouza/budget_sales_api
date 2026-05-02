'use strict';

const { query }     = require('../../config/database');
const PaymentType   = require('../domain/payment_type.entity');

class PaymentTypeRepository {
  async findAll({ limit = 20, offset = 0, filters = {} } = {}) {
    const conditions = [];
    const params     = [];

    if (filters.search) {
      conditions.push('UPPER(FPT_DESCRICAO) CONTAINING UPPER(?)');
      params.push(filters.search);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await query(`SELECT COUNT(*) AS TOTAL FROM TB_FORMAPAGTO ${where}`, params);
    const total = Number(countResult[0]?.TOTAL ?? 0);

    const rows = await query(
      `SELECT FIRST ? SKIP ? FPT_CODIGO, FPT_DESCRICAO FROM TB_FORMAPAGTO ${where} ORDER BY FPT_DESCRICAO ASC`,
      [Number(limit), Number(offset), ...params]
    );

    return { data: rows.map((r) => new PaymentType(r)), total };
  }

  async findById(id) {
    const rows = await query(
      `SELECT FPT_CODIGO, FPT_DESCRICAO FROM TB_FORMAPAGTO WHERE FPT_CODIGO = ?`,
      [Number(id)]
    );
    if (!rows.length) return null;
    return new PaymentType(rows[0]);
  }
}

module.exports = new PaymentTypeRepository();
