'use strict';

// Retorna string "YYYY-MM-DD HH:MM:SS" — formato nativo do Firebird para TIMESTAMP
function parseLastSynch(dateStr) {
  if (!dateStr) {
    const err = new Error('Parâmetro last_synch é obrigatório.');
    err.status = 400;
    throw err;
  }
  // Aceita "DD/MM/YYYY HH:mm:ss"
  const m = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/.exec(dateStr);
  if (m) {
    const [, dd, mm, yyyy, hh, min, ss] = m;
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  }
  const d = new Date(dateStr);
  if (isNaN(d)) {
    const err = new Error('Formato de data inválido. Use DD/MM/YYYY HH:mm:ss');
    err.status = 400;
    throw err;
  }
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

module.exports = { parseLastSynch };
