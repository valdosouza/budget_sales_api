'use strict';

const { query } = require('../../config/database');
const Product   = require('../domain/product.entity');

const BASE_SELECT = `
  SELECT
    p.PRO_CODIGO,
    p.PRO_CODIGOFAB,
    p.PRO_CODIGOBAR,
    p.PRO_CODIGOFOR,
    p.PRO_DESCRICAO,
    p.PRO_CODMED,
    p.PRO_CODEMB,
    p.PRO_CODGRP,
    p.PRO_CODSBG,
    p.PRO_DIVISOR,
    p.PRO_TIPO,
    p.PRO_LOCAL,
    p.PRO_PESO,
    p.PRO_LARGURA,
    p.PRO_COMPRIMENTO,
    p.PRO_ALTURA,
    p.PRO_SUB_TRIB,
    p.PRO_CAMPANHA,
    p.PRO_DESTAQUE,
    p.PRO_ATIVO,
    p.PRO_MAISVENDIDO,
    p.PRO_CODMRC,
    m.MED_DESCRICAO,
    m.MED_ABREVIATURA,
    e.EMB_DESCRICAO,
    e.EMB_ABREVIATURA,
    g.GRP_DESCRICAO,
    s.SBG_DESCRICAO,
    r.MRC_DESCRICAO
  FROM TB_PRODUTO p
  LEFT JOIN TB_MEDIDA        m ON m.MED_CODIGO = p.PRO_CODMED
  LEFT JOIN TB_EMBALAGEM     e ON e.EMB_CODIGO = p.PRO_CODEMB
  LEFT JOIN TB_GRUPOS        g ON g.GRP_CODIGO = p.PRO_CODGRP
  LEFT JOIN TB_SUBGRUPOS     s ON s.SBG_CODIGO = p.PRO_CODSBG
  LEFT JOIN TB_MARCA_PRODUTO r ON r.MRC_CODIGO = p.PRO_CODMRC
`;

class ProductRepository {
  /**
   * Lista produtos com paginação e filtros opcionais.
   * Filtros: active, groupId, subgroupId, brandId, search (busca em descrição/código)
   */
  async findAll({ limit = 20, offset = 0, filters = {} } = {}) {
    const conditions = [];
    const params     = [];

    if (filters.active !== undefined) {
      conditions.push('p.PRO_ATIVO = ?');
      params.push(filters.active);
    }
    if (filters.groupId) {
      conditions.push('p.PRO_CODGRP = ?');
      params.push(Number(filters.groupId));
    }
    if (filters.subgroupId) {
      conditions.push('p.PRO_CODSBG = ?');
      params.push(Number(filters.subgroupId));
    }
    if (filters.brandId) {
      conditions.push('p.PRO_CODMRC = ?');
      params.push(Number(filters.brandId));
    }
    if (filters.search) {
      conditions.push(
        '(UPPER(p.PRO_DESCRICAO) CONTAINING UPPER(?) OR UPPER(p.PRO_CODIGOFAB) CONTAINING UPPER(?) OR UPPER(p.PRO_CODIGOBAR) CONTAINING UPPER(?))'
      );
      params.push(filters.search, filters.search, filters.search);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countSql = `SELECT COUNT(*) AS TOTAL FROM TB_PRODUTO p ${where}`;
    const countResult = await query(countSql, params);
    const total = Number(countResult[0]?.TOTAL ?? 0);

    const dataSql = `
      SELECT FIRST ? SKIP ?
        p.PRO_CODIGO,
        p.PRO_CODIGOFAB,
        p.PRO_CODIGOBAR,
        p.PRO_CODIGOFOR,
        p.PRO_DESCRICAO,
        p.PRO_CODMED,
        p.PRO_CODEMB,
        p.PRO_CODGRP,
        p.PRO_CODSBG,
        p.PRO_DIVISOR,
        p.PRO_TIPO,
        p.PRO_LOCAL,
        p.PRO_PESO,
        p.PRO_LARGURA,
        p.PRO_COMPRIMENTO,
        p.PRO_ALTURA,
        p.PRO_SUB_TRIB,
        p.PRO_CAMPANHA,
        p.PRO_DESTAQUE,
        p.PRO_ATIVO,
        p.PRO_MAISVENDIDO,
        p.PRO_CODMRC,
        m.MED_DESCRICAO,
        m.MED_ABREVIATURA,
        e.EMB_DESCRICAO,
        e.EMB_ABREVIATURA,
        g.GRP_DESCRICAO,
        s.SBG_DESCRICAO,
        r.MRC_DESCRICAO
      FROM TB_PRODUTO p
      LEFT JOIN TB_MEDIDA        m ON m.MED_CODIGO = p.PRO_CODMED
      LEFT JOIN TB_EMBALAGEM     e ON e.EMB_CODIGO = p.PRO_CODEMB
      LEFT JOIN TB_GRUPOS        g ON g.GRP_CODIGO = p.PRO_CODGRP
      LEFT JOIN TB_SUBGRUPOS     s ON s.SBG_CODIGO = p.PRO_CODSBG
      LEFT JOIN TB_MARCA_PRODUTO r ON r.MRC_CODIGO = p.PRO_CODMRC
      ${where}
      ORDER BY p.PRO_DESCRICAO ASC
    `;

    const rows = await query(dataSql, [Number(limit), Number(offset), ...params]);
    const data = rows.map((row) => new Product(row));

    return { data, total };
  }

  /** @returns {Promise<Product|null>} */
  async findById(id) {
    const sql = `${BASE_SELECT} WHERE p.PRO_CODIGO = ?`;
    const rows = await query(sql, [Number(id)]);
    if (!rows.length) return null;
    return new Product(rows[0]);
  }

  /** @returns {Promise<Product|null>} */
  async findByCodeBar(codeBar) {
    const sql = `${BASE_SELECT} WHERE UPPER(p.PRO_CODIGOBAR) = UPPER(?)`;
    const rows = await query(sql, [String(codeBar)]);
    if (!rows.length) return null;
    return new Product(rows[0]);
  }
}

module.exports = new ProductRepository();
