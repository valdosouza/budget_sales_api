'use strict';

const { Router } = require('express');
const ctrl   = require('./infrastructure/auth.controller');
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação de usuários (TB_USUARIO)
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário pelo login e senha
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginSuccess'
 *       400:
 *         description: Campos obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Credenciais inválidas
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
 *           description: Login do usuário (USU_LOGIN)
 *         senha:
 *           type: string
 *           example: "minhasenha"
 *           description: Senha do usuário (USU_SENHA)
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
 *           example: "Credenciais inválidas."
 *     AuthUser:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
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
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Os campos \"login\" e \"senha\" são obrigatórios."
 */

module.exports = router;
