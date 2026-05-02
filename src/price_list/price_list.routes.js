'use strict';

const { Router } = require('express');
const ctrl = require('./infrastructure/price_list.controller');
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Price Lists
 *   description: Tabelas de preço (TB_TABELA_PRECO)
 */

/**
 * @swagger
 * /price-lists:
 *   get:
 *     summary: Lista tabelas de preço
 *     tags: [Price Lists]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: active
 *         schema: { type: string, example: "S" }
 *     responses:
 *       200:
 *         description: Lista paginada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/PriceList' }
 *                 meta: { $ref: '#/components/schemas/PaginationMeta' }
 */
router.get('/', ctrl.listPriceLists);

/**
 * @swagger
 * /price-lists/{id}:
 *   get:
 *     summary: Busca tabela de preço por ID
 *     tags: [Price Lists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Tabela encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PriceList' }
 *       404:
 *         description: Não encontrado
 */
router.get('/:id', ctrl.getPriceList);

/**
 * @swagger
 * components:
 *   schemas:
 *     PriceList:
 *       type: object
 *       properties:
 *         id:     { type: integer, example: 1 }
 *         name:   { type: string,  example: "Tabela Varejo" }
 *         active: { type: string,  example: "S" }
 */

module.exports = router;
