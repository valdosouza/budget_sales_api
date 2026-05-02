'use strict';

class StockList {
  constructor({ ETS_CODIGO, ETS_CODMHA, ETS_DESCRICAO, ETS_PRINCIPAL }) {
    this.id          = ETS_CODIGO;
    this.warehouseId = ETS_CODMHA   ?? null;
    this.description = ETS_DESCRICAO ? ETS_DESCRICAO.trim() : null;
    this.main        = ETS_PRINCIPAL ? ETS_PRINCIPAL.trim() : null;
  }

  toJSON() {
    return {
      id:          this.id,
      warehouseId: this.warehouseId,
      description: this.description,
      main:        this.main,
    };
  }
}

module.exports = StockList;
