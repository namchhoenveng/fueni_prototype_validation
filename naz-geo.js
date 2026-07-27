/* naz-geo.js — Référentiel géographique (9 pays MVP) : Pays → Régions → Villes principales.
   Les régions sont les divisions administratives officielles de 1er niveau.
   Les villes listent le chef-lieu + quelques villes notables ; la liste n'est pas exhaustive
   (l'UI propose « Autre… » pour saisir une ville absente). window.NazGeo = { countries, regions, cities }. */
window.NazGeo = (function () {
  // Noms de pays alignés sur CURRENCY_BY_COUNTRY (écran 19) : 'Sénégal', 'RDC', etc.
  const countries = ['Bénin', 'Burkina Faso', 'Cameroun', "Côte d'Ivoire", 'Mali', 'Niger', 'RDC', 'Sénégal', 'Togo'];

  const regions = {
    'Sénégal': ['Dakar', 'Thiès', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kédougou', 'Kolda', 'Louga', 'Matam', 'Saint-Louis', 'Sédhiou', 'Tambacounda', 'Ziguinchor'],
    "Côte d'Ivoire": ['Abidjan', 'Yamoussoukro', 'Bas-Sassandra', 'Comoé', 'Denguélé', 'Gôh-Djiboua', 'Lacs', 'Lagunes', 'Montagnes', 'Sassandra-Marahoué', 'Savanes', 'Vallée du Bandama', 'Woroba', 'Zanzan'],
    'Cameroun': ['Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral', 'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest'],
    'Mali': ['Bamako', 'Kayes', 'Koulikoro', 'Sikasso', 'Ségou', 'Mopti', 'Tombouctou', 'Gao', 'Kidal', 'Ménaka', 'Taoudénit'],
    'Bénin': ['Alibori', 'Atacora', 'Atlantique', 'Borgou', 'Collines', 'Couffo', 'Donga', 'Littoral', 'Mono', 'Ouémé', 'Plateau', 'Zou'],
    'Togo': ['Maritime', 'Plateaux', 'Centrale', 'Kara', 'Savanes'],
    'Burkina Faso': ['Boucle du Mouhoun', 'Cascades', 'Centre', 'Centre-Est', 'Centre-Nord', 'Centre-Ouest', 'Centre-Sud', 'Est', 'Hauts-Bassins', 'Nord', 'Plateau-Central', 'Sahel', 'Sud-Ouest'],
    'Niger': ['Niamey', 'Agadez', 'Diffa', 'Dosso', 'Maradi', 'Tahoua', 'Tillabéri', 'Zinder'],
    'RDC': ['Kinshasa', 'Kongo-Central', 'Kwango', 'Kwilu', 'Mai-Ndombe', 'Kasaï', 'Kasaï-Central', 'Kasaï-Oriental', 'Lomami', 'Sankuru', 'Maniema', 'Nord-Kivu', 'Sud-Kivu', 'Ituri', 'Haut-Uele', 'Bas-Uele', 'Tshopo', 'Mongala', 'Nord-Ubangi', 'Sud-Ubangi', 'Équateur', 'Tshuapa', 'Tanganyika', 'Haut-Lomami', 'Lualaba', 'Haut-Katanga']
  };

  const cities = {
    'Sénégal': {
      'Dakar': ['Dakar', 'Pikine', 'Guédiawaye', 'Rufisque', 'Bargny'],
      'Thiès': ['Thiès', 'Mbour', 'Tivaouane', 'Joal-Fadiouth'],
      'Diourbel': ['Diourbel', 'Touba', 'Mbacké', 'Bambey'],
      'Fatick': ['Fatick', 'Foundiougne', 'Gossas'],
      'Kaffrine': ['Kaffrine', 'Koungheul', 'Malem-Hodar'],
      'Kaolack': ['Kaolack', 'Guinguinéo', 'Nioro du Rip'],
      'Kédougou': ['Kédougou', 'Salémata', 'Saraya'],
      'Kolda': ['Kolda', 'Vélingara', 'Médina Yoro Foulah'],
      'Louga': ['Louga', 'Kébémer', 'Linguère'],
      'Matam': ['Matam', 'Kanel', 'Ranérou'],
      'Saint-Louis': ['Saint-Louis', 'Dagana', 'Richard-Toll', 'Podor'],
      'Sédhiou': ['Sédhiou', 'Bounkiling', 'Goudomp'],
      'Tambacounda': ['Tambacounda', 'Bakel', 'Goudiry', 'Koumpentoum'],
      'Ziguinchor': ['Ziguinchor', 'Bignona', 'Oussouye']
    },
    "Côte d'Ivoire": {
      'Abidjan': ['Abidjan', 'Abobo', 'Cocody', 'Yopougon', 'Bingerville'],
      'Yamoussoukro': ['Yamoussoukro'],
      'Bas-Sassandra': ['San-Pédro', 'Soubré', 'Sassandra'],
      'Comoé': ['Abengourou', 'Aboisso', 'Grand-Bassam'],
      'Denguélé': ['Odienné', 'Minignan'],
      'Gôh-Djiboua': ['Gagnoa', 'Divo', 'Lakota'],
      'Lacs': ['Dimbokro', 'Bongouanou', 'Toumodi'],
      'Lagunes': ['Dabou', 'Tiassalé', 'Agboville'],
      'Montagnes': ['Man', 'Danané', 'Duékoué'],
      'Sassandra-Marahoué': ['Daloa', 'Bouaflé', 'Issia'],
      'Savanes': ['Korhogo', 'Ferkessédougou', 'Boundiali'],
      'Vallée du Bandama': ['Bouaké', 'Katiola', 'Béoumi'],
      'Woroba': ['Séguéla', 'Mankono', 'Touba'],
      'Zanzan': ['Bondoukou', 'Bouna', 'Tanda']
    },
    'Cameroun': {
      'Adamaoua': ['Ngaoundéré', 'Tibati', 'Meiganga'],
      'Centre': ['Yaoundé', 'Mbalmayo', 'Obala', 'Bafia'],
      'Est': ['Bertoua', 'Batouri', 'Abong-Mbang'],
      'Extrême-Nord': ['Maroua', 'Kousséri', 'Mokolo'],
      'Littoral': ['Douala', 'Nkongsamba', 'Edéa'],
      'Nord': ['Garoua', 'Guider', 'Poli'],
      'Nord-Ouest': ['Bamenda', 'Kumbo', 'Wum'],
      'Ouest': ['Bafoussam', 'Dschang', 'Bandjoun', 'Mbouda'],
      'Sud': ['Ebolowa', 'Kribi', 'Sangmélima'],
      'Sud-Ouest': ['Buéa', 'Limbe', 'Kumba', 'Tiko']
    },
    'Mali': {
      'Bamako': ['Bamako'],
      'Kayes': ['Kayes', 'Kita', 'Nioro du Sahel'],
      'Koulikoro': ['Koulikoro', 'Kati', 'Dioïla'],
      'Sikasso': ['Sikasso', 'Koutiala', 'Bougouni'],
      'Ségou': ['Ségou', 'San', 'Niono'],
      'Mopti': ['Mopti', 'Sévaré', 'Djenné', 'Bandiagara'],
      'Tombouctou': ['Tombouctou', 'Goundam', 'Diré'],
      'Gao': ['Gao', 'Ansongo', 'Bourem'],
      'Kidal': ['Kidal', 'Tessalit'],
      'Ménaka': ['Ménaka'],
      'Taoudénit': ['Taoudénit']
    },
    'Bénin': {
      'Alibori': ['Kandi', 'Malanville', 'Banikoara'],
      'Atacora': ['Natitingou', 'Tanguiéta', 'Kérou'],
      'Atlantique': ['Abomey-Calavi', 'Ouidah', 'Allada'],
      'Borgou': ['Parakou', 'Nikki', 'Bembérèké'],
      'Collines': ['Dassa-Zoumè', 'Savalou', 'Savè'],
      'Couffo': ['Aplahoué', 'Dogbo', 'Klouékanmè'],
      'Donga': ['Djougou', 'Bassila', 'Ouaké'],
      'Littoral': ['Cotonou'],
      'Mono': ['Lokossa', 'Comè', 'Grand-Popo'],
      'Ouémé': ['Porto-Novo', 'Adjarra', 'Sèmè-Kpodji'],
      'Plateau': ['Sakété', 'Pobè', 'Kétou'],
      'Zou': ['Abomey', 'Bohicon', 'Covè']
    },
    'Togo': {
      'Maritime': ['Lomé', 'Aného', 'Tsévié', 'Vogan'],
      'Plateaux': ['Atakpamé', 'Kpalimé', 'Notsé', 'Badou'],
      'Centrale': ['Sokodé', 'Sotouboua', 'Tchamba'],
      'Kara': ['Kara', 'Bassar', 'Niamtougou', 'Kandé'],
      'Savanes': ['Dapaong', 'Mango', 'Cinkassé']
    },
    'Burkina Faso': {
      'Boucle du Mouhoun': ['Dédougou', 'Nouna', 'Tougan'],
      'Cascades': ['Banfora', 'Sindou'],
      'Centre': ['Ouagadougou'],
      'Centre-Est': ['Tenkodogo', 'Koupéla', 'Garango'],
      'Centre-Nord': ['Kaya', 'Kongoussi', 'Boulsa'],
      'Centre-Ouest': ['Koudougou', 'Réo', 'Léo'],
      'Centre-Sud': ['Manga', 'Kombissiri', 'Pô'],
      'Est': ["Fada N'Gourma", 'Diapaga', 'Bogandé'],
      'Hauts-Bassins': ['Bobo-Dioulasso', 'Houndé', 'Orodara'],
      'Nord': ['Ouahigouya', 'Yako', 'Gourcy'],
      'Plateau-Central': ['Ziniaré', 'Boussé', 'Zorgho'],
      'Sahel': ['Dori', 'Gorom-Gorom', 'Djibo'],
      'Sud-Ouest': ['Gaoua', 'Diébougou', 'Batié']
    },
    'Niger': {
      'Niamey': ['Niamey'],
      'Agadez': ['Agadez', 'Arlit', 'Bilma'],
      'Diffa': ['Diffa', 'Nguigmi', "N'Guigmi"],
      'Dosso': ['Dosso', 'Gaya', 'Doutchi'],
      'Maradi': ['Maradi', 'Tessaoua', 'Dakoro'],
      'Tahoua': ['Tahoua', 'Birni-N’Konni', 'Madaoua'],
      'Tillabéri': ['Tillabéri', 'Téra', 'Ayorou'],
      'Zinder': ['Zinder', 'Magaria', 'Tanout']
    },
    'RDC': {
      'Kinshasa': ['Kinshasa'],
      'Kongo-Central': ['Matadi', 'Boma', 'Muanda', 'Mbanza-Ngungu'],
      'Kwango': ['Kenge', 'Kahemba'],
      'Kwilu': ['Kikwit', 'Bandundu', 'Idiofa'],
      'Mai-Ndombe': ['Inongo', 'Nioki'],
      'Kasaï': ['Tshikapa', 'Ilebo'],
      'Kasaï-Central': ['Kananga', 'Demba'],
      'Kasaï-Oriental': ['Mbuji-Mayi', 'Miabi'],
      'Lomami': ['Kabinda', 'Mwene-Ditu'],
      'Sankuru': ['Lusambo', 'Lodja'],
      'Maniema': ['Kindu', 'Kasongo'],
      'Nord-Kivu': ['Goma', 'Butembo', 'Beni'],
      'Sud-Kivu': ['Bukavu', 'Uvira', 'Baraka'],
      'Ituri': ['Bunia', 'Aru', 'Mahagi'],
      'Haut-Uele': ['Isiro', 'Watsa'],
      'Bas-Uele': ['Buta', 'Aketi'],
      'Tshopo': ['Kisangani', 'Ubundu'],
      'Mongala': ['Lisala', 'Bumba'],
      'Nord-Ubangi': ['Gbadolite', 'Businga'],
      'Sud-Ubangi': ['Gemena', 'Zongo'],
      'Équateur': ['Mbandaka', 'Bikoro'],
      'Tshuapa': ['Boende', 'Ikela'],
      'Tanganyika': ['Kalemie', 'Kabalo', 'Manono'],
      'Haut-Lomami': ['Kamina', 'Kaniama'],
      'Lualaba': ['Kolwezi', 'Dilolo'],
      'Haut-Katanga': ['Lubumbashi', 'Likasi', 'Kipushi', 'Kasumbalesa']
    }
  };

  return { countries: countries, regions: regions, cities: cities };
})();
