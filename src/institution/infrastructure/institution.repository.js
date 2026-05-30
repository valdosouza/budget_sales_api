'use strict';

const Institution = require('../domain/institution.entity');
const IInstitutionRepository = require('../domain/institution.repository.interface');
const { query } = require('../../config/database');

/**
 * Repository: InstitutionRepository
 * Implementação de persistência para Institution (TB_EMPRESA)
 */
class InstitutionRepository extends IInstitutionRepository {
  /**
   * Lista todas as instituições ativas (EMP_TIPO = 0 E EMP_ATIVA = 'S')
   * Retorna apenas EMP_CODIGO e EMP_FANTASIA
   * @returns {Promise<Institution[]>}
   */
  async listSimple() {
    const sql = `
      SELECT
        EMP_CODIGO,
        EMP_FANTASIA
      FROM TB_EMPRESA
      WHERE EMP_TIPO = 0
        AND EMP_ATIVA = 'S'
      ORDER BY EMP_FANTASIA
    `;

    const result = await query(sql);

    return result.map(row => new Institution(
      row.EMP_CODIGO,
      row.EMP_FANTASIA
    ));
  }
}

module.exports = InstitutionRepository;
