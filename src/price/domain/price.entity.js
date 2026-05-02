'use strict';

class Price {
  constructor(row) {
    this.id             = row.PRC_CODIGO;
    this.priceListId    = row.PRC_CODTPR ?? null;
    this.priceListName  = row.TPR_NOME   ? row.TPR_NOME.trim() : null;
    this.productId      = row.PRC_CODPRO ?? null;
    this.productCode    = row.PRO_CODIGOFAB ? row.PRO_CODIGOFAB.trim() : null;
    this.productDesc    = row.PRO_DESCRICAO ? row.PRO_DESCRICAO.trim() : null;
    this.salePrice      = Number(row.PRC_VL_VDA ?? 0);
  }

  toJSON() {
    return {
      id:            this.id,
      priceListId:   this.priceListId,
      priceListName: this.priceListName,
      productId:     this.productId,
      productCode:   this.productCode,
      productDesc:   this.productDesc,
      salePrice:     this.salePrice,
    };
  }
}

module.exports = Price;
