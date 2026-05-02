'use strict';

const { Router } = require('express');
const ctrl = require('./infrastructure/customer.controller');
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Clientes (TB_CLIENTE + TB_EMPRESA)
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Lista clientes com paginação e filtros
 *     tags: [Customers]
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
 *         description: Filtrar por ativo (S/N)
 *       - in: query
 *         name: person
 *         schema: { type: string, example: "J" }
 *         description: Tipo de pessoa — J (Jurídica) ou F (Física)
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Busca por nome, fantasia ou CNPJ
 *     responses:
 *       200:
 *         description: Lista paginada de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Customer' }
 *                 meta: { $ref: '#/components/schemas/PaginationMeta' }
 */
router.get('/', ctrl.listCustomers);

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Busca cliente por ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Customer' }
 *       404:
 *         description: Não encontrado
 */
router.get('/:id', ctrl.getCustomer);

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         id:        { type: integer, example: 42 }
 *         name:      { type: string,  example: "Empresa Exemplo S.A." }
 *         tradeName: { type: string,  example: "Exemplo", nullable: true }
 *         cnpj:      { type: string,  example: "00000000000100", nullable: true }
 *         person:    { type: string,  example: "J", nullable: true }
 *         email:     { type: string,  example: "contato@exemplo.com.br", nullable: true }
 *         site:      { type: string,  example: "www.exemplo.com.br", nullable: true }
 *         active:    { type: string,  example: "S", nullable: true }
 */

module.exports = router;
