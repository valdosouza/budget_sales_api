'use strict';

const { query, withTransaction, queryInTransaction } = require('../../config/database');
const BudgetItem = require('../domain/budget.item.entity');

class BudgetItemRepository {
  /**
   * Retorna todos os itens de um orçamento, ordenados por sequência.
   * @returns {Promise<BudgetItem[]>}
   */
  async findByBudgetId(budgetId) {
    const sql = `
      SELECT
        ICT_CODIGO,
        ICT_CODCTC,
        ICT_TIPO,
        ICT_CODVCL,
        ICT_DESCRICAO,
        ICT_QTDE,
        ICT_VL_UNIT,
        ICT_AQ_COM,
        ICT_VL_DESC,
        ICT_AQ_DESC,
        ICT_CODEST,
        ICT_CODTPR,
        ICT_VL_CUSTO,
        ICT_SEQUENCIA
      FROM TB_ITENS_CTC
      WHERE ICT_CODCTC = ?
      ORDER BY ICT_SEQUENCIA ASC, ICT_CODIGO ASC
    `;
    const rows = await query(sql, [Number(budgetId)]);
    return rows.map((row) => new BudgetItem(row));
  }

  /**
   * Busca um item pelo seu ID.
   * @returns {Promise<BudgetItem|null>}
   */
  async findById(id) {
    const sql = `
      SELECT
        ICT_CODIGO,
        ICT_CODCTC,
        ICT_TIPO,
        ICT_CODVCL,
        ICT_DESCRICAO,
        ICT_QTDE,
        ICT_VL_UNIT,
        ICT_AQ_COM,
        ICT_VL_DESC,
        ICT_AQ_DESC,
        ICT_CODEST,
        ICT_CODTPR,
        ICT_VL_CUSTO,
        ICT_SEQUENCIA
      FROM TB_ITENS_CTC
      WHERE ICT_CODIGO = ?
    `;
    const rows = await query(sql, [Number(id)]);
    if (!rows.length) return null;
    return new BudgetItem(rows[0]);
  }

  /**
   * Retorna o próximo ICT_CODIGO disponível (MAX + 1), dentro de uma transação.
   */
  async #nextCodigo(trx) {
    const rows = await queryInTransaction(trx, 'SELECT MAX(ICT_CODIGO) AS MAX_ID FROM TB_ITENS_CTC');
    return (Number(rows[0].MAX_ID) || 0) + 1;
  }

  /**
   * Insere um novo item de orçamento.
   * @returns {Promise<BudgetItem>}
   */
  async create(data) {
    let newId;

    await withTransaction(async (trx) => {
      newId = await this.#nextCodigo(trx);

      await queryInTransaction(trx, `
        INSERT INTO TB_ITENS_CTC (
          ICT_CODIGO, ICT_CODCTC, ICT_TIPO, ICT_CODVCL, ICT_DESCRICAO,
          ICT_QTDE, ICT_VL_UNIT, ICT_AQ_COM, ICT_VL_DESC, ICT_AQ_DESC,
          ICT_CODEST, ICT_CODTPR, ICT_VL_CUSTO, ICT_SEQUENCIA
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?
        )
      `, [
        newId,
        data.budgetId,
        data.type            ?? null,
        data.productId       ?? null,
        data.description     ?? null,
        data.quantity        ?? 0,
        data.unitPrice       ?? 0,
        data.commission      ?? 0,
        data.discountValue   ?? 0,
        data.discountPercent ?? 0,
        data.stockId         ?? null,
        data.priceListId     ?? null,
        data.costPrice       ?? 0,
        data.sequence        ?? null,
      ]);
    });

    return this.findById(newId);
  }

  /**
   * Atualiza um item de orçamento.
   * @returns {Promise<BudgetItem>}
   */
  async update(id, data) {
    const fields = [];
    const params = [];

    const map = {
      budgetId:        'ICT_CODCTC',
      type:            'ICT_TIPO',
      productId:       'ICT_CODVCL',
      description:     'ICT_DESCRICAO',
      quantity:        'ICT_QTDE',
      unitPrice:       'ICT_VL_UNIT',
      commission:      'ICT_AQ_COM',
      discountValue:   'ICT_VL_DESC',
      discountPercent: 'ICT_AQ_DESC',
      stockId:         'ICT_CODEST',
      priceListId:     'ICT_CODTPR',
      costPrice:       'ICT_VL_CUSTO',
      sequence:        'ICT_SEQUENCIA',
    };

    for (const [jsKey, dbCol] of Object.entries(map)) {
      if (data[jsKey] !== undefined) {
        fields.push(`${dbCol} = ?`);
        params.push(data[jsKey]);
      }
    }

    if (!fields.length) {
      return this.findById(id);
    }

    params.push(Number(id));
    await query(`UPDATE TB_ITENS_CTC SET ${fields.join(', ')} WHERE ICT_CODIGO = ?`, params);

    return this.findById(id);
  }

  /**
   * Remove um item de orçamento.
   * @returns {Promise<void>}
   */
  async delete(id) {
    await query('DELETE FROM TB_ITENS_CTC WHERE ICT_CODIGO = ?', [Number(id)]);
  }

  /**
   * Remove todos os itens de um orçamento (útil para deleção em cascata).
   * @returns {Promise<void>}
   */
  async deleteByBudgetId(budgetId) {
    await query('DELETE FROM TB_ITENS_CTC WHERE ICT_CODCTC = ?', [Number(budgetId)]);
  }
}

module.exports = new BudgetItemRepository();
