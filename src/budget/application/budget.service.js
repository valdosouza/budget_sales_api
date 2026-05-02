'use strict';

const budgetRepository     = require('../infrastructure/budget.repository');
const budgetItemRepository = require('../infrastructure/budget.item.repository');

// -------------------------------------------------------------------
// Helpers de erro HTTP
// -------------------------------------------------------------------
function notFound(msg) {
  const err = new Error(msg);
  err.status = 404;
  return err;
}

function badRequest(msg) {
  const err = new Error(msg);
  err.status = 400;
  return err;
}

// -------------------------------------------------------------------
// Budget
// -------------------------------------------------------------------

/**
 * Lista orçamentos com paginação e filtros.
 */
async function listBudgets({ limit = 20, offset = 0, filters = {} } = {}) {
  const parsedLimit  = Math.min(Math.max(Number(limit),  1), 100);
  const parsedOffset = Math.max(Number(offset), 0);

  const { data, total } = await budgetRepository.findAll({
    limit:   parsedLimit,
    offset:  parsedOffset,
    filters,
  });

  return {
    data:   data.map((b) => b.toJSON()),
    meta: {
      total,
      limit:  parsedLimit,
      offset: parsedOffset,
    },
  };
}

/**
 * Retorna um orçamento por ID (lança 404 se não encontrado).
 */
async function getBudgetById(id) {
  const budget = await budgetRepository.findById(id);
  if (!budget) throw notFound(`Orçamento #${id} não encontrado.`);
  return budget.toJSON();
}

/**
 * Cria um novo orçamento.
 * Campos obrigatórios: userId, date
 */
async function createBudget(data) {
  if (!data.userId) throw badRequest('Campo obrigatório ausente: userId.');
  if (!data.date)   throw badRequest('Campo obrigatório ausente: date.');

  const budget = await budgetRepository.create(data);
  return budget.toJSON();
}

/**
 * Atualiza um orçamento existente (patch parcial).
 */
async function updateBudget(id, data) {
  const existing = await budgetRepository.findById(id);
  if (!existing) throw notFound(`Orçamento #${id} não encontrado.`);

  const updated = await budgetRepository.update(id, data);
  return updated.toJSON();
}

// -------------------------------------------------------------------
// Budget Items
// -------------------------------------------------------------------

/**
 * Lista todos os itens de um orçamento.
 */
async function listItems(budgetId) {
  const budget = await budgetRepository.findById(budgetId);
  if (!budget) throw notFound(`Orçamento #${budgetId} não encontrado.`);

  const items = await budgetItemRepository.findByBudgetId(budgetId);
  return items.map((i) => i.toJSON());
}

/**
 * Retorna um item específico de um orçamento.
 */
async function getItemById(budgetId, itemId) {
  const budget = await budgetRepository.findById(budgetId);
  if (!budget) throw notFound(`Orçamento #${budgetId} não encontrado.`);

  const item = await budgetItemRepository.findById(itemId);
  if (!item || item.budgetId !== Number(budgetId)) {
    throw notFound(`Item #${itemId} não encontrado no orçamento #${budgetId}.`);
  }
  return item.toJSON();
}

/**
 * Adiciona um item ao orçamento.
 * Campos obrigatórios: description, quantity, unitPrice
 */
async function createItem(budgetId, data) {
  const budget = await budgetRepository.findById(budgetId);
  if (!budget) throw notFound(`Orçamento #${budgetId} não encontrado.`);

  if (!data.description)             throw badRequest('Campo obrigatório ausente: description.');
  if (data.quantity === undefined)   throw badRequest('Campo obrigatório ausente: quantity.');
  if (data.unitPrice === undefined)  throw badRequest('Campo obrigatório ausente: unitPrice.');

  const item = await budgetItemRepository.create({ ...data, budgetId: Number(budgetId) });
  return item.toJSON();
}

/**
 * Atualiza um item do orçamento (patch parcial).
 */
async function updateItem(budgetId, itemId, data) {
  const budget = await budgetRepository.findById(budgetId);
  if (!budget) throw notFound(`Orçamento #${budgetId} não encontrado.`);

  const existing = await budgetItemRepository.findById(itemId);
  if (!existing || existing.budgetId !== Number(budgetId)) {
    throw notFound(`Item #${itemId} não encontrado no orçamento #${budgetId}.`);
  }

  const updated = await budgetItemRepository.update(itemId, data);
  return updated.toJSON();
}

/**
 * Remove um item do orçamento.
 */
async function deleteItem(budgetId, itemId) {
  const budget = await budgetRepository.findById(budgetId);
  if (!budget) throw notFound(`Orçamento #${budgetId} não encontrado.`);

  const existing = await budgetItemRepository.findById(itemId);
  if (!existing || existing.budgetId !== Number(budgetId)) {
    throw notFound(`Item #${itemId} não encontrado no orçamento #${budgetId}.`);
  }

  await budgetItemRepository.delete(itemId);
}

module.exports = {
  listBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  listItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
