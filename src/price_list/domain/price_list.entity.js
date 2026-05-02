'use strict';

class PriceList {
  constructor({ TPR_CODIGO, TPR_NOME, TPR_ATIVA }) {
    this.id     = TPR_CODIGO;
    this.name   = TPR_NOME  ? TPR_NOME.trim()  : null;
    this.active = TPR_ATIVA ? TPR_ATIVA.trim() : null;
  }

  toJSON() {
    return { id: this.id, name: this.name, active: this.active };
  }
}

module.exports = PriceList;
