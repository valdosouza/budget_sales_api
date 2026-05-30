'use strict';

/**
 * Entity: Institution (TB_EMPRESA)
 * Representa um estabelecimento/empresa do sistema
 */
class Institution {
  constructor(id, fantasyName, cnpj) {
    this.id = id;                    // EMP_CODIGO
    this.fantasyName = fantasyName;  // EMP_FANTASIA
    this.cnpj = cnpj;                // EMP_CNPJ
  }
}

module.exports = Institution;
