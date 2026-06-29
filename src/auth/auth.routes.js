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
 *     security: []
 *     description: |
 *       Autentica um usuario e retorna um token JWT.
 *
 *       **IMPORTANTE:** A senha deve ser enviada **encriptada em MD5**.
 *
 *       Exemplo em JavaScript:
 *       ```javascript
 *       const crypto = require('crypto');
 *       const senhaMD5 = crypto.createHash('md5').update('minhasenha').digest('hex');
 *       ```
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
 *           example: "5f4dcc3b5aa765d61d8327deb882cf99"
 *           description: "Senha do usuario encriptada em MD5 (USU_SENHA). Exemplo: MD5('minhasenha') = '5f4dcc3b5aa765d61d8327deb882cf99'"
 *     LoginSuccess:
 *       type: object
 *       properties:
 *         authenticated:
 *           type: boolean
 *           example: true
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *           description: Token JWT — use no header Authorization Bearer {token}
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
