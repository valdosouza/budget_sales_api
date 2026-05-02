'use strict';

class User {
  constructor(row) {
    this.id     = row.USU_CODIGO;
    this.name   = row.USU_NOME   ?? null;
    this.login  = row.USU_LOGIN  ?? null;
    this.level  = row.USU_LEVEL  ?? null;
    this.active = row.USU_ATIVO  ?? null;
  }
}

module.exports = User;
