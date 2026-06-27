'use strict';

const { Router } = require('express');
const InstitutionRepository = require('./infrastructure/institution.repository');
const InstitutionService = require('./application/institution.service');
const InstitutionController = require('./infrastructure/institution.controller');

const router = Router();

// Dependency Injection
const repository = new InstitutionRepository();
const service = new InstitutionService(repository);
const controller = new InstitutionController(service);

/**
 * @swagger
 * tags:
 *   name: Institutions
 *   description: Endpoints para gerenciar instituições - Minha Empresa
 */

/**
 * @swagger
 * /institutions:
 *   get:
 *     summary: Lista simples de instituições disponíveis
 *     description: Retorna apenas código, fantasia e CNPJ das instituições ativas para seleção inicial
 *     tags: [Institutions]
 *     responses:
 *       200:
 *         description: Lista de instituições disponíveis
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Código da empresa (EMP_CODIGO)
 *                     example: 1
 *                   fantasyName:
 *                     type: string
 *                     description: Nome fantasia (EMP_FANTASIA)
 *                     example: "Filial São Paulo"
 *                   cnpj:
 *                     type: string
 *                     description: CNPJ da empresa (EMP_CNPJ)
 *                     example: "12345678000199"
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', controller.getSimpleList.bind(controller));

module.exports = router;
