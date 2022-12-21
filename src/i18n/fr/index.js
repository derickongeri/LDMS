export default {
  failed: "L'operation a échoué",
  success: "L'opération a réussi",
  tabs: {
    //french
    ldh: "perte/gain de végétation",
    forestchange: "Changement de forêt",
    forestfires: "Feu de forêt",
    medalus: "vegetation loss/gain"
  },
  logo: {
    heading: "MISLAND",
    north_africa: "AFRIQUE DU NORD",
    subtitle:
      "LA SURVEILLANCE DES SERVICES INTERRELIÉS POUR LA DÉGRADATION DES TERRES"
  },

  auth: {
    //login form
    login: "S'identifier",
    fill: "Ce champ ne peut être vide",
    forgot_pass: "Mot de passe oublié?",
    login_error:
      "Erreur, n'a pas pu s'authentifier, confirmer les détails et réessayer"
  },
  register: {
    //register form
    register: "S'inscrire",
    occupation: "Veuillez saisir la profession",
    email: "L'email doit être valide",
    signup: "Pas un utilisateur? S'inscrire",
    login_link: "Déjà utilisateur? se connecter ",
    title: "Titre *"
  },
  hints: {
    // Login/ register form hints
    email: "Entrer votre email *",
    password: "Entrer le mot de passe"
  },
  labels: {
    first_name: "Prénom *",
    last_name: "Nom de famille *",
    email: "Email *",
    password: "mot de passe *",
    repeat_password: "Répéter le mot de passe *"
  },
  submit: "soumettre",
  cancel: "annuler",
  rules: {
    email: "Saisissez un e-mail valide",
    password: "Entrez un mot de passe fort (au moins 8 caractères)",
    confirm_pass: "les mots de passe doivent correspondre",
    match: "les mots de passe doivent correspondre"
  },
  resetPass: {
    forgotpass: "Mot de passe oublié?",
    resetstm: "Entrez votre email pour obtenir un lien de réinitialisation",
    fail_msg: "Erreur, n'a pas pu demander la réinitialisation du mot de passe",
    "Please confirm password reset request from your email.":
      "Veuillez confirmer la demande de réinitialisation du mot de passe à partir de votre courriel.",
    newpass:
      "Veuillez entrer un nouveau mot de passe, le confirmer et le soumettre"
  },
  maps: {
    selectcountry: "Choisir un domaine",
    selectregion: "Choisissez une région",
    selectsubregion: "sous région"
  },
  //summary translation
  summary: "Résumé",
  landcover:
    "En <strong>{0}</strong>, la couverture terrestre de <strong>{1}</strong> était composée de <strong>{2}</strong> de forêt, <strong>{3}</strong> de terres vertes, <strong>{4}</strong> de zones humides, <strong>{5}</strong> de terres nues, <strong>{6}</strong> de surfaces artificielles et <strong>{7}</strong> de terres cultivées.",
  lessthan: "Moins que 1%",
  Land_Cover_Change:
    "L'évolution de la couverture terrestre de la <strong>{0}</strong> entre <strong>{1}</strong> et <strong>{2}</strong> indique que potentiellement <strong>{3}</strong>dégradés, <strong>{4}</strong> améliorés et <strong>{5}</strong> sont restés stables.",
  Carbon_Stock_Change:
    "L'évolution du stock de carbone pour la <strong>{0}</strong> entre <strong>{1}</strong> et <strong>{2}</strong>, indique que potentiellement, <strong>{3}</strong> dégradés, <strong>{4}</strong> améliorés et <strong>{5}</strong> sont restés stables.",
  Trajectory:
    "La trajectoire d'<strong>{0}</strong> entre <strong>{1}</strong> et <strong>{2}</strong> indique que potentiellement, <strong>{3}</strong> dégradé, <strong>{4}</strong> amélioré et <strong>{5}</strong> sont restés stables.",
  State:
    "L'état de la <strong>{0}</strong> entre <strong>{1}</strong> et <strong>{2}</strong>, indique que potentiellement, <strong>{3}</strong> dégradé, <strong>{4}</strong> amélioré et <strong>{5}</strong> sont restés stables.",
  Performance:
    "Les performances d'<strong>{0}</strong> entre <strong>{1}</strong> et <strong>{2}</strong>, indiquent que potentiellement,<strong>{3}</strong> dégradés, <strong>{4}</strong> sont restés stables",
  forestchangesummary:
    "Entre <strong>{0}</strong> et <strong>{1}</strong>, <strong>{2}</strong> a subi  {3} nette de <strong>{4} m2</strong>  de forêt",
  forestchangesummaryalt:
    "En <strong>{0}</strong>,  <strong>{1}</strong> a connu une perte de <strong>{2}</strong> m<sup>2</sup></strong> de forêt",
  land_degradation:
    "La dégradation des terres pour l'<strong>{0}</strong> entre <strong>{1}</strong> et <strong>{2}</strong> indique que potentiellement, <strong>{3}</strong> dégradé, <strong>{4}</strong> amélioré et <strong>{5}</strong> est resté stable.",
  land_productivity:
    "La productivité des terres pour  l'<strong>{0}</strong> entre <strong>{1}</strong> et <strong>{2}</strong> indique que potentiellement, <strong>{3}</strong> dégradé, <strong>{4}</strong> amélioré et <strong>{5}</strong> est resté stable.",
  veg_loss_gain:
    "Entre <strong>{1}</strong> et <strong>{2}</strong>, <strong>{4}</strong> de <strong>{0}</strong> a connu un gain de végétation, <strong>{3}</strong> une perte de végétation, et <strong>{5}</strong> est resté stable.",
  Summary_alternative: {
    no_data: "Pas de données pour la région sélectionnée ({0})",
    no_change: "Il n'y a pas eu de changement ({0})",
    selected_area: "Zone sélectionnée",
    No_data_values: "Aucune valeur de données"
  },
  //end of summary translation
  lossgain: {
    loss: "une perte nette",
    gain: "un gain net",
    stability: "stabilité"
  },
  sdgSelections: {
    options0: {
      Productivity_: "Productivité",
      LULC: "LULC",
      carbon_stock: "Stock de carbone",
      land_degradation: "Dégradation du terrain"
    }
  },
  secondOptions: {
    Productivity: {
      land_productivity: "productivité des terres",
      land_productivity_change: "Changement de productivité des terres",
      trajectory: "Trajectoire",
      State: "Etat",
      Performance: "Performance"
    },
    LULC: {
      Land_Cover: "Couverture terrestre",
      Land_Cover_Change: "Changement de couverture terrestre"
    },
    CarbonStock: {
      Carbon_stock: "Stock de carbone",
      Carbon_Stock_Change: "Changement de stock de carbone"
    },
    LandDegradation: {
      Land_degradation: "Dégradation du terrain",
      Land_degradation_Change: "Dégradation des terres Changement"
    }
  },
  forest_fire: {
    prefire_range: "Prefire Range",
    postfire_range: "Postfire Range"
  },
  admin_page: {
    registered_users: "Utilisateurs enregistrés",
    select_file: "Dossier",
    select_file_type: "Tapez",
    year: "Year",
    select_file_options: {
      LULC: "LULC",
      SOC: "SOC",
      NDVI: "NDVI",
      Rainfall: "Pluie",
      "Ecological Units": "Unités écologiques"
    },
    shapefile_tables: "Fichiers Shape téléchargés",
    soc_refs: "Années de référence du SOC",
    eco_refs: "Années de référence écologique",
    uploader: "Sélectionnez",
    registered_users_table: {
      name: "Nom ",
      email: "Courriel ",
      institution: "Institution",
      title: "titre",
      profession: "Profession",
      isActive: "Actif",
      edit: "Edit"
    },
    custom_shapefile_tables: {
      name: "Nom ",
      email: "Courriel",
      uploadDate: "Date de mise en ligne",
      isActive: "Actif",
      del: "supprimer"
    },
    edit_user: "Modifier l'utilisateur",
    edit_user_form: {
      email: "Courriel",
      first_name: "Prénom",
      is_active: "Actif",
      is_admin: "Administrateur",
      last_name: "Nom de famille",
      profile: "Profil",
      can_upload_custom_shapefile: "Peut télécharger un Shapefile",
      can_upload_standard_raster: "Peut télécharger un raster",
      institution: "Institution",
      profession: "Profession",
      title: "Titre"
    }
  },
  legend: {
    Water: "Eau",
    Bareland: "Sol nu",
    Artificial: "Artificiel",
    Wetland: "Zones humides",
    Cropland: "Terres cultivées",
    Grassland: "Prairie",
    Forest: "Forêt",
    Stable: "Stable",
    Improvement: "Amélioration",
    Degradation: "Dégradation",
    "Potential Degradation": "Dégradation potentielle",
    "Potential Improvement": "Améliorations possibles",
    "Not degraded": "Non dégradé",
    Degraded: "Dégradé",
    Gain: "Gagnez",
    Loss: "Perte",
    forest_loss: "Perte de forêts",
    "Vegetation Loss": "Perte de végétation",
    "Vegetation Gain": "Gain de la végétation",
    //forest fire legend data
    "Enhanced Regrowth": "Recroissance renforcée",
    Unburned: "Non brûlé",
    "Low Severity": "Faible gravité",
    "Moderate Severity": "Gravité modérée",
    "High Severity": "Gravité élevée",
    //medalus
    "Hyper-arid": "Hyper-arid",
    Arid: "Arid",
    "Semi-arid": "Semi-aride",
    "Dry sub-humid": "Sub-humide sec",
    "Moist sub-humid": "Sub-humide humide",
    Humid: "Humide",
    "High Quality": "Haute qualité",
    "Moderate Quality": "Qualité modérée",
    "Low Quality": "faible qualité",
    High:"Hoch",
    Low:"Niedrig",
    Moderate:"Mäßig",
  },
  legend_title: {
    "Land Productivity": "productivité des terres",
    Trajectory: "Trajectoire",
    State: "Etat",
    Performance: "Performance",
    "Land Cover": "Couverture terrestre",
    "Land Cover Change": "Changement de couverture terrestre",
    "Carbon stock": "Stock de carbone",
    "Carbon Stock Change": "Changement de stock de carbone",
    "Land degradation": "Dégradation du terrain",
    "Land degradation Change": "Dégradation des terres Changement",
    vegetation_condition: "Végétation",
    "Forest Fire": "Feu de forêt",
    //medalus
    "Hyper-arid": "Hyper-arid",
    Arid: "Arid",
    "Semi-arid": "Semi-aride",
    "Dry sub-humid": "Sub-humide sec",
    "Moist sub-humid": "Sub-humide humide",
    Humid: "Humide",
    "High Quality": "Haute qualité",
    "Moderate Quality": "Qualité modérée",
    "Low Quality": "faible qualité"
  },
  profile: {
    geojson_table_header: "Ma région personnalisée Uploads",
    profile_details: "Mes coordonnées",
    upload_section: "Téléchargements",
    edit_details: "Modifier les détails",
    edit_button: "Modifier le profil",
    edit_form: {
      confirm_change: "Vous devez confirmer les détails remplis",
      confirm_check_box: "J'ai confirmé mes coordonnées"
    }
  },
  forest_change: "Le changement de la forêt",
  forest_loss: "Perte de forêts",
  large_area_error_message:
    "La zone sélectionnée est trop grande pour calculer les indicateurs , veuillez sélectionner une zone de moins de 200 000 ha ou une sous-région.",
  Login_msg_Results: "Veuillez vous connecter pour voir les résultats",
  user_feedback_pointer:
    "N'oubliez pas d'être aussi descriptif que possible, vous pouvez également faire glisser ou coller des images",
  guide_link: "Lien vers le guide",
  indexPage: {
    training_video: "Vidéo de formation du projet",
    index_title: "MISLAND Afrique du Nord",
    index_title_subtitle:
      "Service intégré de surveillance de la dégradation des terres, cliquer",
    index_title_subtitle_documentation: "pour la documentation",
    index_land_degradation_indicators: "Indicateurs de dégradation des sols",
    index_land_degradation_indicators_subtitle:
      "Cliquez sur l'arbre ci-dessous pour voir les indicateurs et sous-indicateurs suivis à l'aide de cet outil",
    feedback_and_help: "Commentaires et aide",
    feedback_and_help_subsitle: `Pour tout retour d'information, veuillez vous rendre à la section "Feedback" `,
    here: "ici",
    frequently_asked_questions: "Foire aux questions"
  }
};
