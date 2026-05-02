'use strict';

/**
 * Entidade Product — TB_PRODUTO com dados desnormalizados
 * de TB_MEDIDA, TB_EMBALAGEM, TB_GRUPOS, TB_SUBGRUPOS, TB_MARCA_PRODUTO.
 */
class Product {
  constructor(row) {
    this.id              = row.PRO_CODIGO;
    this.codeFactory     = row.PRO_CODIGOFAB  ? row.PRO_CODIGOFAB.trim()  : null;
    this.codeBar         = row.PRO_CODIGOBAR  ? row.PRO_CODIGOBAR.trim()  : null;
    this.codeSupplier    = row.PRO_CODIGOFOR  ? row.PRO_CODIGOFOR.trim()  : null;
    this.description     = row.PRO_DESCRICAO  ? row.PRO_DESCRICAO.trim()  : null;
    this.type            = row.PRO_TIPO        ? row.PRO_TIPO.trim()        : null;
    this.location        = row.PRO_LOCAL       ? row.PRO_LOCAL.trim()       : null;
    this.weight          = Number(row.PRO_PESO        ?? 0);
    this.width           = Number(row.PRO_LARGURA     ?? 0);
    this.length          = Number(row.PRO_COMPRIMENTO ?? 0);
    this.height          = Number(row.PRO_ALTURA      ?? 0);
    this.divisor         = row.PRO_DIVISOR    ?? null;
    this.taxSubstitution = row.PRO_SUB_TRIB   ? row.PRO_SUB_TRIB.trim()   : null;
    this.campaign        = row.PRO_CAMPANHA   ? row.PRO_CAMPANHA.trim()   : null;
    this.featured        = row.PRO_DESTAQUE   ? row.PRO_DESTAQUE.trim()   : null;
    this.active          = row.PRO_ATIVO      ? row.PRO_ATIVO.trim()      : null;
    this.bestSeller      = row.PRO_MAISVENDIDO ? row.PRO_MAISVENDIDO.trim() : null;

    // Medida
    this.measureId           = row.PRO_CODMED    ?? null;
    this.measureDescription  = row.MED_DESCRICAO  ? row.MED_DESCRICAO.trim()  : null;
    this.measureAbbreviation = row.MED_ABREVIATURA ? row.MED_ABREVIATURA.trim() : null;

    // Embalagem
    this.packagingId           = row.PRO_CODEMB    ?? null;
    this.packagingDescription  = row.EMB_DESCRICAO  ? row.EMB_DESCRICAO.trim()  : null;
    this.packagingAbbreviation = row.EMB_ABREVIATURA ? row.EMB_ABREVIATURA.trim() : null;

    // Grupo
    this.groupId          = row.PRO_CODGRP    ?? null;
    this.groupDescription = row.GRP_DESCRICAO ? row.GRP_DESCRICAO.trim() : null;

    // Subgrupo
    this.subgroupId          = row.PRO_CODSBG    ?? null;
    this.subgroupDescription = row.SBG_DESCRICAO ? row.SBG_DESCRICAO.trim() : null;

    // Marca
    this.brandId          = row.PRO_CODMRC    ?? null;
    this.brandDescription = row.MRC_DESCRICAO ? row.MRC_DESCRICAO.trim() : null;
  }

  toJSON() {
    return {
      id:              this.id,
      codeFactory:     this.codeFactory,
      codeBar:         this.codeBar,
      codeSupplier:    this.codeSupplier,
      description:     this.description,
      type:            this.type,
      location:        this.location,
      weight:          this.weight,
      width:           this.width,
      length:          this.length,
      height:          this.height,
      divisor:         this.divisor,
      taxSubstitution: this.taxSubstitution,
      campaign:        this.campaign,
      featured:        this.featured,
      active:          this.active,
      bestSeller:      this.bestSeller,
      measure: {
        id:           this.measureId,
        description:  this.measureDescription,
        abbreviation: this.measureAbbreviation,
      },
      packaging: {
        id:           this.packagingId,
        description:  this.packagingDescription,
        abbreviation: this.packagingAbbreviation,
      },
      group: {
        id:          this.groupId,
        description: this.groupDescription,
      },
      subgroup: {
        id:          this.subgroupId,
        description: this.subgroupDescription,
      },
      brand: {
        id:          this.brandId,
        description: this.brandDescription,
      },
    };
  }
}

module.exports = Product;
