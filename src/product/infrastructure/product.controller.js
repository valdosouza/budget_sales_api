'use strict';

const productService = require('../application/product.service');

async function listProducts(req, res, next) {
  try {
    const { limit = 20, offset = 0, ...filters } = req.query;
    res.json(await productService.listProducts({ limit: Number(limit), offset: Number(offset), filters }));
  } catch (err) { next(err); }
}

async function getProduct(req, res, next) {
  try {
    res.json(await productService.getProductById(req.params.id));
  } catch (err) { next(err); }
}

async function getProductByCodeBar(req, res, next) {
  try {
    res.json(await productService.getProductByCodeBar(req.params.codeBar));
  } catch (err) { next(err); }
}

module.exports = { listProducts, getProduct, getProductByCodeBar };
