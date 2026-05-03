'use strict';

class User {
  constructor(row) {
    this.id         = row.USU_CODIGO;
    this.name       = row.USU_NOME   != null ? row.USU_NOME  : null;
    this.login      = row.USU_LOGIN  != null ? row.USU_LOGIN : null;
    this.level      = row.USU_LEVEL  != null ? row.USU_LEVEL : null;
    this.active     = row.USU_ATIVO  != null ? row.USU_ATIVO : null;
    this.salesmanId = row.CLB_CODIGO != null ? row.CLB_CODIGO : null;
  }

  toJSON() {
    return {
      id:         this.id,
      name:       this.name,
      login:      this.login,
      level:      this.level,
      active:     this.active,
      salesmanId: this.salesmanId,
    };
  }
}

module.exports = User;
