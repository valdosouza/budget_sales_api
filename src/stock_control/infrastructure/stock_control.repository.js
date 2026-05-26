'use strict';

const { query, withTransaction, queryInTransaction } = require('../../config/database');
const StockControl = require('../domain/stock_control.entity');

class StockControlRepository {
  async findById(id, terminal) {
    const rows = await query(
      `SELECT CET_CODIGO, CET_TERMINAL, CET_VINCULO, CET_CONTROLE, CET_ITEM_CTRL,
              CET_CODETS, CET_OPERACAO, CET_CODPRO, CET_QTDE, CET_DATA, UPDATE_AT, CET_TIPO
       FROM TB_CTRL_ESTOQUE
       WHERE CET_CODIGO = ? AND CET_TERMINAL = ?`,
      [Number(id), Number(terminal)]
    );
    if (!rows.length) return null;
    return new StockControl(rows[0]);
  }

  async create(data) {
    const genRows = await query(
      'SELECT GEN_ID(GN_CTRL_ESTOQUE, 1) AS NEW_ID FROM RDB$DATABASE'
    );
    const newId = genRows[0].NEW_ID;

    await withTransaction(async (trx) => {
      await queryInTransaction(trx,
        `INSERT INTO TB_CTRL_ESTOQUE (
          CET_CODIGO, CET_TERMINAL, CET_VINCULO, CET_CONTROLE, CET_ITEM_CTRL,
          CET_CODETS, CET_OPERACAO, CET_CODPRO, CET_QTDE, CET_DATA, UPDATE_AT, CET_TIPO
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
        [
          newId,
          Number(data.terminal),
          data.link,
          data.control     ?? null,
          data.itemControl ?? null,
          data.stockListId ?? null,
          data.operation   ?? null,
          data.productId   ?? null,
          data.quantity    ?? null,
          data.date        ?? null,
          data.type        ?? null,
        ]
      );
    });

    return this.findById(newId, data.terminal);
  }
}

module.exports = new StockControlRepository();
