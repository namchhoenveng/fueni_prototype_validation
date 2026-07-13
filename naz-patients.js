/*
 * naz-patients.js — jeu de patients partagé (prototype)
 * Source unique consommée par : Mes patients (20), Dossiers médicaux (26),
 * Consultation (25, garde-fou allergies). En V2 : un seul dossier patient
 * servi par l'API ; ces écrans en sont des vues.
 *
 * Champs :
 *   Identité   : id, ini, name, sex ('F'|'M'), age, phone, email
 *   Annuaire   : last (dernière consult., 'YYYY-MM-DD'|''), lastMotif,
 *                next (prochain RDV|''), nextMotif
 *   Dossier    : blood, allergies[{name,sev:'high'|'medium'|'low'}],
 *                ant[] (perso), family[{rel,cond}],
 *                consults[{date,motif,diag,note,rx[]}], docs[{n,t,date}]
 */
(function () {
  window.NazPatients = [
    {
      id: 'p1', ini: 'MD', name: 'Mariam Diallo', sex: 'F', age: 34,
      phone: '+221 77 123 45 67', email: 'm.diallo@exemple.sn',
      last: '2026-07-02', lastMotif: 'Consultation générale', next: '2026-07-15', nextMotif: 'Contrôle',
      blood: 'O+', allergies: [{ name: 'Pénicilline', sev: 'high' }],
      ant: ['HTA (2022)'], family: [{ rel: 'Père', cond: 'Diabète type 2' }, { rel: 'Mère', cond: 'HTA' }],
      consults: [
        { date: '2026-07-02', motif: 'Consultation générale', diag: 'Rhinopharyngite aiguë', note: 'État général conservé. Fièvre à 38,2 °C, rhinorrhée. Auscultation libre.', rx: ['Paracétamol 1 g × 3/j — 5 j', 'Sérum physiologique — nez'] },
        { date: '2026-05-12', motif: 'Suivi hypertension', diag: 'HTA équilibrée', note: 'TA 130/80. Bonne observance. Poursuite du traitement.', rx: ['Amlodipine 5 mg — 3 mois'] }
      ],
      docs: [{ n: 'Ordonnance', t: 'rx', date: '2026-07-02' }, { n: 'Compte-rendu de consultation', t: 'doc', date: '2026-07-02' }, { n: 'Analyses sanguines', t: 'lab', date: '2026-06-30' }]
    },
    {
      id: 'p2', ini: 'OS', name: 'Ousmane Sow', sex: 'M', age: 52,
      phone: '+221 76 908 11 22', email: 'o.sow@exemple.sn',
      last: '2026-06-28', lastMotif: 'Suivi hypertension', next: '2026-07-18', nextMotif: 'Suivi hypertension',
      blood: 'A+', allergies: [], ant: ['Diabète type 2 (2019)', 'HTA'], family: [],
      consults: [{ date: '2026-06-28', motif: 'Suivi hypertension', diag: 'HTA · adaptation', note: 'TA 145/90. Majoration posologie.', rx: ['Amlodipine 10 mg — 3 mois'] }],
      docs: [{ n: 'Ordonnance', t: 'rx', date: '2026-06-28' }]
    },
    {
      id: 'p3', ini: 'AF', name: 'Awa Faye', sex: 'F', age: 29,
      phone: '+221 78 445 67 89', email: 'a.faye@exemple.sn',
      last: '2026-06-21', lastMotif: 'Téléconsultation', next: '2026-07-22', nextMotif: 'Téléconsultation',
      blood: 'B+', allergies: [], ant: [], family: [{ rel: 'Mère', cond: 'Migraine' }],
      consults: [{ date: '2026-06-21', motif: 'Téléconsultation', diag: 'Migraine', note: 'Céphalées récurrentes, pas de signe d\'alarme.', rx: ['Ibuprofène 400 mg — si crise'] }],
      docs: [{ n: 'Ordonnance', t: 'rx', date: '2026-06-21' }]
    },
    {
      id: 'p4', ini: 'IB', name: 'Ibrahima Bâ', sex: 'M', age: 41,
      phone: '+221 77 220 33 44', email: 'i.ba@exemple.sn',
      last: '2026-06-15', lastMotif: 'Consultation générale', next: '', nextMotif: '',
      blood: 'O-', allergies: [{ name: 'Aspirine', sev: 'medium' }], ant: [], family: [],
      consults: [{ date: '2026-06-15', motif: 'Consultation générale', diag: 'Lombalgie commune', note: 'Effort récent. Examen neuro normal.', rx: ['Paracétamol 1 g × 3/j — 7 j'] }],
      docs: [{ n: 'Compte-rendu de consultation', t: 'doc', date: '2026-06-15' }, { n: 'Radiographie lombaire', t: 'img', date: '2026-06-14' }]
    },
    {
      id: 'p5', ini: 'FN', name: 'Fatou Ndiaye', sex: 'F', age: 38,
      phone: '+221 70 556 77 88', email: 'f.ndiaye@exemple.sn',
      last: '2026-06-10', lastMotif: 'Suivi grossesse', next: '2026-07-24', nextMotif: 'Suivi grossesse',
      blood: 'A-', allergies: [], ant: [], family: [],
      consults: [{ date: '2026-06-10', motif: 'Suivi grossesse', diag: 'Grossesse 28 SA — normale', note: 'HU conforme, BDC positifs, TA normale.', rx: ['Fer + acide folique — 1 mois'] }],
      docs: [{ n: 'Échographie', t: 'img', date: '2026-06-10' }]
    },
    {
      id: 'p6', ini: 'MC', name: 'Modou Cissé', sex: 'M', age: 63,
      phone: '+221 76 112 44 55', email: 'm.cisse@exemple.sn',
      last: '2026-05-30', lastMotif: 'Renouvellement', next: '', nextMotif: '',
      blood: 'B-', allergies: [], ant: ['Diabète type 2'], family: [],
      consults: [], docs: [{ n: 'Ordonnance', t: 'rx', date: '2026-05-30' }]
    },
    {
      id: 'p7', ini: 'RD', name: 'Rokhaya Diop', sex: 'F', age: 47,
      phone: '+221 77 889 00 11', email: 'r.diop@exemple.sn',
      last: '2026-05-22', lastMotif: 'Consultation générale', next: '', nextMotif: '',
      blood: '', allergies: [], ant: [], family: [], consults: [], docs: []
    },
    {
      id: 'p8', ini: 'SG', name: 'Samba Gueye', sex: 'M', age: 36,
      phone: '+221 78 334 55 66', email: 's.gueye@exemple.sn',
      last: '2026-05-14', lastMotif: 'Téléconsultation', next: '', nextMotif: '',
      blood: 'O+', allergies: [], ant: [], family: [], consults: [],
      docs: [{ n: 'Ordonnance', t: 'rx', date: '2026-05-14' }, { n: 'Certificat', t: 'doc', date: '2026-05-14' }]
    },
    {
      id: 'p9', ini: 'KT', name: 'Khady Touré', sex: 'F', age: 25,
      phone: '+221 70 778 22 33', email: 'k.toure@exemple.sn',
      last: '2026-05-03', lastMotif: 'Consultation générale', next: '', nextMotif: '',
      blood: '', allergies: [], ant: [], family: [], consults: [], docs: []
    },
    {
      id: 'p10', ini: 'AN', name: 'Aliou Ndao', sex: 'M', age: 58,
      phone: '+221 76 445 88 99', email: 'a.ndao@exemple.sn',
      last: '2026-04-27', lastMotif: 'Suivi diabète', next: '', nextMotif: '',
      blood: 'A+', allergies: [], ant: ['Diabète type 2'], family: [], consults: [],
      docs: [{ n: 'Analyses', t: 'lab', date: '2026-04-27' }]
    },
    {
      id: 'p11', ini: 'MS', name: 'Mame Seck', sex: 'F', age: 31,
      phone: '+221 77 991 33 22', email: 'm.seck@exemple.sn',
      last: '2026-04-18', lastMotif: 'Consultation générale', next: '', nextMotif: '',
      blood: '', allergies: [], ant: [], family: [], consults: [], docs: []
    },
    {
      id: 'p12', ini: 'BD', name: 'Babacar Dieng', sex: 'M', age: 44,
      phone: '+221 78 220 66 77', email: 'b.dieng@exemple.sn',
      last: '2026-04-05', lastMotif: 'Renouvellement', next: '', nextMotif: '',
      blood: '', allergies: [], ant: [], family: [], consults: [],
      docs: [{ n: 'Ordonnance', t: 'rx', date: '2026-04-05' }]
    }
  ];
})();
