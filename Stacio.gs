/*
 * Stacioj.gs
 *
 * Stationskatalog und Stationsabruf für die Wasserstands-Web-App.
 * Der vorhandene Code mit doGet(), addLink(), getCurve(),
 * troviLatLon_(), eltiriKonstituantojn_(), troviDatumon_() und
 * HARMONIC_DATA bleibt im selben Apps-Script-Projekt bestehen.
 */

const STACIO_REPO_ = 'openwatersio/slackwater-database';
const STACIO_BRANCH_ = 'main';
const STACIO_DIR_ = 'data/ticon';
const STACIO_CACHE_SECONDS_ = 21600;
const STACIO_CACHE_KEY_ = 'ow-stacioj-v1-manifest';
const STACIO_MAX_TRAFOJ_ = 60;

/*
 * Öffentliche Funktion für google.script.run.
 * Gibt Stationsnamen, NICHT die Konstituenten zurück.
 */
function serchiStaciojn(demando) {
  const originala = String(demando || '').trim();

  if (originala.length < 2 || originala.length > 200) {
    throw new Error('Bonvolu enigi inter 2 kaj 200 signojn.');
  }

  const serchata = normigiStacion_(originala);
  if (!serchata) {
    throw new Error('Bonvolu enigi loknomon au tide_gauge_name.');
  }

  const vortoj = serchata.split(' ');
  const kompakta = vortoj.join('');
  const ekzakte = originala.toLowerCase();
  const nomoj = legiStaciajnNomojn_();
  const trafoj = [];

  nomoj.forEach(function(nomo) {
    const normigita = normigiStacion_(nomo);
    const senSpacoj = normigita.replace(/ /g, '');
    let rango;

    if (nomo.toLowerCase() === ekzakte) {
      rango = 0;
    } else if (normigita === serchata) {
      rango = 1;
    } else if (normigita.indexOf(serchata) === 0) {
      rango = 2;
    } else if (normigita.indexOf(serchata) >= 0) {
      rango = 3;
    } else if (vortoj.every(function(v) {
      return normigita.indexOf(v) >= 0;
    })) {
      // Beispielsweise Ortsname und Länderkürzel in anderer Reihenfolge.
      rango = 4;
    } else if (senSpacoj.indexOf(kompakta) >= 0) {
      rango = 5;
    } else {
      return;
    }

    trafoj.push({ nomo: nomo, rango: rango });
  });

  trafoj.sort(function(a, b) {
    return a.rango - b.rango ||
      (a.nomo < b.nomo ? -1 : a.nomo > b.nomo ? 1 : 0);
  });

  return {
    nombro: trafoj.length,
    nomoj: trafoj.slice(0, STACIO_MAX_TRAFOJ_).map(function(t) {
      return t.nomo;
    })
  };
}

function normigiStacion_(teksto) {
  return String(teksto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/ø/g, 'o')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/*
 * Öffentliche Funktion für google.script.run.
 * Akzeptiert eine konkrete Kennung, keinen Suchbegriff und keine URL.
 */
function shargiStacion(nomo) {
  nomo = String(nomo || '').trim();

  if (!nomo || nomo.length > 250 || /[\/\\\x00-\x1f]/.test(nomo)) {
    throw new Error('Nevalida stacia nomo.');
  }

  const url = 'https://raw.githubusercontent.com/' +
    STACIO_REPO_ + '/' + STACIO_BRANCH_ + '/' + STACIO_DIR_ +
    '/' + encodeURIComponent(nomo) + '.json';

  const response = UrlFetchApp.fetch(url, {
    muteHttpExceptions: true,
    followRedirects: true
  });

  if (response.getResponseCode() !== 200) {
    throw new Error(
      'Ne eblis shargi la stacion ' + nomo +
      ' (HTTP ' + response.getResponseCode() + ').'
    );
  }

  const data = JSON.parse(response.getContentText('UTF-8'));
  const pozicio = troviLatLon_(data);
  if (!pozicio) {
    throw new Error('Latitudo kaj longitudo ne trovitaj por ' + nomo + '.');
  }

  const datumo = troviDatumon_(data) || 'Unspecified';
  const linioj = [];

  eltiriKonstituantojn_(data).forEach(function(k) {
    const nomoK = String(k.name || '').trim().toUpperCase();
    const a = Number(k.amplitude);
    const g = Number(k.phase);

    // Wie beim bisherigen Open-Waters-Abruf: MKS2 nicht verwenden.
    // Nur Konstituenten übernehmen, die der Rechner verarbeiten kann.
    if (nomoK === 'MKS2' ||
        !Object.prototype.hasOwnProperty.call(HARMONIC_DATA, nomoK) ||
        !Number.isFinite(a) || !Number.isFinite(g)) {
      return;
    }

    // Open Waters: Amplitude in m; Eingabe des Rechners: cm.
    linioj.push([
      pozicio.lat, pozicio.lon, nomoK, a * 100, g, nomo, datumo
    ].join(','));
  });

  if (!linioj.length) {
    throw new Error('Neniuj uzeblaj konstituantoj por ' + nomo + '.');
  }

  const teksto = linioj.join('\n');

  // Vor der Übernahme dieselbe Eingabeprüfung wie bei der Berechnung.
  prepariDatumojn_(teksto);

  return {
    nomo: nomo,
    fonto: url,
    nombro: linioj.length,
    teksto: teksto
  };
}

/*
 * Liest die Stationskennungen aus der lokalen Projektdatei
 * stacionomoj.html. Für eine Suche ist keine GitHub-Anfrage nötig.
 */
function legiStaciajnNomojn_() {
  let teksto;

  try {
    teksto = HtmlService
      .createHtmlOutputFromFile('stacionomoj')
      .getContent();
  } catch (err) {
    throw new Error(
      'Ne eblis legi la lokan stacian katalogon. ' +
      'Kontrolu, chu la projekto enhavas la dosieron stacionomoj.html.'
    );
  }

  const nomoj = teksto
    .replace(/^\uFEFF/, '')   // Eventuelle UTF-8-BOM entfernen
    .split(/\r\n|\n|\r/)
    .map(function(linio) {
      return linio.trim();
    })
    .filter(function(linio) {
      return linio !== '';
    });

  if (!nomoj.length) {
    throw new Error('La loka stacia katalogo estas malplena.');
  }

  if (nomoj.some(function(nomo) {
    return /[<>\/\\]/.test(nomo) || /\.json$/i.test(nomo);
  })) {
    throw new Error(
      'La dosiero stacionomoj.html enhavu nur staciajn nomojn: ' +
      'unu nomon en chiu linio, sen HTML-etikedoj kaj sen .json.'
    );
  }

  return Array.from(new Set(nomoj));
}

function legiStacianArbon_(url) {
  const r = UrlFetchApp.fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
    muteHttpExceptions: true,
    followRedirects: true
  });

  const code = r.getResponseCode();
  if (code === 403 || code === 429) {
    throw new Error(
      'GitHub momente ne permesas pliajn katalogpetojn. ' +
      'Bonvolu reprovi poste.'
    );
  }
  if (code !== 200) {
    throw new Error('Ne eblis legi la stacian katalogon (HTTP ' + code + ').');
  }

  const tree = JSON.parse(r.getContentText('UTF-8'));
  if (!Array.isArray(tree.tree) || tree.truncated) {
    throw new Error('GitHub ne liveris kompletan stacian katalogon.');
  }
  return tree;
}
