'use strict';

const { Router } = require('express');
const ctrl = require('./infrastructure/product_image.controller');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ProductImages
 *   description: Consulta de imagens de produtos (TB_IMAGES)
 */

/**
 * @swagger
 * /product-images/product/{productId}:
 *   get:
 *     summary: Lista imagens de um produto com contentBase64 e dataUri
 *     tags: [ProductImages]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0 }
 *     responses:
 *       200:
 *         description: Lista paginada de imagens do produto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/ProductImage' }
 *                 meta: { $ref: '#/components/schemas/PaginationMeta' }
 */
router.get('/product/:productId', ctrl.listByProduct);

/**
 * @swagger
 * /product-images/{id}:
 *   get:
 *     summary: Retorna metadados e conteudo base64 de uma imagem
 *     tags: [ProductImages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Imagem encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ProductImage' }
 *       404:
 *         description: Nao encontrada
 */
router.get('/:id', ctrl.getImage);

/**
 * @swagger
 * /product-images/{id}/content:
 *   get:
 *     summary: Retorna o binario da imagem com content-type correto
 *     tags: [ProductImages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Binario da imagem
 *         content:
 *           image/jpeg:
 *             schema: { type: string, format: binary }
 *           image/png:
 *             schema: { type: string, format: binary }
 *       404:
 *         description: Nao encontrada
 */
router.get('/:id/content', ctrl.getImageContent);

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductImage:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         institutionId:
 *           type: integer
 *           example: 1
 *         kind:
 *           type: string
 *           nullable: true
 *           example: "PRINCIPAL"
 *         target:
 *           type: string
 *           nullable: true
 *           example: "PRODUTO"
 *         productId:
 *           type: integer
 *           nullable: true
 *           example: 200
 *         fileName:
 *           type: string
 *           nullable: true
 *           example: "produto_200.jpg"
 *         extension:
 *           type: string
 *           nullable: true
 *           example: "jpg"
 *         link:
 *           type: string
 *           nullable: true
 *           example: "https://cdn.example.com/produto_200.jpg"
 *         contentBase64:
 *           type: string
 *           nullable: true
 *           description: Conteudo binario da imagem em Base64
 *           example: "/9j/4AAQSkZJRgABAQEASABIAAD..."
 *         dataUri:
 *           type: string
 *           nullable: true
 *           description: "Data-URI completo. Use diretamente: <img src={dataUri} />"
 *           example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD..."
 */

module.exports = router;
