'use strict';

class Customer {
  constructor(row) {
    this.id       = row.EMP_CODIGO;
    this.name     = row.EMP_NOME     ? row.EMP_NOME.trim()     : null;
    this.tradeName = row.EMP_FANTASIA ? row.EMP_FANTASIA.trim() : null;
    this.cnpj     = row.EMP_CNPJ     ? row.EMP_CNPJ.trim()     : null;
    this.person   = row.EMP_PESSOA   ? row.EMP_PESSOA.trim()   : null;
    this.email    = row.EMP_EMAIL    ? row.EMP_EMAIL.trim()    : null;
    this.site     = row.EMP_SITE     ? row.EMP_SITE.trim()     : null;
    this.active   = row.CLI_ATIVO    ? row.CLI_ATIVO.trim()    : null;
  }

  toJSON() {
    return {
      id:        this.id,
      name:      this.name,
      tradeName: this.tradeName,
      cnpj:      this.cnpj,
      person:    this.person,
      email:     this.email,
      site:      this.site,
      active:    this.active,
    };
  }
}

module.exports = Customer;
