'use strict';

const { query } = require('../../config/database');

class PermissionRepository {
  async check({ userId, menu, kind, situation }) {
    const BASE_SQL = `
      SELECT DISTINCT OPF.OPF_CODIGO
      FROM TB_INTERFACE IFC
        INNER JOIN TB_ITENS_IFC IIF      ON IIF.IIF_CODIFC = IFC.IFC_CODIGO
        INNER JOIN TB_PERMISSAO PER      ON PER.PER_CODIIF  = IIF.IIF_CODIGO
        INNER JOIN TB_OPER_INTERFACE OPF ON OPF.OPF_CODIGO  = IIF.IIF_CODOPF
      WHERE IFC.IFC_SISTEMA       = 'S'
        AND PER.PER_CODUSU        = ?
        AND OPF.OPF_DESCRICAO     = ?
    `;

    const filterByMenu = situation === 'S';
    const sql    = filterByMenu
      ? BASE_SQL + ' AND (IFC.IFC_DESCRICAO = ? OR IFC.IFC_FR_NAME = ?)'
      : BASE_SQL;
    const params = filterByMenu
      ? [Number(userId), kind, menu, menu]
      : [Number(userId), kind];

    const rows = await query(sql, params);
    return rows.length > 0;
  }
}

module.exports = new PermissionRepository();
