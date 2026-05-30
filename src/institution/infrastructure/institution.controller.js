'use strict';

/**
 * Controller: InstitutionController
 * Manipula requisições HTTP para instituições
 */
class InstitutionController {
  constructor(service) {
    this.service = service;
  }

  /**
   * GET /institutions
   * Lista simples de instituições disponíveis
   * @swagger
   * /institutions:
   *   get:
   *     summary: Lista simples de instituições disponíveis
   *     tags: [Institutions]
   *     responses:
   *       200:
   *         description: Lista paginada de instituições
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                     example: 1
   *                   fantasyName:
   *                     type: string
   *                     example: "Matriz Principal"
   *       500:
   *         description: Erro ao processar requisição
   */
  async getSimpleList(req, res, next) {
    try {
      const institutions = await this.service.getSimpleList();
      res.status(200).json(institutions);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = InstitutionController;
