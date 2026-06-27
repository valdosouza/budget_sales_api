'use strict';

const { query } = require('../../config/database');

// ---------------------------------------------------------------------------
// Validadores de documento
// ---------------------------------------------------------------------------

/**
 * Valida CPF usando algoritmo de dígito verificador.
 * @param {string} cpf - CPF com ou sem formatação
 * @returns {boolean}
 */
function isValidCPF(cpf) {
  const doc = cpf.replace(/[.\-/]/g, '');

  if (doc.length !== 11 || /^\d+$/.test(doc) === false) return false;

  // Rejeita sequências repetidas
  if (/^(\d)\1{10}$/.test(doc)) return false;

  let soma = 0;
  let resto;

  // Primeiro dígito verificador
  for (let i = 0; i < 9; i++) {
    soma += parseInt(doc[i]) * (10 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(doc[9])) return false;

  soma = 0;
  // Segundo dígito verificador
  for (let i = 0; i < 10; i++) {
    soma += parseInt(doc[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(doc[10])) return false;

  return true;
}

/**
 * Valida CNPJ usando algoritmo de dígito verificador.
 * @param {string} cnpj - CNPJ com ou sem formatação
 * @returns {boolean}
 */
function isValidCNPJ(cnpj) {
  const doc = cnpj.replace(/[.\-/]/g, '');

  if (doc.length !== 14 || /^\d+$/.test(doc) === false) return false;

  // Rejeita sequências repetidas
  if (/^(\d)\1{13}$/.test(doc)) return false;

  let soma = 0;
  let resto;
  const multiplicador1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const multiplicador2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  // Primeiro dígito verificador
  for (let i = 0; i < 12; i++) {
    soma += parseInt(doc[i]) * multiplicador1[i];
  }
  resto = soma % 11;
  if (resto < 2) resto = 0;
  else resto = 11 - resto;
  if (resto !== parseInt(doc[12])) return false;

  soma = 0;
  // Segundo dígito verificador
  for (let i = 0; i < 13; i++) {
    soma += parseInt(doc[i]) * multiplicador2[i];
  }
  resto = soma % 11;
  if (resto < 2) resto = 0;
  else resto = 11 - resto;
  if (resto !== parseInt(doc[13])) return false;

  return true;
}

/**
 * Valida CPF ou CNPJ.
 * @param {string} documento
 * @returns {boolean}
 */
function isValidFiscalDocument(documento) {
  if (!documento) return false;
  const doc = documento.replace(/[.\-/]/g, '');

  if (doc.length === 11) return isValidCPF(documento);
  if (doc.length === 14) return isValidCNPJ(documento);

  return false;
}

// ---------------------------------------------------------------------------
// Validadores de banco de dados
// ---------------------------------------------------------------------------

/**
 * Valida se institutionId existe em TB_EMPRESA com EMP_TIPO = 0.
 * @param {number} institutionId
 * @returns {Promise<boolean>}
 */
async function isValidInstitution(institutionId) {
  if (!institutionId) return false;

  try {
    const rows = await query(
      'SELECT EMP_CODIGO FROM TB_EMPRESA WHERE EMP_CODIGO = ? AND EMP_TIPO = 0',
      [Number(institutionId)]
    );
    return rows.length > 0;
  } catch (err) {
    console.error('[VALIDATOR] Erro ao validar institutionId:', err.message);
    return false;
  }
}

/**
 * Valida se paymentTypeId existe em TB_FORMAPAGTO.
 * @param {number} paymentTypeId
 * @returns {Promise<boolean>}
 */
async function isValidPaymentType(paymentTypeId) {
  if (!paymentTypeId) return false;

  try {
    const rows = await query(
      'SELECT FPT_CODIGO FROM TB_FORMAPAGTO WHERE FPT_CODIGO = ?',
      [Number(paymentTypeId)]
    );
    return rows.length > 0;
  } catch (err) {
    console.error('[VALIDATOR] Erro ao validar paymentTypeId:', err.message);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Validador principal do payload
// ---------------------------------------------------------------------------

/**
 * Valida o payload completo de criação de pedido.
 * @param {object} payload
 * @returns {Promise<{valid: boolean, errors: Array<string>}>}
 */
async function validateOrderPayload(payload) {
  const errors = [];

  // --- Validações de estrutura ---
  if (!payload.order) {
    errors.push('Campo obrigatório ausente: "order"');
    return { valid: false, errors };
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    errors.push('Campo obrigatório ausente: items (deve ser um array não vazio)');
    return { valid: false, errors };
  }

  const { order } = payload;

  // --- Validações obrigatórias ---
  if (!order.userId) {
    errors.push('Campo obrigatório ausente: order.userId');
  }
  if (!order.date) {
    errors.push('Campo obrigatório ausente: order.date');
  }
  if (!order.customerName) {
    errors.push('Campo obrigatório ausente: order.customerName');
  }
  if (!order.fiscalDocument) {
    errors.push('Campo obrigatório ausente: order.fiscalDocument');
  }

  // --- Validação de fiscalDocument (CPF/CNPJ) ---
  if (order.fiscalDocument && !isValidFiscalDocument(order.fiscalDocument)) {
    errors.push('fiscalDocument inválido');
  }

  // --- Validação de institutionId (apenas se informado) ---
  if (order.institutionId) {
    const validInstitution = await isValidInstitution(order.institutionId);
    if (!validInstitution) {
      errors.push('Código institutionId inválido');
    }
  }

  // --- Validação de paymentTypeId (apenas se informado) ---
  if (order.paymentTypeId) {
    const validPaymentType = await isValidPaymentType(order.paymentTypeId);
    if (!validPaymentType) {
      errors.push('Código paymentTypeId inválido');
    }
  }

  // --- Validações dos itens ---
  for (let i = 0; i < payload.items.length; i++) {
    const item = payload.items[i];

    if (!item.productId) {
      errors.push(`items[${i}]: campo obrigatório ausente: productId`);
    }
    if (item.quantity === undefined || item.quantity === null) {
      errors.push(`items[${i}]: campo obrigatório ausente: quantity`);
    }
    if (item.unitPrice === undefined || item.unitPrice === null) {
      errors.push(`items[${i}]: campo obrigatório ausente: unitPrice`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  isValidFiscalDocument,
  isValidInstitution,
  isValidPaymentType,
  validateOrderPayload,
};
