'use strict';

const { Router } = require('express');
const ctrl   = require('./infrastructure/auth.controller');
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticacao de usuarios (TB_USUARIO)
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuario pelo login e senha
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Autenticacao bem-sucedida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginSuccess'
 *       400:
 *         description: Campos obrigatorios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Credenciais invalidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginFailure'
 */
router.post('/login', ctrl.login);

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required:
 *         - login
 *         - senha
 *       properties:
 *         login:
 *           type: string
 *           example: "admin"
 *           description: Login do usuario (USU_LOGIN)
 *         senha:
 *           type: string
 *           example: "minhasenha"
 *           description: Senha do usuario (USU_SENHA)
 *     LoginSuccess:
 *       type: object
 *       properties:
 *         authenticated:
 *           type: boolean
 *           example: true
 *         user:
 *           $ref: '#/components/schemas/AuthUser'
 *     LoginFailure:
 *       type: object
 *       properties:
 *         authenticated:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: "Credenciais invalidas."
 *     AuthUser:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *           description: Codigo do usuario (USU_CODIGO)
 *         name:
 *           type: string
 *           example: "Administrador"
 *         login:
 *           type: string
 *           example: "admin"
 *         level:
 *           type: string
 *           example: "A"
 *         active:
 *           type: string
 *           example: "S"
 *         salesmanId:
 *           type: integer
 *           nullable: true
 *           example: 10
 *           description: Codigo do vendedor vinculado (CLB_CODIGO de TB_COLABORADOR)
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Os campos login e senha sao obrigatorios."
 */

module.exports = router;
