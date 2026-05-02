'use strict';

const budgetService = require('../application/budget.service');

/**
 * GET /api/v1/budgets/:id/items
 */
async function listItems(req, res, next) {
  try {
    const items = await budgetService.listItems(req.params.id);
    res.json(items);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/budgets/:id/items/:itemId
 */
async function getItem(req, res, next) {
  try {
    const item = await budgetService.getItemById(req.params.id, req.params.itemId);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/budgets/:id/items
 */
async function createItem(req, res, next) {
  try {
    const item = await budgetService.createItem(req.params.id, req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/budgets/:id/items/:itemId
 */
async function updateItem(req, res, next) {
  try {
    const item = await budgetService.updateItem(req.params.id, req.params.itemId, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/v1/budgets/:id/items/:itemId
 */
async function deleteItem(req, res, next) {
  try {
    await budgetService.deleteItem(req.params.id, req.params.itemId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listItems, getItem, createItem, updateItem, deleteItem };
