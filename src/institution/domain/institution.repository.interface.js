'use strict';

/**
 * Interface: InstitutionRepository
 * Define contrato para operações de persistência de Institution
 */
class IInstitutionRepository {
  /**
   * Lista todas as instituições ativas
   * @returns {Promise<Institution[]>}
   */
  async listSimple() {
    throw new Error('listSimple() deve ser implementado');
  }
}

module.exports = IInstitutionRepository;
