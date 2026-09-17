/**
 * naz-common.js — Shared pricing & zone logic for Nazounki prototype
 * Include before page-specific scripts in all prototype HTML files.
 */

// ── Zone pricing (monthly) — annual = monthly × ANNUAL_MULT ──────────────────
const ZONE_PRICES = {
  africa: { solo: 30,  pro: 50,  institution: 500,  base: 500,  perMed: 10 },
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

// ── Tarification Essentiel : RÉFÉRENCE en euros + DÉROGATIONS PAR PAYS (✅ décision client 2026-09-10) ──
//    Défaut (7 pays) : 30 €/mois · 300 €/an — conversion en devise locale par le prestataire de paiement.
//    Dérogations : Burkina Faso = 17 000 XOF/mois · RDC = 30 USD/mois (annuel = ×10 dans la devise, soit 2 mois offerts).
//    Consommé par 14 (cartes), 15 (paiement), 17 (hub) via le pays d'exercice choisi à l'éligibilité (12b).
const PRICING_DEFAULT = { monthly: 30, annual: 300, cur: '€' };
const PRICING_OVERRIDES = {
  'Burkina Faso': { monthly: 17000, annual: 170000, cur: 'XOF' },
  'RDC':          { monthly: 30,    annual: 300,    cur: 'USD' }
};
function doctorCountry() { try { return localStorage.getItem('naz_doctor_country') || ''; } catch (e) { return ''; } }
function pricingFor(country) { return Object.assign({}, PRICING_DEFAULT, PRICING_OVERRIDES[country] || {}); }
function fmtPrice(n, cur) {
  const s = n.toLocaleString('fr-FR', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });
  return s + ' ' + cur;
}

// ── Paramètres de plan ÉDITABLES au portail admin (écran 23) : quotas patients & délais de grâce ──
//    « Paramètres dynamiques, structure par release » : les valeurs numériques se configurent sans déploiement ;
//    la matrice de fonctionnalités, elle, reste figée (release). Démo : persistance localStorage ; V2 : API (source unique).
// capFree = plafond Free de réservations auto-confirmées / mois (SF-PLAN-FREE-ESSENTIEL §4) —
// au cap : retrait de la recherche annuaire jusqu'au mois suivant ; patients existants et RDV manuels jamais bloqués.
const PLAN_DEFAULTS = { patientsFree: 50, patientsSolo: 250, graceMonthly: 2, graceAnnual: 7, capFree: 25 };
function planConfig() {
  try { return Object.assign({}, PLAN_DEFAULTS, JSON.parse(localStorage.getItem('fueni_plan_config') || '{}')); }
  catch (e) { return Object.assign({}, PLAN_DEFAULTS); }
}
function savePlanConfig(partial) {
  const cfg = Object.assign(planConfig(), partial);
  try { localStorage.setItem('fueni_plan_config', JSON.stringify(cfg)); } catch (e) {}
  return cfg;
}

// ── Offre d'ouverture : −50 % sur le PREMIER MOIS uniquement (cycle mensuel), pour toute souscription
//    jusqu'au 31/12/2026 inclus. Les mois suivants sont au plein tarif. Partagé par 14 (cartes) et 15 (paiement).
const LAUNCH_PROMO = { rate: 0.5, until: '2026-12-31' };
function promoActive() { const end = new Date(LAUNCH_PROMO.until + 'T00:00:00'); end.setDate(end.getDate() + 1); return new Date() < end; }
function promoDateStr() { const p = LAUNCH_PROMO.until.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }

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
