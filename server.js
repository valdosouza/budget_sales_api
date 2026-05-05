'use strict';

require('dotenv').config();

const fs         = require('fs');
const https      = require('https');
const express    = require('express');
const cors       = require('cors');
const swaggerUi  = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const env      = require('./src/config/env');
const { initPool, destroyPool } = require('./src/config/database');

// ----------------------------------------------------------------
// Inicializa pool Firebird antes de subir o servidor
// ----------------------------------------------------------------
initPool();

// ----------------------------------------------------------------
// App Express
// ----------------------------------------------------------------
const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['*'],
  credentials: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------------------------------
// Swagger / OpenAPI 3.0
// ----------------------------------------------------------------
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Budget Sales API',
      version: '1.0.0',
      description: 'API REST para gestão de orçamentos e vendas — Firebird 2.5',
    },
    servers: [
      {
        url: `${env.apiBaseUrl}/api/v1`,
        description: env.NODE_ENV === 'production' ? 'Produção' : 'Desenvolvimento',
      },
    ],
    components: {
      schemas: {},
    },
  },
  // Arquivos que contêm anotações JSDoc com @swagger
  apis: ['./src/**/**.routes.js', './src/**/*.controller.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ----------------------------------------------------------------
// Rotas base
// ----------------------------------------------------------------
app.get('/', (_req, res) => {
  res.json({
    message: 'Bem-vindo à Budget Sales API',
    docs: '/api-docs',
    health: '/api/v1/health',
  });
});

app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'ok',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Módulos de rotas
app.use('/api/v1/auth',           require('./src/auth/auth.routes'));
app.use('/api/v1/budgets',        require('./src/budget/budget.routes'));
app.use('/api/v1/products',       require('./src/product/product.routes'));
app.use('/api/v1/customers',      require('./src/customer/customer.routes'));
app.use('/api/v1/salesmen',       require('./src/salesman/salesman.routes'));
app.use('/api/v1/price-lists',    require('./src/price_list/price_list.routes'));
app.use('/api/v1/prices',         require('./src/price/price.routes'));
app.use('/api/v1/stock-lists',    require('./src/stock_list/stock_list.routes'));
app.use('/api/v1/stock-balance',  require('./src/stock_balance/stock_balance.routes'));
app.use('/api/v1/payment-types',  require('./src/payment_type/payment_type.routes'));
app.use('/api/v1/product-images', require('./src/product_image/product_image.routes'));

// ----------------------------------------------------------------
// Handler 404
// ----------------------------------------------------------------
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

// ----------------------------------------------------------------
// Handler de erros globais
// ----------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  if (status >= 500) {
    console.error('[ERROR]', err);
  }
  const isServerError = status >= 500;
  res.status(status).json({
    error: (!isServerError || env.isDev) ? err.message : 'Erro interno no servidor.',
    ...(env.isDev && isServerError && { stack: err.stack }),
  });
});

// ----------------------------------------------------------------
// Start HTTPS
// ----------------------------------------------------------------
const httpsOptions = {
  key: fs.readFileSync('./certs/server.key', 'utf8'),
  cert: fs.readFileSync('./certs/server.crt', 'utf8'),
};

const server = https.createServer(httpsOptions, app).listen(env.PORT, '0.0.0.0', () => {
  console.log(`[APP] budget-sales-api rodando em https://0.0.0.0:${env.PORT}`);
  console.log(`[APP] Documentação Swagger: https://localhost:${env.PORT}/api-docs`);
  console.log(`[APP] Ambiente: ${env.NODE_ENV}`);
  console.log(`[APP] ⚠️  Use https://192.168.0.116:${env.PORT} de outro computador`);
});

// ----------------------------------------------------------------
// Graceful shutdown
// ----------------------------------------------------------------
async function shutdown(signal) {
  console.log(`\n[APP] Sinal ${signal} recebido — encerrando...`);
  server.close(async () => {
    await destroyPool();
    console.log('[APP] Servidor encerrado com sucesso.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught exception — servidor mantido no ar:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled rejection — servidor mantido no ar:', reason);
});

module.exports = app; // útil para testes
