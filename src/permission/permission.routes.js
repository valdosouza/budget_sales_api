'use strict';

const { Router } = require('express');
const ctrl   = require('./infrastructure/permission.controller');
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Permission
 *   description: Validação de permissões do sistema ERP
 */

/**
 * @swagger
 * /permission/check:
 *   post:
 *     summary: Verifica se o usuário tem permissão para uma operação
 *     description: Verifica se o usuário tem permissão para realizar uma operação específica, com ou sem filtro por menu, dependendo da situação informada.
 *     tags: [Permission]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PermissionCheckInput'
 *           examples:
 *             ComFiltroMenu:
 *               summary: Verificação com filtro por menu (situation=S)
 *               value:
 *                 userId: 5
 *                 userLevel: 0
 *                 menu: "FrEstoqueManual"
 *                 kind: "Incluir"
 *                 situation: "S"
 *             SemFiltroMenu:
 *               summary: Verificação sem filtro por menu (situation=N)
 *               value:
 *                 userId: 5
 *                 userLevel: 0
 *                 menu: ""
 *                 kind: "Consultar"
 *                 situation: "N"
 *     responses:
 *       200:
 *         description: Resultado da verificação de permissão
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermissionCheckResult'
 *       400:
 *         description: Campo obrigatório ausente
 */
router.post('/check', ctrl.checkPermission);

/**
 * @swagger
 * components:
 *   schemas:
 *     PermissionCheckInput:
 *       type: object
 *       required:
 *         - userId
 *         - userLevel
 *         - kind
 *         - situation
 *       properties:
 *         userId:
 *           type: integer
 *           description: ID do usuário (USU_CODIGO / PER_CODUSU)
 *           example: 5
 *         userLevel:
 *           type: integer
 *           description: "Nível do usuário (Gb_Nivel do Delphi). 0 = usuário comum, != 0 = administrador"
 *           example: 0
 *         menu:
 *           type: string
 *           description: >
 *             Nome do menu/form (IFC_DESCRICAO ou IFC_FR_NAME).
 *             Usado apenas quando situation='S'.
 *           example: "FrEstoqueManual"
 *         kind:
 *           type: string
 *           description: Tipo de operação a verificar (OPF_DESCRICAO), ex. Incluir, Consultar, Editar
 *           example: "Incluir"
 *         situation:
 *           type: string
 *           maxLength: 1
 *           description: "'S' para filtrar por menu, 'N' para verificar apenas pelo tipo de operação"
 *           example: "S"
 *     PermissionCheckResult:
 *       type: object
 *       properties:
 *         result:
 *           type: boolean
 *           description: true se o usuário tem permissão, false caso contrário
 *           example: true
 */

module.exports = router;
