'use strict';

/**
 * Entidade ProductImage - TB_IMAGES
 * Representa uma imagem vinculada a um produto (TABLE_ID -> TB_PRODUTO.PRO_CODIGO).
 *
 * contentBase64: populado pelo repository apos leitura do BLOB.
 * Uso no front-end: <img src={dataUri} /> ou new Image(contentBase64)
 */
class ProductImage {
  constructor(row) {
    this.id            = row.ID;
    this.institutionId = row.TB_INSTITUTION_ID;
    this.kind          = row.KIND      ? row.KIND.trim()      : null;
    this.target        = row.TARGET    ? row.TARGET.trim()    : null;
    this.productId     = row.TABLE_ID  != null ? row.TABLE_ID : null;
    this.fileName      = row.FILE_NAME ? row.FILE_NAME.trim() : null;
    this.extension     = row.EXTENSION ? row.EXTENSION.trim() : null;
    this.link          = row.LINK      ? row.LINK.trim()      : null;
    this.contentBase64 = null;
  }

  get dataUri() {
    if (!this.contentBase64) return null;
    var ext  = (this.extension || '').toLowerCase();
    var mime = ProductImage.MIME_MAP[ext] || 'application/octet-stream';
    return 'data:' + mime + ';base64,' + this.contentBase64;
  }

  toJSON() {
    return {
      id:            this.id,
      institutionId: this.institutionId,
      kind:          this.kind,
      target:        this.target,
      productId:     this.productId,
      fileName:      this.fileName,
      extension:     this.extension,
      link:          this.link,
      contentBase64: this.contentBase64,
      dataUri:       this.dataUri,
    };
  }
}

ProductImage.MIME_MAP = {
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  gif:  'image/gif',
  bmp:  'image/bmp',
  webp: 'image/webp',
  svg:  'image/svg+xml',
};

module.exports = ProductImage;
