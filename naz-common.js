/**
 * naz-common.js — Shared pricing & zone logic for Nazounki prototype
 * Include before page-specific scripts in all prototype HTML files.
 */

// ── Zone pricing (monthly) — annual = monthly × ANNUAL_MULT ──────────────────
const ZONE_PRICES = {
  africa: { solo: 15,  pro: 50,  institution: 500,  base: 500,  perMed: 10 },
  europe: { solo: 150, pro: 500, institution: 1500, base: 1500, perMed: 30 }
};

// ── Country → zone mapping ────────────────────────────────────────────────────
const COUNTRY_ZONES = {
  'Algérie':'africa','Bénin':'africa','Burkina Faso':'africa','Cameroun':'africa',
  'Congo':'africa',"Côte d'Ivoire":'africa','Gabon':'africa','Ghana':'africa',
  'Guinée':'africa','Kenya':'africa','Madagascar':'africa','Mali':'africa',
  'Maroc':'africa','Niger':'africa','Nigeria':'africa','RDC':'africa',
  'Sénégal':'africa','Togo':'africa','Tunisie':'africa',
  'Allemagne':'europe','Belgique':'europe','Espagne':'europe','France':'europe',
  'Italie':'europe','Luxembourg':'europe','Pays-Bas':'europe','Portugal':'europe',
  'Royaume-Uni':'europe','Suisse':'europe'
};

// Annual multiplier: 12 months − 2 free = 10
const ANNUAL_MULT = 10;

// ── Exchange rates ────────────────────────────────────────────────────────────
const FALLBACK = { XOF: 655.957, MAD: 10.8 };
let rates = { ...FALLBACK };

function fetchRates(callback) {
  fetch('https://api.exchangerate-api.com/v4/latest/EUR')
    .then(r => r.json())
    .then(data => {
      if (data.rates) {
        rates.XOF = data.rates.XOF || FALLBACK.XOF;
        rates.MAD = data.rates.MAD || FALLBACK.MAD;
      }
      callback();
    })
    .catch(() => callback());
}

// ── Local currency conversion display ────────────────────────────────────────
// Returns HTML string "≈ XXXXX XOF · ≈ XXX MAD" for Africa zone, '' for Europe
function fmtConv(eur) {
  const zone = localStorage.getItem('naz_zone') || 'africa';
  if (zone === 'europe' || !eur) return '';
  const xof = Math.round(eur * rates.XOF).toLocaleString('fr-FR');
  const mad = Math.round(eur * rates.MAD).toLocaleString('fr-FR');
  return `≈ <span class="conv-val">${xof} XOF</span> &nbsp;·&nbsp; ≈ <span class="conv-val">${mad} MAD</span>`;
}

// ── Country select handler (inscription forms) ────────────────────────────────
// Expects: <select id="paysSelect"> and <div id="zone-indicator"> on the page.
// Calls calcPrice() if it exists (institution form).
function onPaysChange() {
  const pays = document.getElementById('paysSelect').value;
  const zone = COUNTRY_ZONES[pays];
  const indicator = document.getElementById('zone-indicator');
  if (zone) {
    localStorage.setItem('naz_zone', zone);
    indicator.innerHTML = zone === 'europe'
      ? '<i class="fa fa-globe-europe me-1 text-primary"></i><span class="text-primary fw-semibold">Zone Europe</span> — tarification Europe appliquée'
      : '<i class="fa fa-globe-africa me-1 text-success"></i><span class="text-success fw-semibold">Zone Afrique</span> — tarification Afrique appliquée';
  } else {
    indicator.innerHTML = pays
      ? '<span class="text-muted"><i class="fa fa-question-circle me-1"></i>Zone non déterminée — vous la sélectionnerez à l\'étape suivante</span>'
      : '';
  }
  if (typeof calcPrice === 'function') calcPrice();
}

// ── Zone button helpers (plan screens with zone toggle) ───────────────────────
// setZone(zone, refreshFn) — called by zone button onclick
// initZoneUI(refreshFn)    — call once on load to sync buttons + display

function setZone(zone, refreshFn) {
  localStorage.setItem('naz_zone', zone);
  const af = document.getElementById('zoneAfricaBtn');
  const eu = document.getElementById('zoneEuropeBtn');
  if (af) af.classList.toggle('active', zone === 'africa');
  if (eu) eu.classList.toggle('active', zone === 'europe');
  if (typeof refreshFn === 'function') refreshFn();
}

function initZoneUI(refreshFn) {
  const zone = localStorage.getItem('naz_zone') || 'africa';
  const af = document.getElementById('zoneAfricaBtn');
  const eu = document.getElementById('zoneEuropeBtn');
  if (af) af.classList.toggle('active', zone === 'africa');
  if (eu) eu.classList.toggle('active', zone === 'europe');
  if (typeof refreshFn === 'function') refreshFn();
}
