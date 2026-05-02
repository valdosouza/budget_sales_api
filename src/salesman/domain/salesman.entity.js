'use strict';

class Salesman {
  constructor(row) {
    this.id              = row.CLB_CODIGO;
    this.name            = row.CLB_NOME      ? row.CLB_NOME.trim()      : null;
    this.admissionDate   = row.CLB_ADMISSAO  ?? null;
    this.dismissalDate   = row.CLB_DEMISSAO  ?? null;
    this.roleId          = row.CLB_CODCRG    ?? null;
    this.roleDescription = row.CRG_DESCRICAO ? row.CRG_DESCRICAO.trim() : null;
    // Considera ativo quando não há data de demissão
    this.active          = !row.CLB_DEMISSAO;
  }

  toJSON() {
    return {
      id:              this.id,
      name:            this.name,
      admissionDate:   this.admissionDate,
      dismissalDate:   this.dismissalDate,
      active:          this.active,
      role: {
        id:          this.roleId,
        description: this.roleDescription,
      },
    };
  }
}

module.exports = Salesman;
