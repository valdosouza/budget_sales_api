'use strict';

const productRepository = require('../infrastructure/product.repository');

function notFound(id) {
  const err = new Error(`Produto #${id} não encontrado.`);
  err.status = 404;
  return err;
}

async function listProducts({ limit = 20, offset = 0, filters = {} } = {}) {
  const parsedLimit  = Math.min(Math.max(Number(limit),  1), 100);
  const parsedOffset = Math.max(Number(offset), 0);

  const { data, total } = await productRepository.findAll({
    limit:   parsedLimit,
    offset:  parsedOffset,
    filters,
  });

  return {
    data: data.map((p) => p.toJSON()),
    meta: { total, limit: parsedLimit, offset: parsedOffset },
  };
}

async function getProductById(id) {
  const product = await productRepository.findById(id);
  if (!product) throw notFound(id);
  return product.toJSON();
}

async function getProductByCodeBar(codeBar) {
  const product = await productRepository.findByCodeBar(codeBar);
  if (!product) {
    const err = new Error(`Produto com código de barras "${codeBar}" não encontrado.`);
    err.status = 404;
    throw err;
  }
  return product.toJSON();
}

module.exports = { listProducts, getProductById, getProductByCodeBar };
