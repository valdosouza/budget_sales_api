'use strict';

const { query, queryReadOnly } = require('../../config/database');
const Price     = require('../domain/price.entity');

const BASE_SELECT = `
  SELECT
    pr.PRC_CODIGO,
    pr.PRC_CODTPR,
    pr.PRC_CODPRO,
    pr.PRC_VL_VDA,
    tp.TPR_NOME,
    p.PRO_CODIGOFAB,
    p.PRO_DESCRICAO
  FROM TB_PRECO pr
  LEFT JOIN TB_TABELA_PRECO tp ON tp.TPR_CODIGO = pr.PRC_CODTPR
  LEFT JOIN TB_PRODUTO       p  ON p.PRO_CODIGO  = pr.PRC_CODPRO
`;

class PriceRepository {
  async findAll({ limit = 20, offset = 0, filters = {} } = {}) {
    const conditions = [];
    const params     = [];

    if (filters.priceListId) {
      conditions.push('pr.PRC_CODTPR = ?');
      params.push(Number(filters.priceListId));
    }
    if (filters.productId) {
      conditions.push('pr.PRC_CODPRO = ?');
      params.push(Number(filters.productId));
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await query(
      `SELECT COUNT(*) AS TOTAL FROM TB_PRECO pr ${where}`, params
    );
    const total = Number(countResult[0]?.TOTAL ?? 0);

    const rows = await query(
      `SELECT FIRST ? SKIP ?
        pr.PRC_CODIGO, pr.PRC_CODTPR, pr.PRC_CODPRO, pr.PRC_VL_VDA,
        tp.TPR_NOME, p.PRO_CODIGOFAB, p.PRO_DESCRICAO
       FROM TB_PRECO pr
       LEFT JOIN TB_TABELA_PRECO tp ON tp.TPR_CODIGO = pr.PRC_CODTPR
       LEFT JOIN TB_PRODUTO       p  ON p.PRO_CODIGO  = pr.PRC_CODPRO
       ${where}
       ORDER BY p.PRO_DESCRICAO ASC`,
      [Number(limit), Number(offset), ...params]
    );

    return { data: rows.map((r) => new Price(r)), total };
  }

  async findById(id) {
    const rows = await query(`${BASE_SELECT} WHERE pr.PRC_CODIGO = ?`, [Number(id)]);
    if (!rows.length) return null;
    return new Price(rows[0]);
  }

  /** Retorna todos os preços de um produto em todas as tabelas. */
  async findByProductId(productId) {
    const rows = await query(
      `${BASE_SELECT} WHERE pr.PRC_CODPRO = ? ORDER BY tp.TPR_NOME ASC`,
      [Number(productId)]
    );
    return rows.map((r) => new Price(r));
  }

  async findSynch(institutionId, lastSynch) {
    const rows = await queryReadOnly(
      `SELECT
         D.PRC_CODPRO,
         D.PRC_VL_VDA,
         MAX(S.SRC_TIME) AS SRC_TIME
       FROM TB_TABELA_PRECO M
         INNER JOIN TB_PRECO D ON M.TPR_CODIGO = D.PRC_CODTPR
         INNER JOIN TB_SINCRONIA S ON S.SRC_REGISTRO = D.PRC_CODIGO
       WHERE S.SRC_TABELA = 'TB_PRECO'
         AND M.TPR_CODEMP = ?
         AND S.SRC_TIME > ?
       GROUP BY D.PRC_CODPRO, D.PRC_VL_VDA
       ORDER BY 3 ASC`,
      [Number(institutionId), lastSynch]
    );
    return rows.map((r) => ({
      product:     r.PRC_CODPRO,
      price_tag:   Number(r.PRC_VL_VDA),
      last_change: r.SRC_TIME,
    }));
  }
}

module.exports = new PriceRepository();
