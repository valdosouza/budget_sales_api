'use strict';

/**
 * Contrato (interface) para os repositórios do módulo Budget.
 * Serve como documentação das operações esperadas e facilita
 * a substituição da implementação (ex.: testes com mocks).
 */

class IBudgetRepository {
  /** @returns {Promise<{data: Budget[], total: number}>} */
  // eslint-disable-next-line no-unused-vars
  async findAll({ limit, offset, filters }) { throw new Error('Not implemented'); }

  /** @returns {Promise<Budget|null>} */
  // eslint-disable-next-line no-unused-vars
  async findById(id) { throw new Error('Not implemented'); }

  /** @returns {Promise<Budget>} */
  // eslint-disable-next-line no-unused-vars
  async create(data) { throw new Error('Not implemented'); }

  /** @returns {Promise<Budget>} */
  // eslint-disable-next-line no-unused-vars
  async update(id, data) { throw new Error('Not implemented'); }
}

class IBudgetItemRepository {
  /** @returns {Promise<BudgetItem[]>} */
  // eslint-disable-next-line no-unused-vars
  async findByBudgetId(budgetId) { throw new Error('Not implemented'); }

  /** @returns {Promise<BudgetItem|null>} */
  // eslint-disable-next-line no-unused-vars
  async findById(id) { throw new Error('Not implemented'); }

  /** @returns {Promise<BudgetItem>} */
  // eslint-disable-next-line no-unused-vars
  async create(data) { throw new Error('Not implemented'); }

  /** @returns {Promise<BudgetItem>} */
  // eslint-disable-next-line no-unused-vars
  async update(id, data) { throw new Error('Not implemented'); }

  /** @returns {Promise<void>} */
  // eslint-disable-next-line no-unused-vars
  async delete(id) { throw new Error('Not implemented'); }
}

module.exports = { IBudgetRepository, IBudgetItemRepository };
