'use strict';

const { Router } = require('express');
const ctrl = require('./infrastructure/salesman.controller');
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Salesmen
 *   description: Colaboradores/Vendedores (TB_COLABORADOR + TB_CARGO)
 */

/**
 * @swagger
 * /salesmen:
 *   get:
 *     summary: Lista colaboradores com paginação e filtros
 *     tags: [Salesmen]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: active
 *         schema: { type: boolean }
 *         description: true = sem demissão, false = com demissão
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Busca por nome
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
 *                   items: { $ref: '#/components/schemas/Salesman' }
 *                 meta: { $ref: '#/components/schemas/PaginationMeta' }
 */
router.get('/', ctrl.listSalesmen);

/**
 * @swagger
 * /salesmen/{id}:
 *   get:
 *     summary: Busca colaborador por ID
 *     tags: [Salesmen]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Colaborador encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Salesman' }
 *       404:
 *         description: Não encontrado
 */
router.get('/:id', ctrl.getSalesman);

/**
 * @swagger
 * components:
 *   schemas:
 *     Salesman:
 *       type: object
 *       properties:
 *         id:            { type: integer, example: 7 }
 *         name:          { type: string,  example: "Carlos Vendedor" }
 *         admissionDate: { type: string,  format: date, example: "2020-01-15" }
 *         dismissalDate: { type: string,  format: date, nullable: true }
 *         active:        { type: boolean, example: true }
 *         role:
 *           type: object
 *           properties:
 *             id:          { type: integer, nullable: true }
 *             description: { type: string,  nullable: true, example: "Vendedor" }
 */

module.exports = router;
