'use strict';

const { Router } = require('express');
const ctrl = require('./infrastructure/price.controller');
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Prices
 *   description: Preços de venda por tabela (TB_PRECO)
 */

/**
 * @swagger
 * /prices:
 *   get:
 *     summary: Lista preços com paginação e filtros
 *     tags: [Prices]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: priceListId
 *         schema: { type: integer }
 *         description: Filtrar por tabela de preço
 *       - in: query
 *         name: productId
 *         schema: { type: integer }
 *         description: Filtrar por produto
 *     responses:
 *       200:
 *         description: Lista paginada de preços
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Price' }
 *                 meta: { $ref: '#/components/schemas/PaginationMeta' }
 */
router.get('/', ctrl.listPrices);

/**
 * @swagger
 * /prices/product/{productId}:
 *   get:
 *     summary: Retorna todos os preços de um produto (em todas as tabelas)
 *     tags: [Prices]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de preços do produto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Price' }
 */
// IMPORTANTE: /product/:productId deve vir ANTES de /:id para não ser capturado como ID
router.get('/product/:productId', ctrl.getPricesByProduct);

/**
 * @swagger
 * /prices/{id}:
 *   get:
 *     summary: Busca preço por ID
 *     tags: [Prices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Preço encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Price' }
 *       404:
 *         description: Não encontrado
 */
router.get('/:id', ctrl.getPrice);

/**
 * @swagger
 * components:
 *   schemas:
 *     Price:
 *       type: object
 *       properties:
 *         id:            { type: integer, example: 1 }
 *         priceListId:   { type: integer, example: 1, nullable: true }
 *         priceListName: { type: string,  example: "Tabela Varejo", nullable: true }
 *         productId:     { type: integer, example: 200, nullable: true }
 *         productCode:   { type: string,  example: "FAB-001", nullable: true }
 *         productDesc:   { type: string,  example: "Produto Exemplo", nullable: true }
 *         salePrice:     { type: number,  example: 99.90 }
 */

module.exports = router;
