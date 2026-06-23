/*
Tiu chi .gs-dosiero estas parto de la aparta Guglo-Apoj-Skripto-ret-apo
https://script.google.com/a/~/macros/s/AKfycbweipvgiDOFo4SLTiY4eIKvNGP47MDaGZjMWhZWZArsRPscRsH5jdqqTxjdMq6KJu4U9w/exec
(mallonga URL: https://jhau.de/csvtxt).
Ghi montras la enhavon de https://www.seanoe.org/data/00980/109129/data/122848.csv
en teksta formo en krozilo(-apo).
*/

const SOURCE_URL = "https://www.seanoe.org/data/00980/109129/data/122848.csv";

function doGet(e) {
  const params = e.parameter || {};
  
  let page = parseInt(params.page) || 1;
  let chunkSize = parseInt(params.chunk) || 500;
  
  // Devigi multoblon de 50 
  chunkSize = Math.ceil(chunkSize / 50) * 50;
  if (chunkSize < 50) chunkSize = 50;
  if (chunkSize > 10000) chunkSize = 10000;

  try {
    const response = UrlFetchApp.fetch(SOURCE_URL, { muteHttpExceptions: true });
    const fullText = response.getContentText();
    const lines = fullText.split('\n');
    const header = lines[0];
    const totalLines = lines.length;
    const totalDataRows = totalLines - 1;
    const totalPages = Math.ceil(totalDataRows / chunkSize);

    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    const startIdx = 1 + (page - 1) * chunkSize;
    const endIdx = Math.min(startIdx + chunkSize, totalLines);
    let content = header + '\n' + lines.slice(startIdx, endIdx).join('\n');

    // Uzi chiam la URL-on kun .../a/~/macros...
    let baseUrl = ScriptApp.getService().getUrl()
                     .replace('/macros/s/', '/a/~/macros/s/');

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
    input, select, button { margin: 5px; padding: 10px; font-size: 16px; }
    button { background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #3367d6; }
  </style>
</head>
<body>
  <h2>CSV-spektilo (pecetigita)</h2>
  
  <div class="controls">
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
    
    <button onclick="goToPage()">Shargi</button>
    <button onclick="prevPage()">← Antaua</button>
    <button onclick="nextPage()">Sekva →</button>
  </div>
  
  <p><strong>Pagho ${page} el ${totalPages} | Linioj ${startIdx}–${endIdx-1} el ${totalDataRows}</strong><br>
  <small>La paghokapo estas ripetata en chiu peceto. Estas montrata en pecetoj kaj teksta formo la enhavo de <a href="https://www.seanoe.org/data/00980/109129/data/122848.csv" target="_blank">https://www.seanoe.org/data/00980/109129/data/122848.csv</a>. Uzighas informoj donitaj en:<br>Hart-Davis Michael, Dettmering Denise, Seitz Florian (2025). TICON-4: TIdal CONstants based on GESLA-4 sea-level records. SEANOE. <a href="https://doi.org/10.17882/109129" target="_blank">https://doi.org/10.17882/109129</a><br>kaj<br>Piccioni Gaia, Dettmering Denise, Bosch Wolfgang, Seitz Florian (2019). TICON: TIdal CONstants based on GESLA sea-level records from globally located tide gauges. Geoscience Data Journal. 6 (2). 97-104. <a href="https://doi.org/10.1002/gdj3.72" target="_blank">https://doi.org/10.1002/gdj3.72</a>, <a href="https://archimer.ifremer.fr/doc/00838/94993/" target="_blank">https://archimer.ifremer.fr/doc/00838/94993/</a>.</small></p>
  
  <pre>${content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>

  <script>
    const baseUrl = '${baseUrl}';
    
    function goToPage() {
      const page = document.getElementById('pageInput').value;
      const chunk = document.getElementById('chunkSelect').value;
      window.location.href = baseUrl + '?page=' + page + '&chunk=' + chunk;
    }
    
    function prevPage() {
      const currentPage = ${page};
      const page = Math.max(1, currentPage - 1);
      const chunk = document.getElementById('chunkSelect').value;
      window.location.href = baseUrl + '?page=' + page + '&chunk=' + chunk;
    }
    
    function nextPage() {
      const currentPage = ${page};
      const page = Math.min(${totalPages}, currentPage + 1);
      const chunk = document.getElementById('chunkSelect').value;
      window.location.href = baseUrl + '?page=' + page + '&chunk=' + chunk;
    }
    
    document.getElementById('pageInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') goToPage();
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
