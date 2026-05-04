'use strict';

/**
 * Entidade Budget — espelho de TB_COTACAO.
 *
 * Converte os nomes de coluna do Firebird (MAIÚSCULO) para
 * propriedades camelCase usadas em toda a camada de aplicação.
 */
class Budget {
  constructor({
    CTC_CODIGO,
    CTC_CODPED,
    CTC_NUMERO,
    CTC_CODUSU,
    CTC_DATA,
    CTC_CODEMP,
    CTC_FANTASIA,
    CTC_CODFPG,
    CTC_PRAZO,
    CTC_QT_PRODUTO,
    CTC_VL_PRODUTO,
    CTC_VL_FRETE,
    CTC_ALIQ_DESCONTO,
    CTC_VL_DESCONTO,
    CTC_VL_COTACAO,
    CTC_CONTATO,
    CTC_VALIDADE,
    CTC_PRZ_ENTREGA,
    CTC_CODVDO,
    CTC_CODMHA,
    CTC_STATUS,
  }) {
    this.id              = CTC_CODIGO;
    this.orderId         = CTC_CODPED;
    this.number          = CTC_NUMERO      ? CTC_NUMERO.trim()      : null;
    this.userId          = CTC_CODUSU;
    this.date            = CTC_DATA;
    this.customerId      = CTC_CODEMP      ?? null;
    this.customerName    = CTC_FANTASIA    ? CTC_FANTASIA.trim()    : null;
    this.paymentTypeId   = CTC_CODFPG      ?? null;
    this.paymentTerms    = CTC_PRAZO       ? CTC_PRAZO.trim()       : null;
    this.quantityProducts = Number(CTC_QT_PRODUTO  ?? 0);
    this.totalProducts   = Number(CTC_VL_PRODUTO   ?? 0);
    this.freight         = Number(CTC_VL_FRETE      ?? 0);
    this.discountPercent = Number(CTC_ALIQ_DESCONTO ?? 0);
    this.discountValue   = Number(CTC_VL_DESCONTO   ?? 0);
    this.total           = Number(CTC_VL_COTACAO    ?? 0);
    this.contact         = CTC_CONTATO    ? CTC_CONTATO.trim()     : null;
    this.validity        = CTC_VALIDADE   ? CTC_VALIDADE.trim()    : null;
    this.deliveryTime    = CTC_PRZ_ENTREGA ? CTC_PRZ_ENTREGA.trim() : null;
    this.salesmanId      = CTC_CODVDO  ?? null;
    this.institutionId   = CTC_CODMHA  ?? null;
    this.status          = CTC_STATUS  ? CTC_STATUS.trim()         : null;
  }

  /**
   * Serializa para o formato de resposta JSON da API.
   */
  toJSON() {
    return {
      id:               this.id,
      orderId:          this.orderId,
      number:           this.number,
      userId:           this.userId,
      date:             this.date,
      customerId:       this.customerId,
      customerName:     this.customerName,
      paymentTypeId:    this.paymentTypeId,
      paymentTerms:     this.paymentTerms,
      quantityProducts: this.quantityProducts,
      totalProducts:    this.totalProducts,
      freight:          this.freight,
      discountPercent:  this.discountPercent,
      discountValue:    this.discountValue,
      total:            this.total,
      contact:          this.contact,
      validity:         this.validity,
      deliveryTime:     this.deliveryTime,
      salesmanId:       this.salesmanId,
      institutionId:    this.institutionId,
      status:           this.status,
    };
  }
}

module.exports = Budget;
