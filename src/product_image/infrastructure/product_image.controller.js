'use strict';

const productImageService = require('../application/product_image.service');

/**
 * Mapa de extensão → MIME type para servir o binário com o content-type correto.
 */
const MIME_TYPES = {
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  gif:  'image/gif',
  bmp:  'image/bmp',
  webp: 'image/webp',
  svg:  'image/svg+xml',
};

/**
 * GET /product-images/product/:productId
 * Lista imagens (metadados) de um produto com paginação.
 */
async function listByProduct(req, res, next) {
  try {
    const { productId } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    res.json(
      await productImageService.listByProduct(productId, {
        limit:  Number(limit),
        offset: Number(offset),
      })
    );
  } catch (err) { next(err); }
}

/**
 * GET /product-images/:id
 * Retorna metadados de uma imagem específica.
 */
async function getImage(req, res, next) {
  try {
    res.json(await productImageService.getImageById(req.params.id));
  } catch (err) { next(err); }
}

/**
 * GET /product-images/:id/content
 * Serve o binário (BLOB) da imagem com o content-type correto.
 */
async function getImageContent(req, res, next) {
  try {
    const { content, extension } = await productImageService.getImageContent(req.params.id);
    const mimeType = MIME_TYPES[(extension || '').toLowerCase()] || 'application/octet-stream';
    res.set('Content-Type', mimeType);
    res.send(content);
  } catch (err) { next(err); }
}

module.exports = { listByProduct, getImage, getImageContent };
