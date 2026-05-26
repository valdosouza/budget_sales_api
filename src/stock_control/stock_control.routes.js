'use strict';

const { Router } = require('express');
const ctrl   = require('./infrastructure/stock_control.controller');
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Stock Control
 *   description: Controle de movimentação de estoque (TB_CTRL_ESTOQUE)
 */

/**
 * @swagger
 * /stock-control:
 *   post:
 *     summary: Registra uma movimentação de estoque
 *     description: >
 *       Insere um registro em TB_CTRL_ESTOQUE. Uma trigger no banco atualiza
 *       automaticamente o saldo em TB_ESTOQUE após a inserção.
 *     tags: [Stock Control]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockControlInput'
 *     responses:
 *       201:
 *         description: Movimentação registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockControl'
 *       400:
 *         description: Dados inválidos ou campo obrigatório ausente
 */
router.post('/', ctrl.createStockControl);

/**
 * @swagger
 * components:
 *   schemas:
 *     StockControlInput:
 *       type: object
 *       required:
 *         - terminal
 *         - link
 *         - productId
 *         - stockListId
 *         - quantity
 *         - operation
 *       properties:
 *         terminal:
 *           type: integer
 *           description: Identificador do terminal/estação
 *           example: 1
 *         link:
 *           type: string
 *           maxLength: 1
 *           description: Vínculo (CET_VINCULO)
 *           example: "N"
 *         control:
 *           type: integer
 *           nullable: true
 *           description: Código de controle relacionado (CET_CONTROLE)
 *           example: null
 *         itemControl:
 *           type: integer
 *           nullable: true
 *           description: Item do controle relacionado (CET_ITEM_CTRL)
 *           example: null
 *         stockListId:
 *           type: integer
 *           description: Código do estoque/depósito (CET_CODETS)
 *           example: 1
 *         operation:
 *           type: string
 *           maxLength: 1
 *           description: "Operação: E=Entrada, S=Saída"
 *           example: "E"
 *         productId:
 *           type: integer
 *           description: Código do produto (CET_CODPRO)
 *           example: 200
 *         quantity:
 *           type: number
 *           format: float
 *           description: Quantidade movimentada (CET_QTDE)
 *           example: 10.500
 *         date:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Data da movimentação (CET_DATA). Padrão = hoje.
 *           example: "2026-05-26"
 *         type:
 *           type: string
 *           maxLength: 25
 *           nullable: true
 *           description: Tipo da movimentação (CET_TIPO)
 *           example: "AJUSTE"
 *     StockControl:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 42
 *         terminal:
 *           type: integer
 *           example: 1
 *         link:
 *           type: string
 *           example: "N"
 *         control:
 *           type: integer
 *           nullable: true
 *           example: null
 *         itemControl:
 *           type: integer
 *           nullable: true
 *           example: null
 *         stockListId:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         operation:
 *           type: string
 *           example: "E"
 *         productId:
 *           type: integer
 *           nullable: true
 *           example: 200
 *         quantity:
 *           type: number
 *           example: 10.5
 *         date:
 *           type: string
 *           nullable: true
 *           example: "2026-05-26"
 *         updatedAt:
 *           type: string
 *           nullable: true
 *           example: "2026-05-26T14:30:00.000Z"
 *         type:
 *           type: string
 *           nullable: true
 *           example: "AJUSTE"
 */

module.exports = router;
