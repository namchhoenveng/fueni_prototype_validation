/* naz-doctors.js — Médecins de démonstration de l'annuaire (profils publics complets).
 * Source unique partagée par : 28 (annuaire), 19b (fiche publique), 27 (réservation).
 * Chaque profil suit le même schéma que le profil configuré à l'écran 19 (clé localStorage
 * fueni_pubprofile_v2), afin que 19b/27 puissent le charger sans traitement particulier.
 * Le praticien « real » (id = 'real') reste piloté par le profil réellement configuré.
 * `next` = simple teaser « prochaine dispo » affiché sur la carte annuaire (non contractuel). */
(function () {
  var STD = {
    mon: [['09:00', '13:00'], ['15:00', '18:00']],
    tue: [['09:00', '13:00'], ['15:00', '18:00']],
    wed: [['09:00', '13:00']],
    thu: [['09:00', '13:00'], ['15:00', '18:00']],
    fri: [['09:00', '13:00']],
    sat: [], sun: []
  };
  function hrs(o) { return Object.assign({ mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] }, o); }

  window.NazDoctors = {
    m2: {
      visible: true, title: 'Dr', name: 'Fatou Ndiaye', spec: 'Médecine générale', photo: null, currency: 'XOF',
      bookingWindow: 30,
      ordre: 'ONMS-2021-00512', ordreBody: 'Ordre des Médecins du Sénégal',
      langs: ['Français', 'Wolof'],
      expertise: ['Suivi des maladies chroniques', 'Santé de la femme', 'Médecine préventive'],
      bio: "Médecin généraliste installée à Dakar, j'assure le suivi de santé courant, la prévention et l'accompagnement des pathologies chroniques, pour toute la famille.",
      training: [
        { year: '2016', label: 'Doctorat en médecine — UCAD, Dakar' },
        { year: '2019', label: 'Diplôme universitaire de gynécologie médicale — UCAD' }
      ],
      next: { offset: 0, time: '16:00' },
      locations: [{
        id: 'loc1', type: 'cabinet', label: '', street: '45, avenue Cheikh Anta Diop',
        city: 'Dakar', region: 'Dakar', country: 'Sénégal', primary: true, bookable: true,
        access: ['parking', 'wheelchair'], photos: [],
        hours: hrs({ mon: [['08:30', '13:00'], ['15:00', '18:30']], tue: [['08:30', '13:00'], ['15:00', '18:30']], wed: [['08:30', '13:00']], thu: [['08:30', '13:00'], ['15:00', '18:30']], fri: [['08:30', '13:00'], ['15:00', '17:00']] }),
        motifs: [
          { label: 'Consultation générale', dur: 30, price: 6000 },
          { label: 'Suivi / renouvellement', dur: 20, price: 5000 }
        ]
      }]
    },

    m3: {
      visible: true, title: 'Dr', name: 'Mamadou Sow', spec: 'Cardiologie', photo: null, currency: 'XOF',
      bookingWindow: 15,
      ordre: 'ONMS-2017-00238', ordreBody: 'Ordre des Médecins du Sénégal',
      langs: ['Français', 'English', 'Wolof'],
      expertise: ['Hypertension artérielle', 'Insuffisance cardiaque', 'Échographie cardiaque'],
      bio: "Cardiologue à Dakar, je prends en charge le bilan et le suivi des maladies cardiovasculaires : hypertension, troubles du rythme, insuffisance cardiaque.",
      training: [
        { year: '2012', label: 'Doctorat en médecine — UCAD, Dakar' },
        { year: '2016', label: 'DES de cardiologie — CHU Aristide Le Dantec' }
      ],
      next: { offset: 2, time: '08:30' },
      locations: [{
        id: 'loc1', type: 'cabinet', label: '', street: '8, rue Félix Faure',
        city: 'Dakar', region: 'Dakar', country: 'Sénégal', primary: true, bookable: true,
        access: ['parking', 'elevator'], photos: [],
        hours: hrs({ mon: [['09:00', '13:00']], tue: [['09:00', '13:00'], ['15:00', '18:00']], wed: [['09:00', '13:00'], ['15:00', '18:00']], thu: [['09:00', '13:00']], fri: [['09:00', '13:00'], ['15:00', '17:00']] }),
        motifs: [
          { label: 'Consultation de cardiologie', dur: 30, price: 10000 },
          { label: 'Échographie cardiaque', dur: 40, price: 18000 },
          { label: 'Suivi / renouvellement', dur: 20, price: 8000 }
        ]
      }]
    },

    m4: {
      visible: true, title: 'Dr', name: 'Aïcha Traoré', spec: 'Pédiatrie', photo: null, currency: 'XOF',
      bookingWindow: 60,
      ordre: 'ONMCI-2019-01477', ordreBody: 'Ordre National des Médecins de Côte d\'Ivoire',
      langs: ['Français', 'English'],
      expertise: ['Suivi du nourrisson', 'Vaccination', 'Croissance & développement'],
      bio: "Pédiatre à Abidjan, j'accompagne les enfants de la naissance à l'adolescence : suivi de croissance, vaccinations et prise en charge des maladies courantes.",
      training: [
        { year: '2014', label: 'Doctorat en médecine — Université Félix Houphouët-Boigny, Abidjan' },
        { year: '2018', label: 'DES de pédiatrie — CHU de Cocody' }
      ],
      next: { offset: 0, time: '17:30' },
      locations: [{
        id: 'loc1', type: 'cabinet', label: '', street: 'Boulevard de la République, Plateau',
        city: 'Abidjan', region: 'Abidjan', country: "Côte d'Ivoire", primary: true, bookable: true,
        access: ['parking', 'wheelchair', 'stepfree'], photos: [],
        hours: hrs({ mon: [['09:00', '13:00'], ['15:00', '18:00']], tue: [['09:00', '13:00'], ['15:00', '18:00']], wed: [['09:00', '13:00'], ['15:00', '18:00']], thu: [['09:00', '13:00'], ['15:00', '18:00']], fri: [['09:00', '13:00'], ['15:00', '18:00']], sat: [['09:00', '12:00']] }),
        motifs: [
          { label: 'Consultation pédiatrique', dur: 30, price: 7000 },
          { label: 'Visite de suivi', dur: 20, price: 5000 }
        ]
      }]
    },

    m5: {
      visible: true, title: 'Dr', name: 'Jean-Paul Kabongo', spec: 'Médecine générale', photo: null, currency: 'USD',
      bookingWindow: 30,
      ordre: 'CNOM-RDC-2020-03310', ordreBody: 'Conseil National de l\'Ordre des Médecins (RDC)',
      langs: ['Français', 'Lingala'],
      expertise: ['Médecine préventive', 'Prise en charge du paludisme', 'Santé familiale'],
      bio: "Médecin généraliste à Kinshasa, j'offre des consultations de médecine courante, de prévention et de suivi pour adultes et enfants.",
      training: [
        { year: '2013', label: 'Doctorat en médecine — Université de Kinshasa' }
      ],
      next: { offset: 3, time: '10:00' },
      locations: [{
        id: 'loc1', type: 'cabinet', label: '', street: 'Avenue de la Justice, Gombe',
        city: 'Kinshasa', region: 'Kinshasa', country: 'RDC', primary: true, bookable: true,
        access: ['parking'], photos: [],
        hours: hrs({ mon: [['08:00', '12:00'], ['14:00', '17:00']], tue: [['08:00', '12:00'], ['14:00', '17:00']], wed: [['08:00', '12:00']], thu: [['08:00', '12:00'], ['14:00', '17:00']], fri: [['08:00', '12:00'], ['14:00', '16:00']] }),
        motifs: [
          { label: 'Consultation générale', dur: 30, price: 25 },
          { label: 'Suivi / renouvellement', dur: 20, price: 20 }
        ]
      }]
    }
  };
})();
