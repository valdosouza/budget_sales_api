'use strict';

const { getConnection } = require('../../config/database');
const ProductImage = require('../domain/product_image.entity');

// ----------------------------------------------------------------
// Helper: le um campo BLOB e retorna Buffer
// ----------------------------------------------------------------
function readBlob(blobFn) {
  return new Promise(function(resolve, reject) {
    if (!blobFn || typeof blobFn !== 'function') return resolve(null);
    blobFn(function(err, _name, emitter) {
      if (err) return reject(err);
      var chunks = [];
      emitter.on('data',  function(chunk) { chunks.push(chunk); });
      emitter.on('end',   function()      { resolve(Buffer.concat(chunks)); });
      emitter.on('error', function(e)     { reject(e); });
    });
  });
}

function toBase64(buf) {
  return buf ? buf.toString('base64') : null;
}

// ----------------------------------------------------------------
// Helper: query que mantem conexao aberta ate ler todos os BLOBs
// ----------------------------------------------------------------
function queryWithBlobs(sql, params, blobFields) {
  blobFields = blobFields || [];
  return new Promise(function(resolve, reject) {
    getConnection().then(function(db) {
      db.query(sql, params, function(err, rows) {
        if (err) {
          db.detach();
          return reject(err);
        }
        var allRows = rows || [];
        Promise.all(
          allRows.map(function(row) {
            var updated = Object.assign({}, row);
            return Promise.all(
              blobFields.map(function(field) {
                return readBlob(row[field]).then(function(buf) {
                  updated[field] = buf;
                });
              })
            ).then(function() { return updated; });
          })
        ).then(function(resolved) {
          db.detach();
          resolve(resolved);
        }).catch(function(blobErr) {
          db.detach();
          reject(blobErr);
        });
      });
    }).catch(reject);
  });
}

// ----------------------------------------------------------------
// Repository
// ----------------------------------------------------------------
var ProductImageRepository = function() {};

ProductImageRepository.prototype.findByProductId = function(productId, opts) {
  opts = opts || {};
  var limit  = opts.limit  || 20;
  var offset = opts.offset || 0;

  var self = this;
  return queryWithBlobs(
    'SELECT COUNT(*) AS TOTAL FROM TB_IMAGES WHERE TABLE_ID = ?',
    [Number(productId)],
    []
  ).then(function(countRows) {
    var total = Number((countRows[0] && countRows[0].TOTAL) || 0);

    return queryWithBlobs(
      'SELECT FIRST ? SKIP ? ID, TB_INSTITUTION_ID, KIND, TARGET, TABLE_ID, FILE_NAME, EXTENSION, LINK, CONTENT FROM TB_IMAGES WHERE TABLE_ID = ? ORDER BY ID ASC',
      [Number(limit), Number(offset), Number(productId)],
      ['CONTENT']
    ).then(function(rows) {
      var data = rows.map(function(row) {
        var img = new ProductImage(row);
        img.contentBase64 = toBase64(row.CONTENT);
        return img;
      });
      return { data: data, total: total };
    });
  });
};

ProductImageRepository.prototype.findById = function(id) {
  return queryWithBlobs(
    'SELECT ID, TB_INSTITUTION_ID, KIND, TARGET, TABLE_ID, FILE_NAME, EXTENSION, LINK, CONTENT FROM TB_IMAGES WHERE ID = ?',
    [Number(id)],
    ['CONTENT']
  ).then(function(rows) {
    if (!rows.length) return null;
    var img = new ProductImage(rows[0]);
    img.contentBase64 = toBase64(rows[0].CONTENT);
    return img;
  });
};

ProductImageRepository.prototype.findContentById = function(id) {
  return queryWithBlobs(
    'SELECT CONTENT, EXTENSION FROM TB_IMAGES WHERE ID = ?',
    [Number(id)],
    ['CONTENT']
  ).then(function(rows) {
    if (!rows.length || !rows[0].CONTENT) return null;
    return {
      content:   rows[0].CONTENT,
      extension: rows[0].EXTENSION ? rows[0].EXTENSION.trim() : null,
    };
  });
};

module.exports = new ProductImageRepository();
