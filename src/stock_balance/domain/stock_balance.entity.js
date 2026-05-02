'use strict';

class StockBalance {
  constructor(row) {
    this.id              = row.EST_CODIGO;
    this.stockListId     = row.EST_CODETS     ?? null;
    this.stockListDesc   = row.ETS_DESCRICAO  ? row.ETS_DESCRICAO.trim()  : null;
    this.productId       = row.EST_CODPRO     ?? null;
    this.productCode     = row.PRO_CODIGOFAB  ? row.PRO_CODIGOFAB.trim()  : null;
    this.productDesc     = row.PRO_DESCRICAO  ? row.PRO_DESCRICAO.trim()  : null;
    this.quantity        = Number(row.EST_QTDE ?? 0);
  }

  toJSON() {
    return {
      id:            this.id,
      stockListId:   this.stockListId,
      stockListDesc: this.stockListDesc,
      productId:     this.productId,
      productCode:   this.productCode,
      productDesc:   this.productDesc,
      quantity:      this.quantity,
    };
  }
}

module.exports = StockBalance;
