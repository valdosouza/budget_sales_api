'use strict';

const jwt = require('jsonwebtoken');
const env = require('../../config/env');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticacao nao fornecido.' });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload;
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError'
      ? 'Token expirado.'
      : 'Token invalido.';
    return res.status(401).json({ error: message });
  }
}

module.exports = { authenticateToken };
