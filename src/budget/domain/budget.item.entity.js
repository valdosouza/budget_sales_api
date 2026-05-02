'use strict';

/**
 * Entidade BudgetItem — espelho de TB_ITENS_CTC.
 */
class BudgetItem {
  constructor({
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
    ICT_SEQUENCIA,
  }) {
    this.id              = ICT_CODIGO;
    this.budgetId        = ICT_CODCTC    ?? null;
    this.type            = ICT_TIPO      ? ICT_TIPO.trim()      : null;
    this.productId       = ICT_CODVCL    ?? null;
    this.description     = ICT_DESCRICAO ? ICT_DESCRICAO.trim() : null;
    this.quantity        = Number(ICT_QTDE     ?? 0);
    this.unitPrice       = Number(ICT_VL_UNIT  ?? 0);
    this.commission      = Number(ICT_AQ_COM   ?? 0);
    this.discountValue   = Number(ICT_VL_DESC  ?? 0);
    this.discountPercent = Number(ICT_AQ_DESC  ?? 0);
    this.stockId         = ICT_CODEST   ?? null;
    this.priceListId     = ICT_CODTPR   ?? null;
    this.costPrice       = Number(ICT_VL_CUSTO ?? 0);
    this.sequence        = ICT_SEQUENCIA ?? null;
  }

  toJSON() {
    return {
      id:              this.id,
      budgetId:        this.budgetId,
      type:            this.type,
      productId:       this.productId,
      description:     this.description,
      quantity:        this.quantity,
      unitPrice:       this.unitPrice,
      commission:      this.commission,
      discountValue:   this.discountValue,
      discountPercent: this.discountPercent,
      stockId:         this.stockId,
      priceListId:     this.priceListId,
      costPrice:       this.costPrice,
      sequence:        this.sequence,
    };
  }
}

module.exports = BudgetItem;
