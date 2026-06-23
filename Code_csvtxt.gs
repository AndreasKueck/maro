/*
Tiu chi .gs-dosiero estas parto de la aparta Guglo-Apoj-Skripto-ret-apo
https://script.google.com/macros/s/AKfycbweipvgiDOFo4SLTiY4eIKvNGP47MDaGZjMWhZWZArsRPscRsH5jdqqTxjdMq6KJu4U9w/exec
(mallonga URL: https://jhau.de/csvtxt).
Ghi montras la enhavon de https://www.seanoe.org/data/00980/109129/data/122848.csv
en teksta formo en krozilo(-apo).
*/

function doGet() {
  const url = "https://www.seanoe.org/data/00980/109129/data/122848.csv";
  const response = UrlFetchApp.fetch(url);
  return ContentService
    .createTextOutput(response.getContentText())
    .setMimeType(ContentService.MimeType.TEXT);
}
