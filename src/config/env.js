'use strict';

require('dotenv').config();

/**
 * Valida que uma variável de ambiente obrigatória está definida.
 * Lança erro em tempo de inicialização para evitar falhas silenciosas.
 */
function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória não definida: ${name}`);
  }
  return value;
}

function optional(name, defaultValue) {
  return process.env[name] ?? defaultValue;
}

function optionalInt(name, defaultValue) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return defaultValue;
  const parsed = parseInt(raw, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Variável de ambiente inválida (esperado inteiro): ${name}=${raw}`);
  }
  return parsed;
}

const env = {
  // --- Aplicação ---
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: optionalInt('PORT', 3000),
  isDev: optional('NODE_ENV', 'development') === 'development',
  isProd: optional('NODE_ENV', 'development') === 'production',

  // --- Firebird ---
  firebird: {
    host:     required('FB_HOST'),
    port:     optionalInt('FB_PORT', 3050),
    database: required('FB_DATABASE'),
    user:     required('FB_USER'),
    password: required('FB_PASSWORD'),
    charset:  optional('FB_CHARSET', 'WIN1252'),
  },

  // --- Pool ---
  pool: {
    max:            optionalInt('FB_POOL_MAX', 10),
    acquireTimeout: optionalInt('FB_POOL_ACQUIRE_TIMEOUT', 10000),
  },

  // --- Swagger ---
  apiBaseUrl: optional('API_BASE_URL', 'http://localhost:3000'),
};

module.exports = env;
