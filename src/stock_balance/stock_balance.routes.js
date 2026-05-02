'use strict';

const { Router } = require('express');
const ctrl = require('./infrastructure/stock_balance.controller');
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Stock Balance
 *   description: Saldo de estoque por produto/depósito (TB_ESTOQUE)
 */

/**
 * @swagger
 * /stock:
 *   get:
 *     summary: Lista saldos de estoque com paginação e filtros
 *     tags: [Stock Balance]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: stockListId
 *         schema: { type: integer }
 *         description: Filtrar por depósito/estoque
 *       - in: query
 *         name: productId
 *         schema: { type: integer }
 *         description: Filtrar por produto
 *     responses:
 *       200:
 *         description: Lista paginada de saldos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/StockBalance' }
 *                 meta: { $ref: '#/components/schemas/PaginationMeta' }
 */
router.get('/', ctrl.listStockBalances);

/**
 * @swagger
 * /stock/product/{productId}:
 *   get:
 *     summary: Retorna saldo de um produto em todos os depósitos
 *     tags: [Stock Balance]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista de saldos por depósito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/StockBalance' }
 */
// IMPORTANTE: /product/:productId deve vir ANTES de /:id para não ser capturado como ID
router.get('/product/:productId', ctrl.getStockByProduct);

/**
 * @swagger
 * /stock/{id}:
 *   get:
 *     summary: Busca saldo de estoque por ID
 *     tags: [Stock Balance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Saldo encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/StockBalance' }
 *       404:
 *         description: Não encontrado
 */
router.get('/:id', ctrl.getStockBalance);

/**
 * @swagger
 * components:
 *   schemas:
 *     StockBalance:
 *       type: object
 *       properties:
 *         id:            { type: integer, example: 1 }
 *         stockListId:   { type: integer, example: 1, nullable: true }
 *         stockListDesc: { type: string,  example: "Estoque Principal", nullable: true }
 *         productId:     { type: integer, example: 200, nullable: true }
 *         productCode:   { type: string,  example: "FAB-001", nullable: true }
 *         productDesc:   { type: string,  example: "Produto Exemplo", nullable: true }
 *         quantity:      { type: number,  example: 150.0 }
 */

module.exports = router;
