'use strict';

class StockControl {
  constructor(row) {
    this.id          = row.CET_CODIGO;
    this.terminal    = row.CET_TERMINAL;
    this.link        = row.CET_VINCULO   ? row.CET_VINCULO.trim()  : null;
    this.control     = row.CET_CONTROLE  ?? null;
    this.itemControl = row.CET_ITEM_CTRL ?? null;
    this.stockListId = row.CET_CODETS    ?? null;
    this.operation   = row.CET_OPERACAO  ? row.CET_OPERACAO.trim() : null;
    this.productId   = row.CET_CODPRO    ?? null;
    this.quantity    = Number(row.CET_QTDE ?? 0);
    this.date        = row.CET_DATA      ?? null;
    this.updatedAt   = row.UPDATE_AT     ?? null;
    this.type        = row.CET_TIPO      ? row.CET_TIPO.trim()     : null;
  }

  toJSON() {
    return {
      id:          this.id,
      terminal:    this.terminal,
      link:        this.link,
      control:     this.control,
      itemControl: this.itemControl,
      stockListId: this.stockListId,
      operation:   this.operation,
      productId:   this.productId,
      quantity:    this.quantity,
      date:        this.date,
      updatedAt:   this.updatedAt,
      type:        this.type,
    };
  }
}

module.exports = StockControl;
