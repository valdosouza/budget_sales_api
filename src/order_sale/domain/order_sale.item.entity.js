'use strict';

/**
 * Entidade OrderSaleItem — espelho de TB_ITENS_NFL.
 * Mapeada a partir do modelo Delphi TItensNFL (tblItensnfl.pas).
 */
class OrderSaleItem {
  constructor(row) {
    this.id            = row.ITF_CODIGO;
    this.sequence      = row.ITF_SEQUENCIA   ?? null;
    this.orderId       = row.ITF_CODPED      ?? null;
    this.invoiceId     = row.ITF_CODNFL      ?? 0;
    this.productId     = row.ITF_CODPRO      ?? null;
    this.quantity      = Number(row.ITF_QTDE     ?? 0);
    this.costPrice     = Number(row.ITF_VL_CUSTO ?? 0);
    this.unitPrice     = Number(row.ITF_VL_UNIT  ?? 0);
    this.discount      = Number(row.ITF_VL_DESC  ?? 0);
    this.discountPct   = Number(row.ITF_AQ_DESC  ?? 0);
    this.commission    = Number(row.ITF_AQ_COM   ?? 0);
    this.ipiPct        = Number(row.ITF_AQ_IPI   ?? 0);
    this.icmsPct       = Number(row.ITF_AQ_ICMS  ?? 0);
    this.dispatch      = row.ITF_DESPACHO    ? row.ITF_DESPACHO.trim()  : 'S';
    this.stock         = row.ITF_ESTOQUE     ? row.ITF_ESTOQUE.trim()   : 'S';
    this.operation     = row.ITF_OPER        ? row.ITF_OPER.trim()      : 'V';
    this.stockListId   = row.ITF_CODEST      ?? null;
    this.priceListId   = row.ITF_CODTPR      ?? null;
  }

  toJSON() {
    return {
      id:          this.id,
      sequence:    this.sequence,
      orderId:     this.orderId,
      invoiceId:   this.invoiceId,
      productId:   this.productId,
      quantity:    this.quantity,
      costPrice:   this.costPrice,
      unitPrice:   this.unitPrice,
      discount:    this.discount,
      discountPct: this.discountPct,
      commission:  this.commission,
      ipiPct:      this.ipiPct,
      icmsPct:     this.icmsPct,
      dispatch:    this.dispatch,
      stock:       this.stock,
      operation:   this.operation,
      stockListId: this.stockListId,
      priceListId: this.priceListId,
    };
  }
}

module.exports = OrderSaleItem;
