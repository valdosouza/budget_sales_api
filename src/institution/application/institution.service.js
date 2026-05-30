'use strict';

/**
 * Service: InstitutionService
 * Lógica de negócio para instituições
 */
class InstitutionService {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Retorna lista simples de instituições (apenas código e fantasia)
   * @returns {Promise<Institution[]>}
   */
  async getSimpleList() {
    return this.repository.listSimple();
  }
}

module.exports = InstitutionService;
