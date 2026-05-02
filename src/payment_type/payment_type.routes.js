'use strict';

const { Router } = require('express');
const ctrl = require('./infrastructure/payment_type.controller');
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payment Types
 *   description: Formas de pagamento (TB_FORMAPAGTO)
 */

/**
 * @swagger
 * /payment-types:
 *   get:
 *     summary: Lista formas de pagamento
 *     tags: [Payment Types]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Busca por descrição
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
 *                   items: { $ref: '#/components/schemas/PaymentType' }
 *                 meta: { $ref: '#/components/schemas/PaginationMeta' }
 */
router.get('/', ctrl.listPaymentTypes);

/**
 * @swagger
 * /payment-types/{id}:
 *   get:
 *     summary: Busca forma de pagamento por ID
 *     tags: [Payment Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Forma de pagamento encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PaymentType' }
 *       404:
 *         description: Não encontrado
 */
router.get('/:id', ctrl.getPaymentType);

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentType:
 *       type: object
 *       properties:
 *         id:          { type: integer, example: 1 }
 *         description: { type: string,  example: "Boleto Bancário" }
 */

module.exports = router;
