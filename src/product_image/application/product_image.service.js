'use strict';

const productImageRepository = require('../infrastructure/product_image.repository');

function notFound(id) {
  const err = new Error(`Imagem #${id} não encontrada.`);
  err.status = 404;
  return err;
}

/**
 * Lista imagens de um produto com paginação.
 */
async function listByProduct(productId, { limit = 20, offset = 0 } = {}) {
  const parsedLimit  = Math.min(Math.max(Number(limit),  1), 100);
  const parsedOffset = Math.max(Number(offset), 0);

  const { data, total } = await productImageRepository.findByProductId(
    productId,
    { limit: parsedLimit, offset: parsedOffset }
  );

  return {
    data: data.map((img) => img.toJSON()),
    meta: { total, limit: parsedLimit, offset: parsedOffset },
  };
}

/**
 * Retorna metadados de uma imagem específica.
 */
async function getImageById(id) {
  const image = await productImageRepository.findById(id);
  if (!image) throw notFound(id);
  return image.toJSON();
}

/**
 * Retorna o conteúdo binário (BLOB) de uma imagem.
 * Lança 404 se a imagem não existir ou não possuir conteúdo.
 */
async function getImageContent(id) {
  const result = await productImageRepository.findContentById(id);
  if (!result || !result.content) {
    const err = new Error(`Conteúdo binário da imagem #${id} não encontrado.`);
    err.status = 404;
    throw err;
  }
  return result;
}

module.exports = { listByProduct, getImageById, getImageContent };
