'use strict';

const budgetService = require('../application/budget.service');

/**
 * GET /api/v1/budgets
 * Query params: limit, offset, status, userId, customerId, salesmanId, dateFrom, dateTo
 */
async function listBudgets(req, res, next) {
  try {
    const { limit = 20, offset = 0, ...filters } = req.query;
    const result = await budgetService.listBudgets({
      limit:   Number(limit),
      offset:  Number(offset),
      filters,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/budgets/:id
 */
async function getBudget(req, res, next) {
  try {
    const budget = await budgetService.getBudgetById(req.params.id);
    res.json(budget);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/budgets
 */
async function createBudget(req, res, next) {
  try {
    const budget = await budgetService.createBudget(req.body);
    res.status(201).json(budget);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/budgets/:id
 */
async function updateBudget(req, res, next) {
  try {
    const budget = await budgetService.updateBudget(req.params.id, req.body);
    res.json(budget);
  } catch (err) {
    next(err);
  }
}

module.exports = { listBudgets, getBudget, createBudget, updateBudget };
