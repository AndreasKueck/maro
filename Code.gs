/*
Akvoniveloj

Tiu chi Ghavoskripto-programo
- kalkulas lau la harmona metodo akvonivelojn sekve de la interagoj de Tero, Luno kaj Suno kaj krome
- estas grava parto de pria ret-apo alirebla per
https://script.google.com/a/~/macros/s/AKfycbzgeChQUzIlVM5wmtsrmwZkNNJUZgFLLPvtYkNztVaFhHHq2xp3NqImx2uolmQw_qBG4g/exec kaj Android-apo "Maro" (elshutebla el https://gist.github.com/AndreasKueck/a62016ed4c3efaa477691de06af8d794)

Uzighas informoj donitaj en:
1) Kumm, Werner: "Gezeitenkunde: Theorie und Praxis", Delius-Klasing, Bielefeld, 1992, paghoj 126-129.
2) https://refmar.shom.fr/sites/default/files/2024-01/TIPE_formulation.pdf
3) https://legacy.iho.int/mtg_docs/com_wg/IHOTC/IHOTC8/Product_Spec_for_Exchange_of_HCs.pdf
4) Hart-Davis Michael, Dettmering Denise, Seitz Florian (2025). TICON-4: TIdal CONstants based on GESLA-4 sea-level records. SEANOE. https://doi.org/10.17882/109129
kaj
Piccioni Gaia, Dettmering Denise, Bosch Wolfgang, Seitz Florian (2019). TICON: TIdal CONstants based on GESLA sea-level records from globally located tide gauges. Geoscience Data Journal. 6 (2). 97-104. https://doi.org/10.1002/gdj3.72, https://archimer.ifremer.fr/doc/00838/94993/
5) https://github.com/openwatersio/tide-database
*/

const customDomain = 'https://jhau1.de/';
const LOKOJ_ALT_JSON_BASE_URL = 'https://raw.githubusercontent.com/openwatersio/tide-database/refs/heads/main/data/ticon/';

const DEFAULT_POVUMO = [
'50.72738,1.57766,M2,294.995777,-31.113392,0.085776,2.8e-05,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,N2,53.939546,-52.782083,0.015953,0.000157,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,S2,95.866948,20.335683,0.027892,8.7e-05,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,K2,27.892851,18.540769,0.007418,0.000273,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,2N2,6.756741,-73.152486,0.001962,0.001231,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,S1,0.113812,166.335007,3.3e-05,0.073255,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,K1,4.716208,125.91494,0.001347,0.001736,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,P1,1.288709,119.16287,0.000375,0.006465,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,O1,2.930952,89.441724,0.000823,0.002747,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,Q1,1.269137,56.679763,0.000357,0.006343,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,M1,0.257195,87.541584,7.2e-05,0.031075,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,M4,33.557009,-141.67838,0.009707,0.000247,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,MM,0.804071,-178.741805,0.000232,0.010237,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,MF,1.056131,-176.436869,0.00026,0.006684,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,SA,8.082957,-133.843281,0.002352,0.001032,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,SSA,1.282702,137.758792,0.000373,0.006498,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,T2,5.324299,4.646727,0.001549,0.001565,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,J1,0.454069,-150.363374,0.000107,0.014922,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,L2,15.208473,-24.637124,0.004237,0.000525,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,R2,1.089361,53.773987,0.000317,0.00765,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,2Q1,0.185478,4.77304,5.4e-05,0.044891,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,MSF,0.602657,15.875074,0.000175,0.013808,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,MSQM,0.269449,80.222035,7.8e-05,0.030891,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,EP2,2.945053,31.370099,0.000856,0.002827,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,M3,1.248872,16.748784,0.000362,0.006651,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,MU2,11.382165,35.908614,0.003306,0.000731,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,MTM,0.065502,-155.288506,1.9e-05,0.127029,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,NU2,12.666254,-62.627431,0.003679,0.000657,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,LAMBDA2,7.745355,-32.775355,0.00225,0.001074,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,MN4,11.877831,-165.44559,0.003436,0.000698,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,MS4,21.886545,-87.753523,0.006355,0.00038,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,MKS2,1.955234,110.15685,0.000569,0.004262,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,N4,2.52439,172.401419,0.000734,0.003298,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,M6,6.897503,85.980848,0.002004,0.001207,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,M8,2.435899,-17.095803,0.0007,0.00338,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,S4,2.07191,-7.788484,0.000602,0.004018,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,OO1,0.365933,-80.362794,0.000106,0.022747,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,S3,0.067714,159.06719,2e-05,0.123064,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,MA2,3.030893,-88.387267,0.000881,0.002747,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,MB2,1.134485,65.738309,0.00033,0.007341,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,T3,0.349364,-173.493528,0.000102,0.023843,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,R3,0.917002,-1.005195,0.000267,0.009083,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,RHO1,0.156136,98.688827,4.5e-05,0.053317,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,SGM,0.458826,137.102821,0.000133,0.018147,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,3L2,1.141171,122.324366,0.000328,0.007213,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,3N2,0.072558,-111.72042,2.1e-05,0.113629,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,2SM2,6.052553,-138.211278,0.001757,0.001374,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,2MS6,6.829483,131.420016,0.001985,0.001219,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,2MK5,0.846297,-151.319669,0.000246,0.009836,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique',
'50.72738,1.57766,2MO5,0.910047,-101.742612,0.000264,0.009147,0.0,328143,49.0,21/11/1941,31/03/2025,gesla4.REFMAR,boulogne_sur_mer-111-fra-refmar,Coastal,FRA,No obvious issues,Zero Hydrographique'
].join('\n');

const HARMONIC_DATA = {
  M2: [2, 0, 0, 0, 0, 0, 0],
  N2: [2, -1, 0, 1, 0, 0, 0],
  S2: [2, 2, -2, 0, 0, 0, 0],
  K2: [2, 2, 0, 0, 0, 0, 0],
  '2N2': [2, -2, 0, 2, 0, 0, 0],
  S1: [1, 1, -1, 0, 0, 1, 1],
  K1: [1, 1, 0, 0, 0, 0, 1],
  P1: [1, 1, -2, 0, 0, 0, -1],
  O1: [1, -1, 0, 0, 0, 0, -1],
  Q1: [1, -2, 0, 1, 0, 0, -1],
  M1: [1, 0, 0, 1, 0, 0, 1],
  M4: [4, 0, 0, 0, 0, 0, 0],
  MM: [0, 1, 0, -1, 0, 0, 0],
  MF: [0, 2, 0, 0, 0, 0, 0],
  SA: [0, 0, 1, 0, 0, -1, 0],
  SSA: [0, 0, 2, 0, 0, 0, 0],
  T2: [2, 2, -3, 0, 0, 1, 0],
  J1: [1, 2, 0, -1, 0, 0, 1],
  L2: [2, 1, 0, -1, 0, 0, 2],
  R2: [2, 2, -1, 0, 0, -1, 2],
  '2Q1': [1, -3, 0, 2, 0, 0, -1],
  MSF: [0, 2, -2, 0, 0, 0, 0],
  MSQM: [0, 4, -2, 0, 0, 0, 0],
  EP2: [2, -3, 2, 1, 0, 0, 0],
  M3: [3, 0, 0, 0, 0, 0, 2],
  MU2: [2, -2, 2, 0, 0, 0, 0],
  MTM: [0, 3, 0, -1, 0, 0, 0],
  NU2: [2, -1, 2, -1, 0, 0, 0],
  LAMBDA2: [2, 1, -2, 1, 0, 0, 2],
  MN4: [4, -1, 0, 1, 0, 0, 0],
  MS4: [4, 2, -2, 0, 0, 0, 0],
  MKS2: [2, -1, 0, 0, 0, 0, 0],
  N4: [4, -2, 0, 2, 0, 0, 0],
  M6: [6, 0, 0, 0, 0, 0, 0],
  M8: [8, 0, 0, 0, 0, 0, 0],
  S4: [4, 4, -4, 0, 0, 0, 0],
  OO1: [1, 3, 0, 0, 0, 0, 1],
  S3: [3, 3, -3, 0, 0, 0, 2],
  MA2: [2, 0, -1, 0, 0, 0, 0],
  MB2: [2, 0, 1, 0, 0, 0, 0],
  T3: [3, 3, -4, 0, 0, 0, 0],
  R3: [3, 3, -2, 0, 0, 0, 0],
  RHO1: [1, -2, 2, -1, 0, 0, -1],
  SGM: [1, -3, 2, 0, 0, 0, -1],
  '3L2': [2, 1, 0, 0, 0, 0, 0],
  '3N2': [2, 0, 2, 0, 0, 0, 0],
  '2SM2': [2, 4, -4, 0, 0, 0, 0],
  '2MS6': [6, 2, -2, 0, 0, 0, 0],
  '2MK5': [5, 1, 0, 0, 0, 0, 1],
  '2MO5': [5, -1, 0, 0, 0, 0, -1]
};

const POVUMO_PATTERNS = [
  /Unspecified Common Datum(\s|\S)/g,
  /specified(\s|\S)/g,
  /DHHN92 \/ Amsterdam(\s|\S)/g,
  /NAVD.88(\s|\S)/g,
  /Admiralty Chart Datum \(ACD\)(\s|\S)/g,
  /Admiralty Chart Datum(\s|\S)/g,
  /Ascension B\-Datum May 1993(\s|\S)/g,
  /Australian Height Datum(\s|\S)/g,
  /BHS77(\s|\S)/g,
  /BSCD2000(\s|\S)/g,
  /Chart Datum \(CD\)(\s|\S)/g,
  /Chart Datum \/ Lowest Astronomical Tide(\s|\S)/g,
  /DHHN92(\s|\S)/g,
  /DVR90(\s|\S)/g,
  /DBHydrosite(\s|\S)/g,
  /Geodetic Datum(\s|\S)/g,
  /Harbour Local Datum(\s|\S)/g,
  /LAS\-2000\.5(\s|\S)/g,
  /LN \(Local Datum\)(\s|\S)/g,
  /Local Chart Datum(\s|\S)/g,
  / datum(\s|\S)/g,
  /Tide \(LAT\)(\s|\S)/g,
  /Ordnance Datum Malin Head(\s|\S)/g,
  /Ordnance Datum(\s|\S)/g,
  /MSL(\s|\S)/g,
  /NAD..(\s|\S)/g,
  /Normal Amsterdam Level(\s|\S)/g,
  /\(ODN\)(\s|\S)/g,
  /Ortometric height(\s|\S)/g,
  /PNP(\s|\S)/g,
  /System 2000\)(\s|\S)/g,
  /website(\s|\S)/g,
  /gov\/ or(\s|\S)/g,
  /Kronstadt(\s|\S)/g,
  /Staff of 1860(\s|\S)/g,
  /Station Datum(\s|\S)/g,
  /\(TGZ\)(\s|\S)/g,
  /TGZ 73\.88 cm below mean sea level(\s|\S)/g,
  /TGZ(\s|\S)/g,
  /mean\-sea\-level(\s|\S)/g,
  /to NP1(\s|\S)/g,
  /Unknown\; contact NOAA(\s|\S)/g,
  /Unknown(\s|\S)/g,
  /to geocentric datum\)(\s|\S)/g,
  /Hydrographique(\s|\S)/g,
  /Talassografico(\s|\S)/g,
  /of Tide Height(\s|\S)/g,
  /Alexandria Harbour Tide Gauge(\s|\S)/g,
  /Sea\-Level Data(\s|\S)/g,
  /Adjusted Sea Level(\s|\S)/g,
  /HAT(\s|\S)/g,
  /MHHW(\s|\S)/g,
  /MHW(\s|\S)/g,
  /MTL(\s|\S)/g,
  /MLW(\s|\S)/g,
  /MLLW(\s|\S)/g,
  /LAT(\s|\S)/g
];


function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle('Prognozo de akvoniveloj per TICON-4-datumoj');
}


function getDu() {
  return HtmlService.createHtmlOutputFromFile('du').getContent();
}

function getTri() {
  return HtmlService.createHtmlOutputFromFile('tri').getContent();
}

function getKvar() {
  return HtmlService.createHtmlOutputFromFile('kvar').getContent();
}

function getKvin() {
  return HtmlService.createHtmlOutputFromFile('kvin').getContent();
}

function getCustomDomain() {
  return customDomain;
}

function valueOrDefault_(value, defaultValue) {
  var s = value == null ? '' : String(value).trim();
  return s === '' ? defaultValue : s;
}

function defaultSendoloko_() {
  var tz = Session.getScriptTimeZone() || 'Etc/UTC';
  return Utilities.formatDate(new Date(), tz, 'yyyyMMdd') + '9999';
}

function povumoOrDefault_(value) {
  var s = value == null ? '' : String(value);
  return s.trim() === '' ? DEFAULT_POVUMO : s;
}

function addLink(shortStack) {
  var sendoloko = valueOrDefault_(shortStack?.sendoloko, defaultSendoloko_());
  var ricevoloko = valueOrDefault_(shortStack?.ricevoloko, '0');
  var povumo = povumoOrDefault_(shortStack?.povumo);
  var povumozeichen = povumo + '';
  var povumokontroloutk = false;
  var povumokontrolorws = false;
  var apartaaldono = '';

  if ( ( /deu\-wsv/.test(povumozeichen) || /nld\-rws/.test(povumozeichen) ) && /LAT/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

/*
  if (/nld\-rws/.test(povumozeichen) && !/nld\-rws\_hist/.test(povumozeichen)) {
    povumokontrolorws = true;
  }
*/

  if (/\-cmems/.test(povumozeichen) || /\-rws\_hist/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/\-fra\-refmar/.test(povumozeichen)) {
    povumokontroloutk = true;
  }  

  if (/emdentg\-emd\-deu\-cmems/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/borkum_fischerbalje\-bor\-deu\-bfg/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/norderneytg\-nor\-deu\-cmems/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/wangeroogetg\-wan\-deu\-cmems/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/wilhelmshaventg\-wil\-deu\-cmems/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/bremerhaventg\-bre\-deu\-cmems/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/brementg\-bre\-deu\-cmems/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/helgolandtg\-hel\-deu\-cmems/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/cuxhaventg\-cux\-deu\-cmems/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/stpaulitg\-stp\-deu\-cmems/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/buesumtg\-bue\-deu\-cmems/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/husumtg\-hus\-deu\-cmems/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/wittduentg\-wit\-deu\-cmems/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/hoernumtg\-hoe\-deu\-cmems/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/la_jolla_ca\-554a\-usa\-uhslc_rq/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/53\.382698/.test(povumozeichen) && /172\.563438/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/53\.836957/.test(povumozeichen) && /309\.3729326989401/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/53\.756276/.test(povumozeichen) && /320\.0173727138068/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/53\.642089/.test(povumozeichen) && /335\.479994/.test(povumozeichen)) {
    povumokontroloutk = true;
    apartaaldono = 'Oni atentu nur la tempojn de minimumoj, char por ili la konstituantoj estas optimumigitaj.\n';
  }

  if (/53\.642089/.test(povumozeichen) && /325\.719869/.test(povumozeichen)) {
    povumokontroloutk = true;
    apartaaldono = 'Oni atentu nur la tempojn de maksimumoj, char por ili la konstituantoj estas optimumigitaj.\nSe ili estas uzitaj, por kalkuli akvonivelon por alia tempo, la prognozita akvonivelo estas nepreciza kaj ignorinda.\n';
  }

  if (/53\.485666/.test(povumozeichen) && /28\.777775/.test(povumozeichen)) {
    povumokontroloutk = true;
    apartaaldono = 'Oni atentu nur la tempojn de minimumoj, char por ili la konstituantoj estas optimumigitaj.\nSe ili estas uzitaj, por kalkuli akvonivelon por alia tempo, la prognozita akvonivelo estas nepreciza kaj ignorinda.\n';
  }

  if (/53\.485666/.test(povumozeichen) && /15\.299507/.test(povumozeichen)) {
    povumokontroloutk = true;
    apartaaldono = 'Oni atentu nur la tempojn de maksimumoj, char por ili la konstituantoj estas optimumigitaj.\nSe ili estas uzitaj, por kalkuli akvonivelon por alia tempo, la prognozita akvonivelo estas nepreciza kaj ignorinda.\n';
  }

  if (/53\.2458041/.test(povumozeichen) && /281\.426059/.test(povumozeichen)) {
    povumokontroloutk = true;
    apartaaldono = 'Oni atentu nur la tempojn de minimumoj, char por ili la konstituantoj estas optimumigitaj.\nSe ili estas uzitaj, por kalkuli akvonivelon por alia tempo, la prognozita akvonivelo estas nepreciza kaj ignorinda.\n';
  }

  if (/53\.2458041/.test(povumozeichen) && /276\.081228/.test(povumozeichen)) {
    povumokontroloutk = true;
    apartaaldono = 'Oni atentu nur la tempojn de maksimumoj, char por ili la konstituantoj estas optimumigitaj.\nSe ili estas uzitaj, por kalkuli akvonivelon por alia tempo, la prognozita akvonivelo estas nepreciza kaj ignorinda.\n';
  }

  if (/53\.10969/.test(povumozeichen) && /347\.217832/.test(povumozeichen)) {
    povumokontroloutk = true;
    apartaaldono = 'Oni atentu nur la tempojn de minimumoj, char por ili la konstituantoj estas optimumigitaj.\nSe ili estas uzitaj, por kalkuli akvonivelon por alia tempo, la prognozita akvonivelo estas nepreciza kaj ignorinda.\n';
  }

  if (/53\.10969/.test(povumozeichen) && /347\.169921/.test(povumozeichen)) {
    povumokontroloutk = true;
    apartaaldono = 'Oni atentu nur la tempojn de maksimumoj, char por ili la konstituantoj estas optimumigitaj.\nSe ili estas uzitaj, por kalkuli akvonivelon por alia tempo, la prognozita akvonivelo estas nepreciza kaj ignorinda.\n';
  }

  if (/53\.141738/.test(povumozeichen) && /317\.995187/.test(povumozeichen)) {
    povumokontroloutk = true;
    apartaaldono = 'Oni atentu nur la tempojn de minimumoj, char por ili la konstituantoj estas optimumigitaj.\nSe ili estas uzitaj, por kalkuli akvonivelon por alia tempo, la prognozita akvonivelo estas nepreciza kaj ignorinda.\n';
  }

  if (/53\.141738/.test(povumozeichen) && /311\.488437/.test(povumozeichen)) {
    povumokontroloutk = true;
    apartaaldono = 'Oni atentu nur la tempojn de maksimumoj, char por ili la konstituantoj estas optimumigitaj.\nSe ili estas uzitaj, por kalkuli akvonivelon por alia tempo, la prognozita akvonivelo estas nepreciza kaj ignorinda.\n';
  }

  if (/53\.82435/.test(povumozeichen) && /107\.659963/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/53\.629727/.test(povumozeichen) && /333\.600534/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/53\.317505/.test(povumozeichen) && /329\.59618370452847/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/53\.464497/.test(povumozeichen) && /313\.9736550820532/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/53\.670735/.test(povumozeichen) && /306\.73887/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/53\.750813/.test(povumozeichen) && /305\.89634/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/53\.72481/.test(povumozeichen) && /307\.932154/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/53\.968643/.test(povumozeichen) && /294\.823815/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/53\.64079/.test(povumozeichen) && /309\.761301/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/53\.720212/.test(povumozeichen) && /305\.159991/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  if (/51\.500/.test(povumozeichen) && /322\.418451/.test(povumozeichen)) {
    povumokontroloutk = true;
  }

  ricevoloko = (ricevoloko + '').replace(/\,/, '.');

  var jaro = sendoloko.substr(0, 4) * 1;
  var monato = sendoloko.substr(4, 2) * 1;
  var tago = sendoloko.substr(6, 2) * 1;
  var horo = sendoloko.substr(8, 4);

  if (horo == '9999') {
    horo = -1;
  }

  povumo = puriguPovumon(povumo);
  var datumoj1 = createDatumoj1(povumo);

  if (!datumoj1.trim()) {
    return '';
  }

  var horzono = 'LaU: Horzono ne klara. Laueble uzu alternativajn harmonajn konstituantojn.';

  if ( !(/gesla4\.WSV/.test(povumozeichen) || ( /nld\-rws/.test(povumozeichen) && !/nld\-rws\_hist/.test(povumozeichen) ) ) ) {
    horzono = 'LaU: Loka horo au Universala Tempo Kunordigita; vidu la klarigojn';
  }

  if (povumokontroloutk) {
    horzono = 'LaU: Universala Tempo Kunordigita';
  }

/*
  if (povumokontrolorws) {
    horzono = 'LaU: Horzono ne klara. Vidu <a href="https://github.com/openwatersio/tide-database/issues/98" target="">tie</a>. Prefere uzu datumojn kun <code>-rws-hist</code> au <code>-cmems</code>.';
*/  

  var rezulto = main(jaro, monato, tago, horo * 1, ricevoloko * 1, datumoj1, horzono);

  if (horo < 0) {
    rezulto = rezulto.replace(/\nLaU:.+$/s, '\n' + apartaaldono + horzono);
  }

  return rezulto;
}

function main(jaro, monato, tago, zt, referenco, datumoj, horzono) {
  if (zt >= 0.0) {
    var nvo = niv(jaro, monato, tago, zt / 100, 0, referenco, datumoj);
    return (Math.round(nvo * 1000000) / 1000000 + ' m').replace(/\./, ',');
  }

  var z = [];
  var h = [];
  var nw = [];
  var hw = [];
  var min = [];
  var max = [];
  var i;
  var j = 0;
  var k = 0;
  var nwminh1 = 999.9;
  var nwminz1 = '';
  var nwminh2 = 999.9;
  var nwminz2 = '';
  var hwmaxh1 = -999.9;
  var hwmaxz1 = '';
  var hwmaxh2 = -999.9;
  var hwmaxz2 = '';

  for (i = -1; i < 1442; i++) {
    var zt1 = i * 0.01 * 5.0 / 3.0;
    var zt2 = (zt1 - Math.floor(zt1)) * 3 / 5 + Math.floor(zt1);
    z[i] = zt1;
    h[i] = niv(jaro, monato, tago, zt2, 0.0, referenco, datumoj);
  }

  for (i = 0; i < 1441; i++) {
    if (h[i] < h[i - 1] && h[i] < h[i + 1]) {
      nw[j] = z[i];
      min[j] = h[i];
      j++;
    }

    if (h[i] > h[i - 1] && h[i] > h[i + 1]) {
      hw[k] = z[i];
      max[k] = h[i];
      k++;
    }
  }

  var lj = nw.length;
  var lj1 = Math.floor(lj / 2.0);

  for (i = 0; i < lj1; i++) {
    if (min[i] < nwminh1) {
      nwminh1 = min[i];
      nwminz1 = nw[i];
    }
  }

  for (i = lj1; i < lj; i++) {
    if (min[i] < nwminh2) {
      nwminh2 = min[i];
      nwminz2 = nw[i];
    }
  }

  var lk = hw.length;
  var lk1 = Math.floor(lk / 2.0);

  for (i = 0; i < lk1; i++) {
    if (max[i] > hwmaxh1) {
      hwmaxh1 = max[i];
      hwmaxz1 = hw[i];
    }
  }

  for (i = lk1; i < lk; i++) {
    if (max[i] > hwmaxh2) {
      hwmaxh2 = max[i];
      hwmaxz2 = hw[i];
    }
  }

  nwminz1 = (nwminz1 - Math.floor(nwminz1)) * 3 / 5 + Math.floor(nwminz1);
  nwminz2 = (nwminz2 - Math.floor(nwminz2)) * 3 / 5 + Math.floor(nwminz2);
  hwmaxz1 = (hwmaxz1 - Math.floor(hwmaxz1)) * 3 / 5 + Math.floor(hwmaxz1);
  hwmaxz2 = (hwmaxz2 - Math.floor(hwmaxz2)) * 3 / 5 + Math.floor(hwmaxz2);

  var srnwz1 = formatTime(nwminz1);
  var srnwz2 = formatTime(nwminz2);
  var srhwz1 = formatTime(hwmaxz1);
  var srhwz2 = formatTime(hwmaxz2);
  var srnwh1 = formatHeight(nwminh1);
  var srnwh2 = formatHeight(nwminh2);
  var srhwh1 = formatHeight(hwmaxh1);
  var srhwh2 = formatHeight(hwmaxh2);

  if (/999/.test(srnwh1)) {
    srnwh1 = '';
    srnwz1 = '';
  }

  if (/999/.test(srnwh2)) {
    srnwh2 = '';
    srnwz2 = '';
  }

  if (/999/.test(srhwh1)) {
    srhwh1 = '';
    srhwz1 = '';
  }

  if (/999/.test(srhwh2)) {
    srhwh2 = '';
    srhwz2 = '';
  }

  return srnwz1 + srnwh1 + '\n' + srnwz2 + srnwh2 + '\n' + srhwz1 + srhwh1 + '\n' + srhwz2 + srhwh2 + '\n' + horzono;
}

function niv(jaro, monato, tago, zt1, td, referenco, datumoj) {
  var zp = (zt1 - Math.floor(zt1)) * 5 / 3 + Math.floor(zt1) + td;
  var gt = Math.floor(30.6001 * (1 + monato + 12 * Math.floor(1 / (monato + 1) + 0.7))) + Math.floor(365.25 * (jaro - Math.floor(1 / (monato + 1) + 0.7))) + tago + zp / 24 - 723258;
  var s = 78.16001 + 13.17639673 * gt;
  var h0 = 279.82 + 0.98564734 * gt;
  var pp = 349.5 + 0.11140408 * gt;
  var ns = 208.1 + 0.05295392 * gt;
  var n90 = 90;
  var q = 282.6 + 0.000047069 * gt;

  const components = (datumoj + '')
    .trim()
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      const p = line.trim().split(/\s+/);
      return {
        nomo: p[0],
        a: parseFloat(p[1]),
        u: parseFloat(p[2]) * Math.PI / 180,
        kh0s: parseFloat(p[3]),
        ks: parseFloat(p[4]),
        kh0: parseFloat(p[5]),
        kpp: parseFloat(p[6]),
        kns: parseFloat(p[7]),
        kq: parseFloat(p[8]),
        kn90: parseFloat(p[9])
      };
    });

  let h2 = 0;

  for (let c of components) {
    var argumento = (c.kh0s * zp * 15 + s * (c.ks - c.kh0s) + h0 * (c.kh0 + c.kh0s) + pp * c.kpp + ns * c.kns + q * c.kq + n90 * c.kn90) * Math.PI / 180 - c.u;
    h2 += c.a * Math.cos(argumento);

    if (c.nomo == 'M2') {
      h2 -= c.a / 27 * Math.cos((c.kh0s * zp * 15 + s * (c.ks - c.kh0s) + h0 * (c.kh0 + c.kh0s) + pp * c.kpp + ns * (c.kns - 1) + q * c.kq + n90 * c.kn90) * Math.PI / 180 - c.u);
    }

    if (c.nomo == 'O1') {
      h2 += c.a / 5.3 * Math.cos((c.kh0s * zp * 15 + s * (c.ks - c.kh0s) + h0 * (c.kh0 + c.kh0s) + pp * c.kpp + ns * (c.kns - 1) + q * c.kq + n90 * c.kn90) * Math.PI / 180 - c.u);
    }

    if (c.nomo == 'K1') {
      h2 += c.a / 7.4 * Math.cos((c.kh0s * zp * 15 + s * (c.ks - c.kh0s) + h0 * (c.kh0 + c.kh0s) + pp * c.kpp + ns * (c.kns + 1) + q * c.kq + n90 * c.kn90) * Math.PI / 180 - c.u);
    }

    if (c.nomo == 'S2') {
      h2 += c.a / 12 * Math.cos((c.kh0s * zp * 15 + s * (c.ks - c.kh0s) + h0 * (c.kh0 + c.kh0s + 2) + pp * c.kpp + ns * (c.kns + 1) + q * c.kq + n90 * c.kn90) * Math.PI / 180 - c.u);
    }
  }

  return h2 / 100 + referenco / 100;
}

function createDatumoj1(ticon4) {
  return (ticon4 + '')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .map(line => {
      const parts = line.split(/,/);
      const name = parts[2];
      const amplitude = parts[3];
      const phase = parts[4];
      const numbers = HARMONIC_DATA[name];

      if (!numbers) {
        return '';
      }

      return `${name} ${amplitude} ${phase} ${numbers.join(' ')}`;
    })
    .filter(line => line)
    .join('\n');
}

function skribiKonstituantojnKajDoodson(input) {
  var povumo = '';
   
  if (typeof input === 'object' && input !== null) {
    povumo = povumoOrDefault_(input?.povumo);
   } else {
    povumo = povumoOrDefault_(input);
  }

  povumo = puriguPovumon(povumo);
  var teksto = createDatumoj1(povumo);

  const spreadsheetId = '1qFDaJeq2zCPmwGbbxtswWhSrJvBJuNoch3vXrRmheDU';
  const sheetName = 'konstituantojkajdoodson';

  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error('Tabellenblatt "' + sheetName + '" nicht gefunden.');
  }

  sheet.getRange('A5').setValue(teksto).setWrap(true);

  return {
    sukcesa: true,
    nombro: teksto.trim() ? teksto.trim().split('\n').length : 0,
    teksto: teksto
  };
}

function getCurve(shortStack) {
  var sendoloko = valueOrDefault_(shortStack?.sendoloko, defaultSendoloko_());
  var ricevoloko = valueOrDefault_(shortStack?.ricevoloko, '0');
  var povumo = povumoOrDefault_(shortStack?.povumo);

  ricevoloko = (ricevoloko + '').replace(/\,/, '.');

  var jaro = sendoloko.substr(0, 4) * 1;
  var monato = sendoloko.substr(4, 2) * 1;
  var tago = sendoloko.substr(6, 2) * 1;
  var horo = sendoloko.substr(8, 4);

  povumo = puriguPovumon(povumo);

    povumo = puriguPovumon(povumo);

  try {
    skribiKonstituantojnKajDoodson({ povumo: povumo });
  } catch (e) {
    console.error(e);
  }

  var datumoj1 = createDatumoj1(povumo);

  var datumoj1 = createDatumoj1(povumo);

  if (!datumoj1.trim()) {
    return {
      points: [],
      startLabel: '',
      endLabel: ''
    };
  }

  var startDate;
  var endDate;

  if (horo == '9999') {
    var extremoj = getExtremojPorKurbo(jaro, monato, tago, ricevoloko * 1, datumoj1);

    if (extremoj.length > 0) {
      var plejfrua = extremoj[0];
      var plejmalfrua = extremoj[0];

      for (var i = 1; i < extremoj.length; i++) {
        if (extremoj[i].getTime() < plejfrua.getTime()) {
          plejfrua = extremoj[i];
        }

        if (extremoj[i].getTime() > plejmalfrua.getTime()) {
          plejmalfrua = extremoj[i];
        }
      }

      startDate = new Date(plejfrua.getTime() - 2 * 60 * 60 * 1000);
      endDate = new Date(plejmalfrua.getTime() + 2 * 60 * 60 * 1000);
    } else {
      startDate = new Date(Date.UTC(jaro, monato - 1, tago, 0, 0, 0));
      endDate = new Date(Date.UTC(jaro, monato - 1, tago, 24, 0, 0));
    }
  } else {
    var hh = horo.substr(0, 2) * 1;
    var mm = horo.substr(2, 2) * 1;
    var centreDate = new Date(Date.UTC(jaro, monato - 1, tago, hh, mm, 0));
    startDate = new Date(centreDate.getTime() - 12 * 60 * 60 * 1000);
    endDate = new Date(centreDate.getTime() + 12 * 60 * 60 * 1000);
  }

  var punktoj = [];
  var stepMinutes = 10;

  for (var t = startDate.getTime(); t <= endDate.getTime(); t += stepMinutes * 60 * 1000) {
    var d = new Date(t);
    var yy = d.getUTCFullYear();
    var mo = d.getUTCMonth() + 1;
    var da = d.getUTCDate();
    var ho = d.getUTCHours();
    var mi = d.getUTCMinutes();
    var zt1 = ho + mi / 100;
    var akvonivelo = niv(yy, mo, da, zt1, 0.0, ricevoloko * 1, datumoj1);

    punktoj.push({
      t: t,
      label: twoDigits(da) + '.' + twoDigits(mo) + '. ' + twoDigits(ho) + ':' + twoDigits(mi),
      h: akvonivelo
    });
  }

  return {
    points: punktoj,
    startLabel: punktoj.length ? punktoj[0].label : '',
    endLabel: punktoj.length ? punktoj[punktoj.length - 1].label : ''
  };
}

function getExtremojPorKurbo(jaro, monato, tago, referenco, datumoj) {
  var hh = [];
  var extremoj = [];

  for (var i = -1; i < 1442; i++) {
    var zt1 = i * 0.01 * 5.0 / 3.0;
    var zt2 = (zt1 - Math.floor(zt1)) * 3 / 5 + Math.floor(zt1);
    hh[i] = niv(jaro, monato, tago, zt2, 0.0, referenco, datumoj);
  }

  for (var j = 0; j < 1441; j++) {
    if (hh[j] < hh[j - 1] && hh[j] < hh[j + 1]) {
      extremoj.push(new Date(Date.UTC(jaro, monato - 1, tago, 0, j, 0)));
    }

    if (hh[j] > hh[j - 1] && hh[j] > hh[j + 1]) {
      extremoj.push(new Date(Date.UTC(jaro, monato - 1, tago, 0, j, 0)));
    }
  }

  return extremoj;
}

function puriguPovumon(povumo) {
  povumo = povumo + '';

  for (const r of POVUMO_PATTERNS) {
    povumo = povumo.replace(r, '\n');
  }

  return povumo;
}

function formatTime(x) {
  var s = Math.round(x * 100) / 100 + ' LaU ';
  s = s.replace(/\./, ':');

  if (/\:\d LaU/.test(s)) {
    s = s.replace(/ LaU/, '0 LaU');
  }

  if (!/\:/.test(s)) {
    s = s.replace(/ LaU/, ':00 LaU');
  }

  s = s.replace(/(\d+):60 LaU /, function(match, horo60) {
    return parseInt(horo60, 10) + 1 + ':00 LaU ';
  });

  if (s.length == 9) {
    s = '0' + s;
  }

  return s;
}

function formatHeight(x) {
  var s = Math.round(x * 10) / 10 + ' m';
  s = s.replace(/\./, ',');

  if (!/\d\,\d m/.test(s)) {
    s = s.replace(/ m/, ',0 m');
  }

  return s;
}

function twoDigits(x) {
  x = x * 1;

  if (x < 10) {
    return '0' + x;
  }

  return '' + x;
}

function autorisierenLokoj() {
  UrlFetchApp.fetch('https://raw.githubusercontent.com/openwatersio/tide-database/refs/heads/main/data/ticon/brake-4970020-deu-wsv.json');
}

function serchiPegelon(tideGaugeName) {
  if (!tideGaugeName || tideGaugeName.trim() === '') {
    return {
      sukcesa: false,
      mesagho: 'Bonvole enigu tide_gauge_name.'
    };
  }

  const nomo = tideGaugeName.trim();
  const rezulto = akiriAlternativajnKonstituantojn_(nomo);

  if (!rezulto.sukcesa) {
    return {
      sukcesa: false,
      mesagho: rezulto.mesagho,
      fonto: rezulto.url,
      fontoteksto: 'Fonto: ' + rezulto.url,
      url: rezulto.url
    };
  }

  return {
    sukcesa: true,
    nomo: nomo + ' ' + rezulto.url,
    tide_gauge_name: nomo,
    nombro: rezulto.nombro,
    fonto: rezulto.url,
    fontoteksto: 'Fonto: ' + rezulto.url,
    url: rezulto.url,
    teksto: rezulto.teksto
  };
}

function akiriAlternativajnKonstituantojn_(nomo) {
  const url = LOKOJ_ALT_JSON_BASE_URL + encodeURIComponent(nomo) + '.json';

  try {
    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true
    });

    const status = response.getResponseCode();

    if (status !== 200) {
      return {
        petita: true,
        sukcesa: false,
        url: url,
        mesagho: 'Konstituantoj ne trovitaj. HTTP-statuso: ' + status
      };
    }

    const jsonText = response.getContentText('UTF-8');
    const data = JSON.parse(jsonText);
    const pozicio = troviLatLon_(data);

    if (!pozicio) {
      return {
        petita: true,
        sukcesa: false,
        url: url,
        mesagho: 'Latitudo kaj longitudo ne trovitaj en la JSON-dosiero.'
      };
    }

    const konstituantoj = eltiriKonstituantojn_(data);

    if (!konstituantoj || konstituantoj.length === 0) {
      return {
        petita: true,
        sukcesa: false,
        url: url,
        mesagho: 'Konstituantoj ne trovitaj en la JSON-dosiero.'
      };
    }

    const datumo = troviDatumon_(data) || 'Unspecified';

    const linioj = konstituantoj
      .filter(k => String(k.name).toUpperCase() !== 'MKS2')
      .filter(k => k.name && isFinite(k.amplitude) && isFinite(k.phase))
      .map(k => {
        const amplitudeCm = Number(k.amplitude) * 100;

        return [
          pozicio.lat,
          pozicio.lon,
          k.name,
          amplitudeCm,
          k.phase,
          nomo,
          datumo
        ].join(',');
      });

    if (linioj.length === 0) {
      return {
        petita: true,
        sukcesa: false,
        url: url,
        mesagho: 'Neniuj uzeblaj konstituantoj trovitaj.'
      };
    }

    return {
      petita: true,
      sukcesa: true,
      url: url,
      nombro: linioj.length,
      teksto: linioj.join('\n')
    };
  } catch (e) {
    console.error(e);

    return {
      petita: true,
      sukcesa: false,
      url: url,
      mesagho: 'Eraro dum legado de konstituantoj: ' + e.message
    };
  }
}

function troviLatLon_(data) {
  const kandidatoj = [
    data,
    data && data.station,
    data && data.site,
    data && data.location,
    data && data.metadata,
    data && data.properties
  ];

  for (const obj of kandidatoj) {
    if (!obj || typeof obj !== 'object') {
      continue;
    }

    const lat = firstNumber_(obj, ['lat', 'latitude', 'Latitude', 'LAT']);
    const lon = firstNumber_(obj, ['lon', 'lng', 'long', 'longitude', 'Longitude', 'LON', 'LNG']);

    if (lat !== null && lon !== null) {
      return {
        lat: lat,
        lon: lon
      };
    }

    const coords = getValueCaseInsensitive_(obj, ['coordinates', 'coordinate']);

    if (Array.isArray(coords) && coords.length >= 2) {
      const lon2 = asNumber_(coords[0]);
      const lat2 = asNumber_(coords[1]);

      if (lat2 !== null && lon2 !== null) {
        return {
          lat: lat2,
          lon: lon2
        };
      }
    }
  }

  if (data && data.geometry && Array.isArray(data.geometry.coordinates) && data.geometry.coordinates.length >= 2) {
    const lon = asNumber_(data.geometry.coordinates[0]);
    const lat = asNumber_(data.geometry.coordinates[1]);

    if (lat !== null && lon !== null) {
      return {
        lat: lat,
        lon: lon
      };
    }
  }

  return null;
}

function eltiriKonstituantojn_(data) {
  const eblajUjoj = [
    data && data.constituents,
    data && data.harmonics,
    data && data.harmonic_constituents,
    data && data.harmonicConstituents,
    data && data.tidal_constituents,
    data && data.tide_constituents,
    data && data.data && data.data.constituents,
    data && data.data && data.data.harmonics,
    data && data.data && data.data.harmonic_constituents,
    data && data.data && data.data.harmonicConstituents,
    data && data.properties && data.properties.constituents,
    data && data.properties && data.properties.harmonics,
    data && data.properties && data.properties.harmonic_constituents,
    data && data.properties && data.properties.harmonicConstituents
  ];

  for (const ujo of eblajUjoj) {
    const listo = normaligiKonstituantojn_(ujo);

    if (listo.length > 0) {
      return listo;
    }
  }

  const listo = normaligiKonstituantojn_(data);

  if (listo.length > 0) {
    return listo;
  }

  return [];
}

function normaligiKonstituantojn_(ujo) {
  const rezulto = [];

  if (!ujo) {
    return rezulto;
  }

  if (Array.isArray(ujo)) {
    ujo.forEach(item => {
      const k = parseKonstituanto_(item, null);

      if (k) {
        rezulto.push(k);
      }
    });

    return rezulto;
  }

  if (typeof ujo === 'object') {
    Object.keys(ujo).forEach(name => {
      const value = ujo[name];
      const k = parseKonstituanto_(value, name);

      if (k) {
        rezulto.push(k);
      }
    });
  }

  return rezulto;
}

function parseKonstituanto_(item, fallbackName) {
  if (!item) {
    return null;
  }

  if (typeof item === 'object' && !Array.isArray(item)) {
    const name = getValueCaseInsensitive_(item, [
      'name',
      'constituent',
      'constituentName',
      'symbol',
      'id'
    ]) || fallbackName;

    const amplitude = firstNumber_(item, [
      'amplitude',
      'amplitude_m',
      'amp',
      'A',
      'h'
    ]);

    const phase = firstNumber_(item, [
      'phase',
      'phase_GMT',
      'phase_deg',
      'phase_degrees',
      'epoch',
      'g'
    ]);

    if (name && amplitude !== null && phase !== null) {
      return {
        name: String(name).trim(),
        amplitude: amplitude,
        phase: phase
      };
    }
  }

  if (Array.isArray(item)) {
    let name = fallbackName;
    let zahlen = [];

    item.forEach(v => {
      const n = asNumber_(v);

      if (n !== null) {
        zahlen.push(n);
      } else if (!name && typeof v === 'string') {
        name = v;
      }
    });

    if (name && zahlen.length >= 2) {
      let amplitude;
      let phase;

      if (Math.abs(zahlen[0]) <= 20 && Math.abs(zahlen[1]) > 20) {
        amplitude = zahlen[0];
        phase = zahlen[1];
      } else if (Math.abs(zahlen[1]) <= 20 && Math.abs(zahlen[0]) > 20) {
        phase = zahlen[0];
        amplitude = zahlen[1];
      } else {
        amplitude = zahlen[0];
        phase = zahlen[1];
      }

      return {
        name: String(name).trim(),
        amplitude: amplitude,
        phase: phase
      };
    }
  }

  return null;
}

function firstNumber_(obj, keys) {
  const v = getValueCaseInsensitive_(obj, keys);
  return asNumber_(v);
}

function getValueCaseInsensitive_(obj, keys) {
  if (!obj || typeof obj !== 'object') {
    return null;
  }

  const objKeys = Object.keys(obj);

  for (const wanted of keys) {
    const foundKey = objKeys.find(k => k.toLowerCase() === wanted.toLowerCase());

    if (foundKey !== undefined) {
      return obj[foundKey];
    }
  }

  return null;
}

function asNumber_(v) {
  if (v === null || v === undefined || v === '') {
    return null;
  }

  if (typeof v === 'number') {
    return isFinite(v) ? v : null;
  }

  if (typeof v === 'string') {
    const n = Number(v.trim().replace(',', '.'));
    return isFinite(n) ? n : null;
  }

  return null;
}

function troviGeslaFonton_(data) {
  const valoro = troviTekstonLauShlosiloj_(data, [
    'gesla_source',
    'geslaSource',
    'gesla-source',
    'gesla source',
    'gesla',
    'source',
    'data_source',
    'datasource',
    'dataset',
    'provider'
  ]);

  if (valoro && /gesla/i.test(valoro)) {
    return valoro;
  }

  const iuGeslaValoro = troviTekstonLauEnhavo_(data, /gesla/i);

  if (iuGeslaValoro) {
    return iuGeslaValoro;
  }

  return valoro || '';
}

function troviDatumon_(data) {
  const rekta = troviTekstonLauShlosiloj_(data, [
    'datum',
    'datums',
    'vertical_datum',
    'verticalDatum',
    'height_datum',
    'heightDatum',
    'reference_datum',
    'referenceDatum',
    'tidal_datum',
    'tidalDatum',
    'chart_datum',
    'chartDatum',
    'hydrographic_datum',
    'hydrographicDatum',
    'zero_hydrographique',
    'zeroHydrographique'
  ]);

  const rektaDatumo = eltiriDatumonElTeksto_(rekta);

  if (rektaDatumo) {
    return rektaDatumo;
  }

  const lauShlosilo = troviTekstonLauShlosilaEnhavo_(data, function(key) {
    return /datum|datums|vertical|height|reference|chart|hydrograph|zero/i.test(key);
  });

  const lauShlosiloDatumo = eltiriDatumonElTeksto_(lauShlosilo);

  if (lauShlosiloDatumo) {
    return lauShlosiloDatumo;
  }

  const lauEnhavo = troviTekstonLauEnhavo_(data, /Zero Hydrographique|Unspecified Common Datum|Unspecified|Chart Datum|Lowest Astronomical Tide|LAT|Admiralty Chart Datum|Australian Height Datum|Ordnance Datum|Normal Amsterdam Level|DHHN92|DVR90|NAVD.?88|MSL/i);
  const lauEnhavoDatumo = eltiriDatumonElTeksto_(lauEnhavo);

  if (lauEnhavoDatumo) {
    return lauEnhavoDatumo;
  }

  return '';
}

function troviTekstonLauShlosiloj_(obj, keys) {
  if (!obj || typeof obj !== 'object') {
    return '';
  }

  if (Array.isArray(obj)) {
    for (const item of obj) {
      const trovita = troviTekstonLauShlosiloj_(item, keys);

      if (trovita) {
        return trovita;
      }
    }

    return '';
  }

  const objKeys = Object.keys(obj);

  for (const wanted of keys) {
    const foundKey = objKeys.find(k => k.toLowerCase() === wanted.toLowerCase());

    if (foundKey !== undefined) {
      const v = obj[foundKey];

      if (typeof v === 'string' && v.trim()) {
        return v.trim();
      }

      if (typeof v === 'number' && isFinite(v)) {
        return String(v);
      }
    }
  }

  for (const key of objKeys) {
    const trovita = troviTekstonLauShlosiloj_(obj[key], keys);

    if (trovita) {
      return trovita;
    }
  }

  return '';
}

function troviTekstonLauEnhavo_(obj, pattern) {
  if (!obj || typeof obj !== 'object') {
    if (typeof obj === 'string' && pattern.test(obj)) {
      return obj.trim();
    }

    return '';
  }

  if (Array.isArray(obj)) {
    for (const item of obj) {
      const trovita = troviTekstonLauEnhavo_(item, pattern);

      if (trovita) {
        return trovita;
      }
    }

    return '';
  }

  for (const key of Object.keys(obj)) {
    const v = obj[key];

    if (typeof v === 'string' && pattern.test(v)) {
      return v.trim();
    }

    const trovita = troviTekstonLauEnhavo_(v, pattern);

    if (trovita) {
      return trovita;
    }
  }

  return '';
}

function eltiriDatumonElTeksto_(teksto) {
  if (!teksto) {
    return '';
  }

  const s = String(teksto).trim();

  if (!s) {
    return '';
  }

  const konatajDatumoj = [
    /Zero Hydrographique/i,
    /Unspecified Common Datum/i,
    /Unspecified/i,
    /Chart Datum \/ Lowest Astronomical Tide/i,
    /Lowest Astronomical Tide/i,
    /Admiralty Chart Datum \(ACD\)/i,
    /Admiralty Chart Datum/i,
    /Australian Height Datum/i,
    /Ordnance Datum Malin Head/i,
    /Ordnance Datum/i,
    /Normal Amsterdam Level/i,
    /NAVD.?88/i,
    /DHHN92 \/ Amsterdam/i,
    /DHHN92/i,
    /DVR90/i,
    /MSL/i,
    /Mean Sea Level/i,
    /Station Datum/i,
    /Local Chart Datum/i,
    /Chart Datum/i,
    /LAT/i
  ];

  for (const r of konatajDatumoj) {
    const m = s.match(r);

    if (m) {
      return m[0];
    }
  }

  if (/datum|hydrograph|vertical|height|reference|zero/i.test(s) && s.length <= 120) {
    return s;
  }

  return '';
}

function troviTekstonLauShlosilaEnhavo_(obj, keyPredicate) {
  if (!obj || typeof obj !== 'object') {
    return '';
  }

  if (Array.isArray(obj)) {
    for (const item of obj) {
      const trovita = troviTekstonLauShlosilaEnhavo_(item, keyPredicate);

      if (trovita) {
        return trovita;
      }
    }

    return '';
  }

  const keys = Object.keys(obj);

  for (const key of keys) {
    if (!keyPredicate(key)) {
      continue;
    }

    const v = obj[key];
    const teksto = valoroAlTeksto_(v);

    if (teksto) {
      return teksto;
    }
  }

  for (const key of keys) {
    const trovita = troviTekstonLauShlosilaEnhavo_(obj[key], keyPredicate);

    if (trovita) {
      return trovita;
    }
  }

  return '';
}

function valoroAlTeksto_(v) {
  if (v === null || v === undefined || v === '') {
    return '';
  }

  if (typeof v === 'string') {
    return v.trim();
  }

  if (typeof v === 'number' && isFinite(v)) {
    return String(v);
  }

  if (Array.isArray(v)) {
    for (const item of v) {
      const teksto = valoroAlTeksto_(item);

      if (teksto) {
        return teksto;
      }
    }

    return '';
  }

  if (typeof v === 'object') {
    const preferatajShlosiloj = [
      'name',
      'Name',
      'title',
      'Title',
      'datum',
      'Datum',
      'value',
      'Value',
      'description',
      'Description',
      'label',
      'Label'
    ];

    for (const key of preferatajShlosiloj) {
      if (Object.prototype.hasOwnProperty.call(v, key)) {
        const teksto = valoroAlTeksto_(v[key]);

        if (teksto) {
          return teksto;
        }
      }
    }

    for (const key of Object.keys(v)) {
      const teksto = valoroAlTeksto_(v[key]);

      if (teksto) {
        return teksto;
      }
    }
  }

  return '';
}
