/*
Tiu chi .gs-dosiero estas parto de la aparta Guglo-Apoj-Skripto-ret-apo
https://script.google.com/a/~/macros/s/AKfycbweipvgiDOFo4SLTiY4eIKvNGP47MDaGZjMWhZWZArsRPscRsH5jdqqTxjdMq6KJu4U9w/exec
(mallonga URL: https://jhau.de/csvtxt).
*/

const SOURCE_URL = "https://www.seanoe.org/data/00980/109129/data/122848.csv";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getCsvRow(line) {
  try {
    return Utilities.parseCsv(line)[0] || [];
  } catch (err) {
    return line.split(',');
  }
}

function getTideGaugeSearchKey(line) {
  const row = getCsvRow(line);

  // tide_gauge_name estas la 14-a elemento, do indekso 13
  const tideGaugeName = String(row[13] || '').trim();

  // Nur la parto antau la unua bindestreko, kaj de tio nur la unuaj kvar signoj
  const beforeFirstHyphen = tideGaugeName.split('-')[0];

  return beforeFirstHyphen.substring(0, 4).toLowerCase();
}

function findFirstTideGaugeLine(lines, searchKey) {
  const wanted = String(searchKey || '').trim().substring(0, 4).toLowerCase();

  if (!wanted) return -1;

  for (let i = 1; i < lines.length; i++) {
    if (getTideGaugeSearchKey(lines[i]) === wanted) {
      return i; // i samtempe estas la datuma linio-numero, char kaplinio estas lines[0]
    }
  }

  return -1;
}

function doGet(e) {
  const params = e.parameter || {};
  
  let page = parseInt(params.page) || 1;
  let chunkSize = parseInt(params.chunk) || 50;

  const tideGaugeSearchRaw = String(params.tg || '').trim();
  const tideGaugeSearch = tideGaugeSearchRaw.substring(0, 4);
  
  chunkSize = Math.ceil(chunkSize / 50) * 50;
  if (chunkSize < 50) chunkSize = 50;
  if (chunkSize > 10000) chunkSize = 10000;

  // Bei Suche nach tide_gauge_name immer Darstellung mit 50 Zeilen pro Seite
  if (tideGaugeSearch) {
    chunkSize = 50;
  }

  try {
    const response = UrlFetchApp.fetch(SOURCE_URL, { muteHttpExceptions: true });
    const fullText = response.getContentText();
    const lines = fullText.split('\n');
    const header = lines[0];
    const totalLines = lines.length;
    const totalDataRows = totalLines - 1;
    const totalPages = Math.ceil(totalDataRows / chunkSize);

    let searchInfoHtml = '';

    if (tideGaugeSearch) {
      const foundLine = findFirstTideGaugeLine(lines, tideGaugeSearch);

      if (foundLine > 0) {
        page = Math.ceil(foundLine / chunkSize);
        searchInfoHtml = `<p><strong>Trovo por tide_gauge_name "${escapeHtml(tideGaugeSearch)}": pagho ${page}, linio ${foundLine}.</strong></p>`;
      } else {
        searchInfoHtml = `<p><strong>Neniu trovo por tide_gauge_name "${escapeHtml(tideGaugeSearch)}".</strong></p>`;
      }
    }

    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    const startIdx = 1 + (page - 1) * chunkSize;
    const endIdx = Math.min(startIdx + chunkSize, totalLines);
    let content = header + '\n' + lines.slice(startIdx, endIdx).join('\n');

    let baseUrl = ScriptApp.getService().getUrl()
                     .replace('/macros/s/', '/a/~/macros/s/');

    // Cache-Busting Parameter
    const timestamp = new Date().getTime();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CSV-spektilo</title>
  <style>
    body { font-family: monospace; margin: 20px; }
    pre { white-space: pre-wrap; word-break: break-all; max-height: 75vh; overflow: auto; background: #f8f8f8; padding: 15px; border: 1px solid #ddd; }
    .controls { margin-bottom: 20px; padding: 15px; background: #f0f0f0; border-radius: 6px; }
    input, select, a.button { margin: 5px; padding: 10px; font-size: 16px; text-decoration: none; display: inline-block; }
    .button { background: #4285f4; color: white; border-radius: 4px; cursor: pointer; }
  </style>
</head>
<body>
  <h2>CSV-spektilo (pecetigita)</h2>
  
  <div class="controls">
    <form id="navForm" style="display:inline;">
      <label>Pagho: </label>
      <input type="number" id="pageInput" value="${page}" min="1" max="${totalPages}" style="width:90px;">
      
      <label>Peceto-grando: </label>
      <select id="chunkSelect">
        <option value="50" ${chunkSize===50 ? 'selected' : ''}>50</option>
        <option value="100" ${chunkSize===100 ? 'selected' : ''}>100</option>
        <option value="500" ${chunkSize===500 ? 'selected' : ''}>500</option>
        <option value="1000" ${chunkSize===1000 ? 'selected' : ''}>1000</option>
        <option value="5000" ${chunkSize===5000 ? 'selected' : ''}>5000</option>
      </select>

      <label>tide_gauge_name: </label>
      <input type="text" id="tgInput" value="${escapeHtml(tideGaugeSearch)}" maxlength="4" style="width:90px;" placeholder="boul">
    </form>
    
    <a href="#" onclick="searchTideGauge(); return false;" class="button">Serchi</a>
    <a href="#" onclick="goToPage(); return false;" class="button">Shargi</a>
    <a href="${baseUrl}?page=${Math.max(1, page-1)}&chunk=${chunkSize}&t=${timestamp}" target="_top" class="button">? Antaua</a>
    <a href="${baseUrl}?page=${Math.min(totalPages, page+1)}&chunk=${chunkSize}&t=${timestamp}" target="_top" class="button">Sekva ?</a>
  </div>

  ${searchInfoHtml}
  
  <p><strong>Pagho ${page} el ${totalPages} | Linioj ${startIdx}–${endIdx-1} el ${totalDataRows}</strong><br>
  <small>La paghokapo estas ripetata en chiu peceto. Estas montrata en pecetoj kaj teksta formo la enhavo de <a href="https://www.seanoe.org/data/00980/109129/data/122848.csv" target="_blank">https://www.seanoe.org/data/00980/109129/data/122848.csv</a>. Uzighas informoj donitaj en:<br>Hart-Davis Michael, Dettmering Denise, Seitz Florian (2025). TICON-4: TIdal CONstants based on GESLA-4 sea-level records. SEANOE. <a href="https://doi.org/10.17882/109129" target="_blank">https://doi.org/10.17882/109129</a><br>kaj<br>Piccioni Gaia, Dettmering Denise, Bosch Wolfgang, Seitz Florian (2019). TICON: TIdal CONstants based on GESLA sea-level records from globally located tide gauges. Geoscience Data Journal. 6 (2). 97-104. <a href="https://doi.org/10.1002/gdj3.72" target="_blank">https://doi.org/10.1002/gdj3.72</a>, <a href="https://archimer.ifremer.fr/doc/00838/94993/" target="_blank">https://archimer.ifremer.fr/doc/00838/94993/</a>.<br>Datumoj de SEANOE (CC BY). Neniu respondeco pri enhavo. Citu la originalon.</small></p>
  
  <pre>${escapeHtml(content)}</pre>

  <script>
    function goToPage() {
      const page = document.getElementById('pageInput').value;
      const chunk = document.getElementById('chunkSelect').value;
      const timestamp = new Date().getTime();
      const url = '${baseUrl}?page=' + page + '&chunk=' + chunk + '&t=' + timestamp;
      window.open(url, '_top');   // target=_top via JS
    }

    function searchTideGauge() {
      const tg = document.getElementById('tgInput').value.trim().substring(0, 4);
      const timestamp = new Date().getTime();

      if (!tg) return;

      const url = '${baseUrl}?tg=' + encodeURIComponent(tg) + '&chunk=50&t=' + timestamp;
      window.open(url, '_top');   // target=_top via JS
    }
    
    document.getElementById('pageInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') goToPage();
    });

    document.getElementById('tgInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') searchTideGauge();
    });
  </script>
  
  <div align="center" style="padding: 1rem 0 120px 0;">
    <a href="https://jhau.de/privateco.html" target="_blank">Privateco</a>
  </div>
</body>
</html>`;

    return HtmlService.createHtmlOutput(html)
      .setTitle('CSV-spektilo')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  } catch (error) {
    return ContentService.createTextOutput("Eraro: " + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
