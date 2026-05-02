'use strict';

class PaymentType {
  constructor({ FPT_CODIGO, FPT_DESCRICAO }) {
    this.id          = FPT_CODIGO;
    this.description = FPT_DESCRICAO ? FPT_DESCRICAO.trim() : null;
  }

  toJSON() {
    return { id: this.id, description: this.description };
  }
}

module.exports = PaymentType;
