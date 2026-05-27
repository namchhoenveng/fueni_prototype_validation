/**
 * naz-i18n.js — Simple i18n engine for FUENI Validation Prototype
 *
 * Usage in HTML:
 *   <p data-i18n="home.tagline">Texte FR par défaut</p>
 *   <input data-i18n-placeholder="signup.email_ph" placeholder="...">
 *   <button data-i18n-title="signup.submit_title" title="...">
 *   <body data-i18n-pagetitle="home.page_title">  → met à jour <title>
 *
 * Toggle FR/EN auto-injected top-right of every page.
 * Language stored in localStorage.fueni_lang (persists across pages + sessions).
 */
(function () {
  const STORAGE_KEY = 'fueni_lang';
  const DEFAULT_LANG = 'fr';

  function getLang() {
    const v = localStorage.getItem(STORAGE_KEY);
    return (v === 'fr' || v === 'en') ? v : DEFAULT_LANG;
  }
  function setLang(lang) {
    if (lang !== 'fr' && lang !== 'en') return;
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang();
    updateToggleUI();
    document.dispatchEvent(new CustomEvent('fueni:langchange', { detail: { lang } }));
  }
  function t(key) {
    const lang = getLang();
    const dict = I18N[lang] || {};
    return (dict[key] != null) ? dict[key] : (I18N.fr && I18N.fr[key]) || '';
  }
  function applyLang() {
    const lang = getLang();
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = t(el.getAttribute('data-i18n'));
      if (v) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const v = t(el.getAttribute('data-i18n-html'));
      if (v) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const v = t(el.getAttribute('data-i18n-placeholder'));
      if (v) el.setAttribute('placeholder', v);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const v = t(el.getAttribute('data-i18n-title'));
      if (v) el.setAttribute('title', v);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const v = t(el.getAttribute('data-i18n-aria'));
      if (v) el.setAttribute('aria-label', v);
    });

    const pageTitleKey = document.body && document.body.getAttribute('data-i18n-pagetitle');
    if (pageTitleKey) {
      const v = t(pageTitleKey);
      if (v) document.title = v;
    }
  }

  function injectToggle() {
    if (document.getElementById('fueni-lang-toggle')) return;
    // Toggle shown only on pages that opt-in via <body data-i18n-toggle>.
    // Other pages still apply the stored language preference but hide the toggle.
    if (!document.body || !document.body.hasAttribute('data-i18n-toggle')) return;
    const wrap = document.createElement('div');
    wrap.id = 'fueni-lang-toggle';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Language switcher / Sélecteur de langue');
    wrap.innerHTML = '<button data-lang="fr" type="button" aria-label="Français">FR</button><button data-lang="en" type="button" aria-label="English">EN</button>';
    document.body.appendChild(wrap);
    wrap.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
    });

    if (!document.getElementById('fueni-lang-toggle-style')) {
      const style = document.createElement('style');
      style.id = 'fueni-lang-toggle-style';
      style.textContent = '#fueni-lang-toggle{position:fixed;top:48px;right:14px;z-index:100000;display:flex;gap:2px;background:rgba(255,255,255,.96);border:1px solid #e2e8f0;border-radius:18px;padding:3px;box-shadow:0 3px 12px rgba(0,0,0,.12);font:600 11px/1 system-ui,-apple-system,sans-serif}#fueni-lang-toggle button{border:0;background:transparent;color:#475569;padding:6px 12px;border-radius:14px;cursor:pointer;transition:all .18s;letter-spacing:.4px}#fueni-lang-toggle button.active{background:#155e75;color:#fff}#fueni-lang-toggle button:hover:not(.active){background:#e2e8f0}@media (max-width:480px){#fueni-lang-toggle{top:auto;bottom:14px;right:14px}}';
      document.head.appendChild(style);
    }
  }
  function updateToggleUI() {
    const lang = getLang();
    document.querySelectorAll('#fueni-lang-toggle button').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // DICTIONARY — populated per page (keys grouped by page)
  // ════════════════════════════════════════════════════════════════════════════
  const I18N = {
    fr: {
      // ── Common ────────────────────────────────────────────────────────────
      'common.back_home': '← Retour à l\'accueil',

      // ── 01 — Homepage ─────────────────────────────────────────────────────
      'home.page_title': 'FUENI — Une plateforme. Tous vos soins.',
      'home.proto_bar': 'Écran 01 — Homepage publique FUENI · Site Public',
      'home.nav.home': 'Accueil',
      'home.nav.features': 'Fonctionnalités',
      'home.nav.audiences': 'Pour qui ?',
      'home.nav.security': 'Sécurité',
      'home.nav.contact': 'Contact',
      'home.nav.patient_area': 'Espace patient',
      'home.nav.pro_area': 'Espace professionnel',
      'home.nav.dark_mode': 'Mode sombre',
      'home.nav.signup': 'S\'inscrire',
      'home.nav.signup_patient': 'Je suis patient',
      'home.nav.signup_pro': 'Je suis professionnel de santé',

      'home.hero.tag': 'Parce que votre santé mérite ce qu\'il y a de mieux, où que vous soyez !',
      'home.hero.title_html': 'Une plateforme.<br><span class="accent">Tous vos soins.</span>',
      'home.hero.desc': 'FUENI rassemble patients, praticiens, pharmacies et hôpitaux dans une seule plateforme moderne et sécurisée. Pensée pour vous garantir une tranquillité d\'esprit, vous assister et vous servir là où vous voulez, quand vous en avez besoin.',
      'home.hero.search_ph': 'Nom, spécialité, établissement…',
      'home.hero.search_aria': 'Rechercher',
      'home.hero.location_ph': 'Ville, pays…',
      'home.hero.location_aria': 'Localisation',
      'home.hero.search_btn': 'Rechercher',
      'home.hero.stat1_label': 'Pays francophones',
      'home.hero.stat2_label': 'Devises supportées',
      'home.hero.stat3_label': 'Conforme RGPD',
      'home.hero.shape1_label': 'Prochain RDV',
      'home.hero.shape1_value': 'Aujourd\'hui · 14:30',
      'home.hero.shape2_label': 'Taux de satisfaction',
      'home.hero.shape2_value': 'Patients FUENI',

      'home.how.tag': 'Comment ça marche',
      'home.how.title_html': 'Une solution simple,<br><span class="accent">en trois étapes.</span>',
      'home.how.subtitle': 'Que vous soyez patient, professionnel ou structure de soins de santé, l\'accès à FUENI est immédiat. Création de compte en moins d\'une minute, vérification rapide, et c\'est parti. L\'excellence médicale, à portée de tous.',
      'home.how.step1_label': 'Étape 1',
      'home.how.step1_title': 'Créez votre compte',
      'home.how.step1_desc': 'Inscription en quelques clics. Aucune carte bancaire requise. Patient, praticien ou institution : choisissez votre profil et commencez immédiatement.',
      'home.how.step2_label': 'Étape 2',
      'home.how.step2_title': 'Vérifiez votre identité',
      'home.how.step2_desc': 'Vérification par SMS pour les patients · validation manuelle après vérification de vos qualifications pour les praticiens (RPPS, Ordre des Médecins, justificatifs).',
      'home.how.step3_label': 'Étape 3',
      'home.how.step3_title': 'Profitez de FUENI',
      'home.how.step3_desc': 'Prenez vos RDV, consultez vos dossiers, communiquez avec votre médecin, second avis, expertises et plus, gérez vos paiements par divers moyens, y compris Mobile Money. Tout, depuis une seule plateforme.',

      'home.audiences.tag': 'Pour qui ?',
      'home.audiences.title_html': 'FUENI s\'adapte à <span class="accent">votre rôle.</span>',
      'home.audiences.subtitle': 'Chaque utilisateur a son espace dédié et ses outils. Choisissez le vôtre.',
      'home.audiences.patient_title': 'Patient',
      'home.audiences.patient_tag': 'L\'excellence médicale, à portée de tous.',
      'home.audiences.patient_desc': 'Pour particuliers — gérez votre santé et celle de vos proches.',
      'home.audiences.patient_f1': 'Trouvez et réservez avec un médecin',
      'home.audiences.patient_f2': 'Trouver un service (examen, produit)',
      'home.audiences.patient_f3': 'Conservez vos documents médicaux',
      'home.audiences.patient_f4': 'Paiement Mobile Money simple',
      'home.audiences.patient_cta': 'Créer mon compte patient',
      'home.audiences.badge_popular': 'Le plus populaire',
      'home.audiences.pro_title': 'Praticien',
      'home.audiences.pro_tag': 'Votre expertise à ceux qui en ont besoin.',
      'home.audiences.pro_desc': 'Médecin, pharmacien, infirmier — gérez votre activité de A à Z.',
      'home.audiences.pro_f1': 'Planning + RDV intelligent',
      'home.audiences.pro_f2': 'Dossiers patients structurés (POMR/SOAP)',
      'home.audiences.pro_f3': 'Partage sécurisé d\'ordonnances et comptes-rendus',
      'home.audiences.pro_f4': 'Tableau de bord analytics',
      'home.audiences.pro_f5': 'Wallet · payouts automatiques',
      'home.audiences.pro_cta': 'Découvrir les plans praticien',
      'home.audiences.badge_phase2': 'Phase 2',
      'home.audiences.hosp_title': 'Cabinet & Hôpital',
      'home.audiences.hosp_desc': 'Pour structures de santé — coordonnez votre équipe et vos services.',
      'home.audiences.hosp_f1': 'Gestion multi-praticiens',
      'home.audiences.hosp_f2': 'Tableau de bord institutionnel',
      'home.audiences.hosp_f3': 'Coordination des soins',
      'home.audiences.hosp_f4': 'Accueil de patients non-résidents',
      'home.audiences.hosp_f5': 'Statistiques avancées',
      'home.audiences.hosp_f6': 'Intégration assurances',
      'home.audiences.hosp_cta': 'Bientôt disponible →',

      'home.features.tag': 'Fonctionnalités',
      'home.features.title_html': 'Tout ce qu\'il faut, <span class="accent">rien de superflu.</span>',
      'home.features.subtitle': 'Des fonctionnalités pensées pour la pratique quotidienne en cabinet, à l\'hôpital et au domicile du patient.',
      'home.features.f1_title': 'Prise de RDV intelligente',
      'home.features.f1_desc': 'Recherche par spécialité, ville et disponibilité. Réservation en quelques secondes. Notifications SMS + email automatiques 48 h et 1 h 30 avant.',
      'home.features.f2_title': 'Dossier médical structuré',
      'home.features.f2_desc': 'Format POMR/SOAP standard international. Antécédents, traitements, diagnostics SNOMED-CT. Accessible hors-ligne en cas de besoin.',
      'home.features.f3_title': 'Paiement Mobile Money',
      'home.features.f3_desc': 'Flutterwave + Wave + Orange Money + MTN Money. Wallet praticien avec payout automatique sous quelques jours.',

      'home.security.tag': 'Sécurité & conformité',
      'home.security.title_html': 'Vos données restent <span class="accent">vos données.</span>',
      'home.security.subtitle': 'FUENI est conçu avec les standards de sécurité les plus exigeants de l\'industrie santé. Chiffrement de bout en bout, audit complet, et conformité dans chaque pays où vous exercez.',
      'home.security.s1_title': 'Chiffrement AES-256',
      'home.security.s1_desc': 'Vos dossiers médicaux sont chiffrés AVANT stockage. Même nos équipes ne peuvent pas y accéder.',
      'home.security.s2_title': 'Signatures électroniques PKI',
      'home.security.s2_desc': 'Ordonnances et comptes-rendus signés cryptographiquement, immuables, légalement opposables.',
      'home.security.s3_title': 'Authentification forte',
      'home.security.s3_desc': 'Double authentification (SMS, application, clé physique) pour tous les professionnels.',
      'home.security.s4_title': 'Conforme par pays',
      'home.security.s4_desc': 'RGPD (Europe), CDP (Sénégal), ARTCI (CI), APDP (Mali, Bénin), HDS (option France).',

      'home.coverage.tag': 'Couverture',
      'home.coverage.title_html': '9 pays au lancement. <span class="accent">Une seule plateforme.</span>',
      'home.coverage.subtitle': 'FUENI démarre dans 9 pays francophones d\'Afrique de l\'Ouest et Centrale (UEMOA + Cameroun + RDC). Affichage en devise locale, paiements adaptés, conformité locale. D\'autres pays suivront.',

      'home.testimonials.tag': 'Ils utilisent FUENI',
      'home.testimonials.title_html': 'Adoptés par des professionnels.<br><span class="accent">Plébiscités par leurs patients.</span>',
      'home.testimonials.subtitle': 'Témoignages illustratifs — la plateforme étant en cours de lancement, ces témoignages sont fictifs mais représentent les retours que nous visons.',
      'home.testimonials.illustrative': 'Exemple illustratif',
      'home.testimonials.t1_quote': 'FUENI m\'a permis de gagner 2 h par jour sur la gestion administrative. Mes patients adorent prendre RDV en ligne. Le dossier patient structuré est devenu indispensable au quotidien.',
      'home.testimonials.t1_role': 'Cardiologue · Dakar, Sénégal',
      'home.testimonials.t2_quote': 'En tant que pharmacienne en zone rurale, FUENI est une révolution. Les ordonnances signées électroniquement arrivent directement, plus de doute sur l\'authenticité.',
      'home.testimonials.t2_role': 'Pharmacienne · Bamako, Mali',
      'home.testimonials.t3_quote': 'Prendre RDV avec mon médecin depuis mon téléphone, c\'est devenu naturel. Et tous mes documents médicaux sont au même endroit, je ne perds plus rien.',
      'home.testimonials.t3_role': 'Patiente · Abidjan, Côte d\'Ivoire',

      'home.cta.title': 'Prêt(e) à transformer votre santé ?',
      'home.cta.desc': 'Rejoignez la plateforme qui rassemble patients, praticiens et établissements de santé francophones. Aucune carte bancaire requise pour démarrer.',
      'home.cta.primary': 'Créer mon compte patient',
      'home.cta.secondary': 'Inscription professionnel de santé',

      'home.footer.brand_desc': 'La plateforme santé numérique pour l\'Afrique francophone et l\'Europe. Une plateforme. Tous vos soins.',
      'home.footer.col_product': 'Produit',
      'home.footer.link_features': 'Fonctionnalités',
      'home.footer.link_audiences': 'Pour qui ?',
      'home.footer.link_pricing': 'Tarifs',
      'home.footer.link_security': 'Sécurité',
      'home.footer.link_roadmap': 'Roadmap',
      'home.footer.col_resources': 'Ressources',
      'home.footer.link_help': 'Centre d\'aide',
      'home.footer.link_blog': 'Blog',
      'home.footer.link_webinars': 'Webinaires',
      'home.footer.link_api': 'API',
      'home.footer.link_partners': 'Partenaires',
      'home.footer.col_company': 'Société',
      'home.footer.link_about': 'À propos',
      'home.footer.link_careers': 'Carrières',
      'home.footer.link_press': 'Presse',
      'home.footer.link_contact': 'Contact',
      'home.footer.col_legal': 'Légal',
      'home.footer.link_terms': 'Mentions légales',
      'home.footer.link_cgu': 'CGU',
      'home.footer.link_privacy': 'Confidentialité',
      'home.footer.link_cookies': 'Cookies',
      'home.footer.link_compliance': 'Conformité par pays',
      'home.footer.copyright': '© 2026 FUENI — Tous droits réservés.',

      'home.chat.title': 'Discuter avec nous',

      // ── 02 — Sign-up ──────────────────────────────────────────────────────
      'signup.page_title': 'FUENI — Inscription Patient',
      'signup.proto_bar': 'Écran 02 — Inscription Patient',
      'signup.brand.tagline': 'Espace Patient — Votre santé entre vos mains',
      'signup.role_chip': 'Compte Patient particulier',
      'signup.title': 'Créer mon compte',
      'signup.subtitle': '1 minute — quelques étapes pour finaliser votre inscription',
      'signup.error.required': 'Veuillez compléter tous les champs obligatoires marqués d\'un astérisque (*).',
      'signup.field.firstname_label': 'Prénom *',
      'signup.field.firstname_ph': 'Ex : Aïssatou',
      'signup.field.lastname_label': 'Nom *',
      'signup.field.lastname_ph': 'Ex : Diop',
      'signup.field.dob_label': 'Date de naissance *',
      'signup.field.dob_info': 'Vous devez avoir 18 ans ou plus',
      'signup.field.dob_hint': 'Vous devez avoir 18 ans ou plus pour vous inscrire.',
      'signup.field.sex_label': 'Sexe *',
      'signup.field.sex_choose': 'Choisir...',
      'signup.field.sex_female': 'Féminin',
      'signup.field.sex_male': 'Masculin',
      'signup.field.sex_other': 'Autre',
      'signup.field.sex_norep': 'Préfère ne pas répondre',
      'signup.field.email_label': 'Adresse e-mail *',
      'signup.field.email_ph': 'Ex : aissatou.diop@example.com',
      'signup.field.email_hint': 'Adresse e-mail invalide.',
      'signup.field.phone_label': 'Téléphone *',
      'signup.field.phone_choose': 'Choisir...',
      'signup.field.phone_ph': 'Ex : 77 123 45 67',
      'signup.field.phone_hint': 'Numéro invalide pour le pays sélectionné.',
      'signup.field.pwd_label': 'Mot de passe *',
      'signup.field.pwd_aria': 'Afficher le mot de passe',
      'signup.field.pwd_r_len': 'Au moins 8 caractères',
      'signup.field.pwd_r_upper': 'Une majuscule',
      'signup.field.pwd_r_lower': 'Une minuscule',
      'signup.field.pwd_r_num': 'Un chiffre',
      'signup.field.pwd_r_spe': 'Un caractère spécial (ex : ! ? @ # $ % & * …)',
      'signup.cgu_html': 'J\'accepte les <a href="#" class="text-decoration-none" style="color:#16a085;">Conditions Générales</a> et la <a href="#" class="text-decoration-none" style="color:#16a085;">Politique de Confidentialité</a> *',
      'signup.health_html': 'Je consens au traitement de mes <strong>données de santé</strong> par FUENI dans le cadre du service *',
      'signup.submit': 'Créer mon compte',
      'signup.divider_or': 'ou',
      'signup.have_account_html': 'Déjà un compte ? <a href="#" class="text-decoration-none fw-semibold" style="color:#16a085;">Connectez-vous</a>',
      'signup.are_you_pro_html': '<i class="fa fa-user-md me-1"></i>Vous êtes un professionnel de santé ? <a href="#" class="text-decoration-none fw-semibold" style="color:#16a085;">Inscription pro</a>',

      // ── 03 — OTP ──────────────────────────────────────────────────────────
      'otp.page_title': 'FUENI — Vérification SMS',
      'otp.proto_bar': 'Écran 03 — Vérification SMS (OTP)',
      'otp.brand.tagline': 'Plus que quelques étapes pour finaliser votre inscription',
      'otp.steps.signup': 'Inscription',
      'otp.steps.sms': 'Vérification SMS',
      'otp.steps.profile': 'Profil de base',
      'otp.steps.welcome': 'Bienvenue',
      'otp.title': 'Vérification de votre numéro',
      'otp.subtitle_html': 'Un code à 6 chiffres a été envoyé par SMS au <strong id="maskedPhone">+221 ** *** ** 67</strong>',
      'otp.demo_hint_html': '<i class="fa fa-flask me-1"></i><strong>Démo :</strong> saisissez <code>123456</code> pour valider · n\'importe quel autre code → état d\'erreur',
      'otp.lockout_html': '<i class="fa fa-lock me-2"></i><strong>Trop de tentatives.</strong> Votre code est désactivé. Demandez un nouveau code <span id="lockoutHint">dès que le renvoi est disponible</span>.',
      'otp.expired_html': '<i class="fa fa-clock-rotate-left me-2"></i><strong>Code expiré.</strong> Cliquez sur « Renvoyer le code » pour en recevoir un nouveau.',
      'otp.resend_html': 'Pas reçu ? <span id="resendLink" class="resend-link disabled">Renvoyer le code</span> <span id="resendTimerWrap">· disponible dans <strong id="resendTimer">00:30</strong></span>',
      'otp.verify_btn_html': 'Vérifier <i class="fa fa-arrow-right ms-2"></i>',
      'otp.edit_info': 'Modifier mes informations',
      'otp.tester_summary_html': '<i class="fa fa-vial me-1"></i> Tester les états (raccourcis démo)',
      'otp.tester.wrong': 'Code incorrect (1 essai)',
      'otp.tester.lockout': 'Verrouillage (3 essais épuisés)',
      'otp.tester.expired': 'Code expiré',
      'otp.tester.reset_html': '<i class="fa fa-rotate-right me-1"></i>Réinitialiser',
      // Dynamic strings (used via NazI18n.t in JS)
      'otp.error.wrong_singular': 'Code incorrect. Il vous reste {n} tentative.',
      'otp.error.wrong_plural': 'Code incorrect. Il vous reste {n} tentatives.',
      'otp.flash.resent_html': '<i class="fa fa-check-circle me-2"></i>Nouveau code envoyé par SMS.',

      // ── 04 — Profile base ─────────────────────────────────────────────────
      'profile.page_title': 'FUENI — Profil de base',
      'profile.proto_bar': 'Écran 04 — Profil de base',
      'profile.brand.tagline': 'Dernière étape pour finaliser votre inscription',
      'profile.title': 'Complétez votre profil',
      'profile.subtitle': 'Dernière étape (30 secondes).',
      'profile.error.required': 'Veuillez compléter tous les champs obligatoires marqués d\'un astérisque (*).',
      'profile.field.country_label': 'Pays de résidence *',
      'profile.field.country_choose': 'Choisir...',
      'profile.field.country_hint': 'Pré-rempli selon votre indicatif téléphonique',
      'profile.field.city_label': 'Ville *',
      'profile.field.city_choose': 'Choisir...',
      'profile.field.city_other_ph': 'Précisez votre ville',
      'profile.field.lang_label': 'Langue de communication *',
      'profile.field.lang_fr': 'Français',
      'profile.field.lang_en': 'English',
      'profile.field.address_label_html': 'Adresse <span class="text-muted fw-normal">(optionnel)</span>',
      'profile.field.address_ph': 'Ex : Sacré-Cœur 3, Villa 12, face à la pharmacie El Hadji',
      'profile.submit_html': 'Finaliser et accéder à mon espace <i class="fa fa-check ms-2"></i>',
      // City "Autre" option (used dynamically in JS)
      'profile.city.other': 'Autre (préciser)',

      // ── 05 — Dashboard ────────────────────────────────────────────────────
      'dash.page_title': 'FUENI — Mon espace patient',
      'dash.proto_bar_html': '<i class="fa fa-eye me-1"></i> Espace Patient · Tableau de bord · <a href="01-home.html" class="text-decoration-none">← Retour à l\'accueil</a>',
      'dash.sidebar.area': 'Espace Patient',
      'dash.sidebar.verified': 'Compte vérifié',
      'dash.sidebar.section_my_space': 'Mon espace',
      'dash.sidebar.dashboard': 'Tableau de bord',
      'dash.sidebar.my_appts': 'Mes RDV',
      'dash.sidebar.book': 'Prendre RDV',
      'dash.sidebar.my_docs': 'Mes documents',
      'dash.sidebar.section_account': 'Mon compte',
      'dash.sidebar.my_profile': 'Mon profil',
      'dash.sidebar.notifications': 'Notifications',
      'dash.sidebar.rights': 'Mes droits et données',
      'dash.sidebar.section_help': 'Aide',
      'dash.sidebar.faq': 'FAQ',
      'dash.sidebar.support': 'Contacter le support',
      'dash.sidebar.logout': 'Se déconnecter',
      'dash.email_banner_html': '<strong>Votre adresse e-mail n\'est pas encore vérifiée.</strong> Vérifiez-la pour pouvoir prendre des rendez-vous et recevoir vos documents médicaux.',
      'dash.email_banner.verify': 'Vérifier maintenant',
      'dash.welcome.hello_html': 'Bonjour <span id="userFirstName">Aïssatou</span> 👋',
      'dash.welcome.question': 'Comment allez-vous aujourd\'hui ?',
      'dash.welcome.book_html': '<i class="fa fa-plus me-1"></i>Prendre un RDV',
      'dash.appts.title_html': '<i class="fa fa-calendar me-2" style="color:#16a085;"></i>Mes prochains rendez-vous',
      'dash.appts.view_all': 'Tout voir →',
      'dash.appts.month_may': 'Mai',
      'dash.appts.month_jun': 'Juin',
      'dash.appts.specialty1': 'Cardiologie · 14:30 · Cabinet Médical Plateau, Dakar',
      'dash.appts.specialty2': 'Médecine générale · 10:00 · Clinique Pasteur',
      'dash.appts.status_confirmed': 'Confirmé',
      'dash.docs.title_html': '<i class="fa fa-folder me-2" style="color:#16a085;"></i>Documents récents',
      'dash.docs.doc1_title': 'Ordonnance Dr. Sow',
      'dash.docs.doc1_meta': 'Partagé par praticien · 10/05/2026',
      'dash.docs.status_new': 'Nouveau',
      'dash.docs.doc2_title': 'Résultat analyse sang',
      'dash.docs.doc2_meta': 'Mon upload · 05/05/2026 · En attente validation',
      'dash.docs.status_pending': 'En attente',
      'dash.docs.doc3_title': 'Compte-rendu Dr. Diallo',
      'dash.docs.doc3_meta': 'Partagé par praticien · 28/04/2026',
      'dash.docs.status_seen': 'Vu',
      'dash.completion.text_html': 'Profil complété à <strong>60 %</strong>',
      'dash.completion.link': 'Compléter mon profil →'
    },
    en: {
      // ── Common ────────────────────────────────────────────────────────────
      'common.back_home': '← Back to home',

      // ── 01 — Homepage ─────────────────────────────────────────────────────
      'home.page_title': 'FUENI — One platform. All your care.',
      'home.proto_bar': 'Screen 01 — FUENI Public Homepage · Public Site',
      'home.nav.home': 'Home',
      'home.nav.features': 'Features',
      'home.nav.audiences': 'For whom?',
      'home.nav.security': 'Security',
      'home.nav.contact': 'Contact',
      'home.nav.patient_area': 'Patient area',
      'home.nav.pro_area': 'Professional area',
      'home.nav.dark_mode': 'Dark mode',
      'home.nav.signup': 'Sign up',
      'home.nav.signup_patient': 'I\'m a patient',
      'home.nav.signup_pro': 'I\'m a healthcare professional',

      'home.hero.tag': 'Because your health deserves the best, wherever you are!',
      'home.hero.title_html': 'One platform.<br><span class="accent">All your care.</span>',
      'home.hero.desc': 'FUENI brings together patients, practitioners, pharmacies and hospitals on a single modern and secure platform. Designed to give you peace of mind, support you and serve you wherever you want, whenever you need it.',
      'home.hero.search_ph': 'Name, specialty, facility…',
      'home.hero.search_aria': 'Search',
      'home.hero.location_ph': 'City, country…',
      'home.hero.location_aria': 'Location',
      'home.hero.search_btn': 'Search',
      'home.hero.stat1_label': 'French-speaking countries',
      'home.hero.stat2_label': 'Supported currencies',
      'home.hero.stat3_label': 'GDPR compliant',
      'home.hero.shape1_label': 'Next appointment',
      'home.hero.shape1_value': 'Today · 2:30 PM',
      'home.hero.shape2_label': 'Satisfaction rate',
      'home.hero.shape2_value': 'FUENI patients',

      'home.how.tag': 'How it works',
      'home.how.title_html': 'A simple solution,<br><span class="accent">in three steps.</span>',
      'home.how.subtitle': 'Whether you\'re a patient, a professional or a healthcare facility, access to FUENI is immediate. Account creation in under a minute, quick verification, and you\'re set. Medical excellence within everyone\'s reach.',
      'home.how.step1_label': 'Step 1',
      'home.how.step1_title': 'Create your account',
      'home.how.step1_desc': 'Sign up in a few clicks. No credit card required. Patient, practitioner or institution: choose your profile and get started right away.',
      'home.how.step2_label': 'Step 2',
      'home.how.step2_title': 'Verify your identity',
      'home.how.step2_desc': 'SMS verification for patients · manual validation after credential checks for practitioners (RPPS, Medical Board, supporting documents).',
      'home.how.step3_label': 'Step 3',
      'home.how.step3_title': 'Enjoy FUENI',
      'home.how.step3_desc': 'Book appointments, consult your records, message your doctor, get second opinions, manage payments through various means including Mobile Money. All from a single platform.',

      'home.audiences.tag': 'For whom?',
      'home.audiences.title_html': 'FUENI adapts to <span class="accent">your role.</span>',
      'home.audiences.subtitle': 'Each user gets a dedicated space and tools. Pick yours.',
      'home.audiences.patient_title': 'Patient',
      'home.audiences.patient_tag': 'Medical excellence within everyone\'s reach.',
      'home.audiences.patient_desc': 'For individuals — manage your health and that of your loved ones.',
      'home.audiences.patient_f1': 'Find and book with a doctor',
      'home.audiences.patient_f2': 'Find a service (exam, product)',
      'home.audiences.patient_f3': 'Store your medical documents',
      'home.audiences.patient_f4': 'Easy Mobile Money payment',
      'home.audiences.patient_cta': 'Create my patient account',
      'home.audiences.badge_popular': 'Most popular',
      'home.audiences.pro_title': 'Practitioner',
      'home.audiences.pro_tag': 'Your expertise to those who need it.',
      'home.audiences.pro_desc': 'Doctor, pharmacist, nurse — manage your practice end-to-end.',
      'home.audiences.pro_f1': 'Smart calendar & appointments',
      'home.audiences.pro_f2': 'Structured patient records (POMR/SOAP)',
      'home.audiences.pro_f3': 'Secure sharing of prescriptions and reports',
      'home.audiences.pro_f4': 'Analytics dashboard',
      'home.audiences.pro_f5': 'Wallet · automatic payouts',
      'home.audiences.pro_cta': 'Explore practitioner plans',
      'home.audiences.badge_phase2': 'Phase 2',
      'home.audiences.hosp_title': 'Practice & Hospital',
      'home.audiences.hosp_desc': 'For healthcare facilities — coordinate your team and services.',
      'home.audiences.hosp_f1': 'Multi-practitioner management',
      'home.audiences.hosp_f2': 'Institutional dashboard',
      'home.audiences.hosp_f3': 'Care coordination',
      'home.audiences.hosp_f4': 'Non-resident patient onboarding',
      'home.audiences.hosp_f5': 'Advanced statistics',
      'home.audiences.hosp_f6': 'Insurance integration',
      'home.audiences.hosp_cta': 'Coming soon →',

      'home.features.tag': 'Features',
      'home.features.title_html': 'Everything you need, <span class="accent">nothing extra.</span>',
      'home.features.subtitle': 'Features designed for everyday practice in the clinic, hospital and patient\'s home.',
      'home.features.f1_title': 'Smart appointment booking',
      'home.features.f1_desc': 'Search by specialty, city and availability. Book in seconds. Automatic SMS + email reminders 48 h and 1 h 30 before.',
      'home.features.f2_title': 'Structured medical record',
      'home.features.f2_desc': 'International POMR/SOAP standard format. History, treatments, SNOMED-CT diagnoses. Available offline when needed.',
      'home.features.f3_title': 'Mobile Money payment',
      'home.features.f3_desc': 'Flutterwave + Wave + Orange Money + MTN Money. Practitioner wallet with automatic payout within a few days.',

      'home.security.tag': 'Security & compliance',
      'home.security.title_html': 'Your data stays <span class="accent">your data.</span>',
      'home.security.subtitle': 'FUENI is built with the most demanding security standards in the healthcare industry. End-to-end encryption, full audit trail, and compliance in every country where you practice.',
      'home.security.s1_title': 'AES-256 encryption',
      'home.security.s1_desc': 'Your medical records are encrypted BEFORE storage. Not even our teams can access them.',
      'home.security.s2_title': 'PKI electronic signatures',
      'home.security.s2_desc': 'Prescriptions and reports are cryptographically signed, immutable and legally enforceable.',
      'home.security.s3_title': 'Strong authentication',
      'home.security.s3_desc': 'Two-factor authentication (SMS, app, physical key) for all professionals.',
      'home.security.s4_title': 'Country-by-country compliance',
      'home.security.s4_desc': 'GDPR (Europe), CDP (Senegal), ARTCI (CI), APDP (Mali, Benin), HDS (France option).',

      'home.coverage.tag': 'Coverage',
      'home.coverage.title_html': '9 countries at launch. <span class="accent">One single platform.</span>',
      'home.coverage.subtitle': 'FUENI launches in 9 French-speaking countries of West and Central Africa (UEMOA + Cameroon + DRC). Local currency display, adapted payments, local compliance. More countries coming.',

      'home.testimonials.tag': 'They use FUENI',
      'home.testimonials.title_html': 'Adopted by professionals.<br><span class="accent">Loved by their patients.</span>',
      'home.testimonials.subtitle': 'Illustrative testimonials — as the platform is launching, these testimonials are fictional but represent the feedback we aim for.',
      'home.testimonials.illustrative': 'Illustrative example',
      'home.testimonials.t1_quote': 'FUENI saves me 2 hours a day on administrative tasks. My patients love booking online. The structured patient record has become essential to my daily work.',
      'home.testimonials.t1_role': 'Cardiologist · Dakar, Senegal',
      'home.testimonials.t2_quote': 'As a pharmacist in a rural area, FUENI is a game-changer. Electronically signed prescriptions arrive directly — no more doubt about authenticity.',
      'home.testimonials.t2_role': 'Pharmacist · Bamako, Mali',
      'home.testimonials.t3_quote': 'Booking with my doctor from my phone has become second nature. And all my medical documents are in one place — I never lose anything anymore.',
      'home.testimonials.t3_role': 'Patient · Abidjan, Côte d\'Ivoire',

      'home.cta.title': 'Ready to transform your health?',
      'home.cta.desc': 'Join the platform that brings together French-speaking patients, practitioners and healthcare facilities. No credit card required to get started.',
      'home.cta.primary': 'Create my patient account',
      'home.cta.secondary': 'Healthcare professional sign-up',

      'home.footer.brand_desc': 'The digital healthcare platform for French-speaking Africa and Europe. One platform. All your care.',
      'home.footer.col_product': 'Product',
      'home.footer.link_features': 'Features',
      'home.footer.link_audiences': 'For whom?',
      'home.footer.link_pricing': 'Pricing',
      'home.footer.link_security': 'Security',
      'home.footer.link_roadmap': 'Roadmap',
      'home.footer.col_resources': 'Resources',
      'home.footer.link_help': 'Help center',
      'home.footer.link_blog': 'Blog',
      'home.footer.link_webinars': 'Webinars',
      'home.footer.link_api': 'API',
      'home.footer.link_partners': 'Partners',
      'home.footer.col_company': 'Company',
      'home.footer.link_about': 'About',
      'home.footer.link_careers': 'Careers',
      'home.footer.link_press': 'Press',
      'home.footer.link_contact': 'Contact',
      'home.footer.col_legal': 'Legal',
      'home.footer.link_terms': 'Legal notice',
      'home.footer.link_cgu': 'Terms of Use',
      'home.footer.link_privacy': 'Privacy',
      'home.footer.link_cookies': 'Cookies',
      'home.footer.link_compliance': 'Country compliance',
      'home.footer.copyright': '© 2026 FUENI — All rights reserved.',

      'home.chat.title': 'Chat with us',

      // ── 02 — Sign-up ──────────────────────────────────────────────────────
      'signup.page_title': 'FUENI — Patient Sign-up',
      'signup.proto_bar': 'Screen 02 — Patient Sign-up',
      'signup.brand.tagline': 'Patient Area — Your health in your hands',
      'signup.role_chip': 'Individual Patient Account',
      'signup.title': 'Create my account',
      'signup.subtitle': '1 minute — just a few more steps to complete your registration',
      'signup.error.required': 'Please complete all required fields marked with an asterisk (*).',
      'signup.field.firstname_label': 'First name *',
      'signup.field.firstname_ph': 'e.g. Aïssatou',
      'signup.field.lastname_label': 'Last name *',
      'signup.field.lastname_ph': 'e.g. Diop',
      'signup.field.dob_label': 'Date of birth *',
      'signup.field.dob_info': 'You must be 18 or older',
      'signup.field.dob_hint': 'You must be 18 or older to sign up.',
      'signup.field.sex_label': 'Sex *',
      'signup.field.sex_choose': 'Choose...',
      'signup.field.sex_female': 'Female',
      'signup.field.sex_male': 'Male',
      'signup.field.sex_other': 'Other',
      'signup.field.sex_norep': 'Prefer not to say',
      'signup.field.email_label': 'Email address *',
      'signup.field.email_ph': 'e.g. aissatou.diop@example.com',
      'signup.field.email_hint': 'Invalid email address.',
      'signup.field.phone_label': 'Phone *',
      'signup.field.phone_choose': 'Choose...',
      'signup.field.phone_ph': 'e.g. 77 123 45 67',
      'signup.field.phone_hint': 'Invalid number for the selected country.',
      'signup.field.pwd_label': 'Password *',
      'signup.field.pwd_aria': 'Show password',
      'signup.field.pwd_r_len': 'At least 8 characters',
      'signup.field.pwd_r_upper': 'One uppercase letter',
      'signup.field.pwd_r_lower': 'One lowercase letter',
      'signup.field.pwd_r_num': 'One digit',
      'signup.field.pwd_r_spe': 'One special character (e.g. ! ? @ # $ % & * …)',
      'signup.cgu_html': 'I accept the <a href="#" class="text-decoration-none" style="color:#16a085;">Terms of Use</a> and the <a href="#" class="text-decoration-none" style="color:#16a085;">Privacy Policy</a> *',
      'signup.health_html': 'I consent to the processing of my <strong>health data</strong> by FUENI as part of the service *',
      'signup.submit': 'Create my account',
      'signup.divider_or': 'or',
      'signup.have_account_html': 'Already have an account? <a href="#" class="text-decoration-none fw-semibold" style="color:#16a085;">Log in</a>',
      'signup.are_you_pro_html': '<i class="fa fa-user-md me-1"></i>Are you a healthcare professional? <a href="#" class="text-decoration-none fw-semibold" style="color:#16a085;">Pro sign-up</a>',

      // ── 03 — OTP ──────────────────────────────────────────────────────────
      'otp.page_title': 'FUENI — SMS Verification',
      'otp.proto_bar': 'Screen 03 — SMS Verification (OTP)',
      'otp.brand.tagline': 'Just a few more steps to complete your registration',
      'otp.steps.signup': 'Sign-up',
      'otp.steps.sms': 'SMS Verification',
      'otp.steps.profile': 'Base profile',
      'otp.steps.welcome': 'Welcome',
      'otp.title': 'Phone number verification',
      'otp.subtitle_html': 'A 6-digit code has been sent by SMS to <strong id="maskedPhone">+221 ** *** ** 67</strong>',
      'otp.demo_hint_html': '<i class="fa fa-flask me-1"></i><strong>Demo:</strong> enter <code>123456</code> to validate · any other code → error state',
      'otp.lockout_html': '<i class="fa fa-lock me-2"></i><strong>Too many attempts.</strong> This code is now disabled. Request a new code <span id="lockoutHint">as soon as resend is available</span>.',
      'otp.expired_html': '<i class="fa fa-clock-rotate-left me-2"></i><strong>Code expired.</strong> Click "Resend code" to get a new one.',
      'otp.resend_html': 'Didn\'t receive it? <span id="resendLink" class="resend-link disabled">Resend code</span> <span id="resendTimerWrap">· available in <strong id="resendTimer">00:30</strong></span>',
      'otp.verify_btn_html': 'Verify <i class="fa fa-arrow-right ms-2"></i>',
      'otp.edit_info': 'Edit my information',
      'otp.tester_summary_html': '<i class="fa fa-vial me-1"></i> Test states (demo shortcuts)',
      'otp.tester.wrong': 'Incorrect code (1 attempt)',
      'otp.tester.lockout': 'Lockout (3 attempts used)',
      'otp.tester.expired': 'Code expired',
      'otp.tester.reset_html': '<i class="fa fa-rotate-right me-1"></i>Reset',
      // Dynamic strings (used via NazI18n.t in JS)
      'otp.error.wrong_singular': 'Incorrect code. You have {n} attempt remaining.',
      'otp.error.wrong_plural': 'Incorrect code. You have {n} attempts remaining.',
      'otp.flash.resent_html': '<i class="fa fa-check-circle me-2"></i>New code sent by SMS.',

      // ── 04 — Profile base ─────────────────────────────────────────────────
      'profile.page_title': 'FUENI — Base profile',
      'profile.proto_bar': 'Screen 04 — Base profile',
      'profile.brand.tagline': 'Last step to complete your registration',
      'profile.title': 'Complete your profile',
      'profile.subtitle': 'Last step (30 seconds).',
      'profile.error.required': 'Please complete all required fields marked with an asterisk (*).',
      'profile.field.country_label': 'Country of residence *',
      'profile.field.country_choose': 'Choose...',
      'profile.field.country_hint': 'Pre-filled based on your phone country code',
      'profile.field.city_label': 'City *',
      'profile.field.city_choose': 'Choose...',
      'profile.field.city_other_ph': 'Enter your city',
      'profile.field.lang_label': 'Communication language *',
      'profile.field.lang_fr': 'Français',
      'profile.field.lang_en': 'English',
      'profile.field.address_label_html': 'Address <span class="text-muted fw-normal">(optional)</span>',
      'profile.field.address_ph': 'e.g. Sacré-Cœur 3, Villa 12, opposite El Hadji pharmacy',
      'profile.submit_html': 'Finish and access my account <i class="fa fa-check ms-2"></i>',
      // City "Autre" option (used dynamically in JS)
      'profile.city.other': 'Other (specify)',

      // ── 05 — Dashboard ────────────────────────────────────────────────────
      'dash.page_title': 'FUENI — My patient area',
      'dash.proto_bar_html': '<i class="fa fa-eye me-1"></i> Patient Area · Dashboard · <a href="01-home.html" class="text-decoration-none">← Back to home</a>',
      'dash.sidebar.area': 'Patient Area',
      'dash.sidebar.verified': 'Account verified',
      'dash.sidebar.section_my_space': 'My space',
      'dash.sidebar.dashboard': 'Dashboard',
      'dash.sidebar.my_appts': 'My appointments',
      'dash.sidebar.book': 'Book an appointment',
      'dash.sidebar.my_docs': 'My documents',
      'dash.sidebar.section_account': 'My account',
      'dash.sidebar.my_profile': 'My profile',
      'dash.sidebar.notifications': 'Notifications',
      'dash.sidebar.rights': 'My rights and data',
      'dash.sidebar.section_help': 'Help',
      'dash.sidebar.faq': 'FAQ',
      'dash.sidebar.support': 'Contact support',
      'dash.sidebar.logout': 'Log out',
      'dash.email_banner_html': '<strong>Your email address is not yet verified.</strong> Verify it to be able to book appointments and receive your medical documents.',
      'dash.email_banner.verify': 'Verify now',
      'dash.welcome.hello_html': 'Hello <span id="userFirstName">Aïssatou</span> 👋',
      'dash.welcome.question': 'How are you feeling today?',
      'dash.welcome.book_html': '<i class="fa fa-plus me-1"></i>Book an appointment',
      'dash.appts.title_html': '<i class="fa fa-calendar me-2" style="color:#16a085;"></i>My upcoming appointments',
      'dash.appts.view_all': 'View all →',
      'dash.appts.month_may': 'May',
      'dash.appts.month_jun': 'Jun',
      'dash.appts.specialty1': 'Cardiology · 2:30 PM · Cabinet Médical Plateau, Dakar',
      'dash.appts.specialty2': 'General medicine · 10:00 AM · Clinique Pasteur',
      'dash.appts.status_confirmed': 'Confirmed',
      'dash.docs.title_html': '<i class="fa fa-folder me-2" style="color:#16a085;"></i>Recent documents',
      'dash.docs.doc1_title': 'Prescription Dr. Sow',
      'dash.docs.doc1_meta': 'Shared by practitioner · 05/10/2026',
      'dash.docs.status_new': 'New',
      'dash.docs.doc2_title': 'Blood test result',
      'dash.docs.doc2_meta': 'My upload · 05/05/2026 · Awaiting validation',
      'dash.docs.status_pending': 'Pending',
      'dash.docs.doc3_title': 'Report Dr. Diallo',
      'dash.docs.doc3_meta': 'Shared by practitioner · 04/28/2026',
      'dash.docs.status_seen': 'Seen',
      'dash.completion.text_html': 'Profile complete at <strong>60%</strong>',
      'dash.completion.link': 'Complete my profile →'
    }
  };

  // Allow page scripts to register additional keys (for dynamic strings like error counters)
  function register(lang, entries) {
    if (!I18N[lang]) I18N[lang] = {};
    Object.assign(I18N[lang], entries);
  }

  window.NazI18n = { t, setLang, getLang, applyLang, register };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectToggle();
      applyLang();
      updateToggleUI();
    });
  } else {
    injectToggle();
    applyLang();
    updateToggleUI();
  }
})();
