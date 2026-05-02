'use strict';

const { Router } = require('express');
const ctrl = require('./infrastructure/product.controller');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Consulta de produtos (TB_PRODUTO)
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista produtos com paginação e filtros
 *     tags: [Products]
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
 *         description: Filtro por ativo (S/N)
 *       - in: query
 *         name: groupId
 *         schema: { type: integer }
 *       - in: query
 *         name: subgroupId
 *         schema: { type: integer }
 *       - in: query
 *         name: brandId
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Busca por descrição, código de fábrica ou código de barras
 *     responses:
 *       200:
 *         description: Lista paginada de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Product' }
 *                 meta: { $ref: '#/components/schemas/PaginationMeta' }
 */
router.get('/', ctrl.listProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Busca produto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Product' }
 *       404:
 *         description: Não encontrado
 */
router.get('/:id', ctrl.getProduct);

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:              { type: integer, example: 200 }
 *         codeFactory:     { type: string, example: "FAB-001", nullable: true }
 *         codeBar:         { type: string, example: "7891234567890", nullable: true }
 *         codeSupplier:    { type: string, example: "FOR-XYZ", nullable: true }
 *         description:     { type: string, example: "Produto Exemplo" }
 *         type:            { type: string, example: "P", nullable: true }
 *         location:        { type: string, example: "Prateleira A1", nullable: true }
 *         weight:          { type: number, example: 1.5 }
 *         width:           { type: number, example: 10.0 }
 *         length:          { type: number, example: 20.0 }
 *         height:          { type: number, example: 5.0 }
 *         divisor:         { type: integer, nullable: true }
 *         taxSubstitution: { type: string, nullable: true }
 *         campaign:        { type: string, nullable: true }
 *         featured:        { type: string, nullable: true }
 *         active:          { type: string, example: "S" }
 *         bestSeller:      { type: string, nullable: true }
 *         measure:
 *           type: object
 *           properties:
 *             id:           { type: integer, nullable: true }
 *             description:  { type: string, nullable: true }
 *             abbreviation: { type: string, nullable: true }
 *         packaging:
 *           type: object
 *           properties:
 *             id:           { type: integer, nullable: true }
 *             description:  { type: string, nullable: true }
 *             abbreviation: { type: string, nullable: true }
 *         group:
 *           type: object
 *           properties:
 *             id:          { type: integer, nullable: true }
 *             description: { type: string, nullable: true }
 *         subgroup:
 *           type: object
 *           properties:
 *             id:          { type: integer, nullable: true }
 *             description: { type: string, nullable: true }
 *         brand:
 *           type: object
 *           properties:
 *             id:          { type: integer, nullable: true }
 *             description: { type: string, nullable: true }
 */

module.exports = router;
