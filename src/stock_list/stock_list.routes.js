'use strict';

const { Router } = require('express');
const ctrl = require('./infrastructure/stock_list.controller');
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Stock Lists
 *   description: Estoques cadastrados (TB_ESTOQUES)
 */

/**
 * @swagger
 * /stock-lists:
 *   get:
 *     summary: Lista estoques com paginação
 *     tags: [Stock Lists]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: warehouseId
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Lista paginada de estoques
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/StockList' }
 *                 meta: { $ref: '#/components/schemas/PaginationMeta' }
 */
router.get('/', ctrl.listStockLists);

/**
 * @swagger
 * /stock-lists/{id}:
 *   get:
 *     summary: Busca estoque por ID
 *     tags: [Stock Lists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Estoque encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/StockList' }
 *       404:
 *         description: Não encontrado
 */
router.get('/:id', ctrl.getStockList);

/**
 * @swagger
 * components:
 *   schemas:
 *     StockList:
 *       type: object
 *       properties:
 *         id:          { type: integer, example: 1 }
 *         warehouseId: { type: integer, example: 1, nullable: true }
 *         description: { type: string,  example: "Estoque Principal" }
 *         main:        { type: string,  example: "S", nullable: true }
 */

module.exports = router;
