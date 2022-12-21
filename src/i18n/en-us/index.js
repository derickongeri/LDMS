export default {
  failed: "Action failed",
  success: "Action was successful",
  tabs: {
    //english
    ldh: "vegetation loss/gain",
    forestchange: "Forest change",
    forestfires: "Forest Fire",
    medalus: "perte/gain de végétation"
  },
  logo: {
    heading: "MISLAND",
    north_africa: "NORTH AFRICA",
    subtitle: "MONITORING INTERGRETED SERVICES FOR LAND DEGRADATION"
  },

  auth: {
    //login form
    login: "Login",
    fill: "This field can not be blank",
    forgot_pass: "Forgot Password?",
    login_error: "Error, could not authenticate, confirm details and try again"
  },
  register: {
    //register form
    register: "Register",
    occupation: "Please enter occupation",
    email: "E-mail must be valid",
    signup: "Not a user? Sign up",
    login_link: "Already a user? Sign in ",
    title: "Title *"
  },
  hints: {
    // Login/ register form hints
    email: "Enter your email *",
    password: "Enter password"
  },

  labels: {
    first_name: "First Name *",
    last_name: "Last Name *",
    email: "Email *",
    password: "password *",
    repeat_password: "Repeat password  *"
  },
  submit: "submit",
  cancel: "cancel",
  rules: {
    email: "Type a valid email",
    password: "Enter a strong password (atleast 8 characters)",
    confirm_pass: "Passwords must match",
    match: "passwords must match"
  },
  resetPass: {
    forgotpass: "Forgot your password?",
    resetstm: "Enter your email to get a reset link",
    fail_msg: "Error, could not request password reset",
    "Please confirm password reset request from your email.":
      "Please confirm password reset request from your email.",
    newpass: "Please enter new password, confirm and submit"
  },
  maps: {
    selectcountry: "Select Area",
    selectregion: "Select Region",
    selectsubregion: "Select Sub Region"
  },
  //summary translation
  summary: "Summary",
  landcover:
    "In  <strong>{0}</strong> , the Land Cover for <strong>{1}</strong> was composed of <strong>{2}</strong> Forest, <strong>{3}</strong>  Grassland, <strong>{4}</strong> Wetland, <strong>{5}</strong>  Bareland, <strong>{6}</strong> Artificial areas and <strong>{7}</strong>  Croplands.",
  lessthan: "less than 1%",
  Land_Cover_Change:
    "The Land cover change for <strong>{0}</strong> between <strong>{1}</strong> and <strong>{2}</strong>, indicate that potentially, <strong>{3}</strong> degraded, <strong>{4}</strong> improved and <strong>{5}</strong> remained stable.",
  Carbon_Stock_Change:
    "The carbon stock change for <strong>{0}</strong> between <strong>{1}</strong> and <strong>{2}</strong>, indicate that potentially, <strong>{3}</strong> degraded, <strong>{4}</strong> improved and <strong>{5}</strong> remained stable.",
  Trajectory:
    "The productivity trajectory for <strong>{0}</strong> between <strong>{1}</strong> and <strong>{2}</strong>, indicate that potentially, <strong>{3}</strong> degraded, <strong>{4}</strong> improved and <strong>{5}</strong> remained stable.",
  State:
    "The productivity state for <strong>{0}</strong> between <strong>{1}</strong> and <strong>{2}</strong>, indicates that potentially, <strong>{3}</strong> degraded, <strong>{4}</strong> improved and <strong>{5}</strong> remained stable.",
  Performance:
    "The productivity performance of <strong>{0}</strong> between <strong>{1}</strong> and <strong>{2}</strong>, indicate that potentially, <strong>{3}</strong> degraded, <strong>{4}</strong>  remained stable.",
  forestchangesummary:
    "Between <strong>{0}</strong> and <strong>{1}</strong>, <strong>{2}</strong> experienced  <strong>{3}</strong> of <strong>{4} m<sup>2</sup></strong>  forest.",
  forestchangesummaryalt:
    "In <strong>{0}</strong>  <strong>{1}</strong> experience a forest loss of <strong>{2}</strong> m<sup>2</sup></strong>",
  land_degradation:
    "The land degradation  for <strong>{0}</strong> between <strong>{1}</strong> and <strong>{2}</strong>, indicate that potentially, <strong>{3}</strong> degraded, <strong>{4}</strong> improved and <strong>{5}</strong> remained stable. ",
  land_productivity:
    "The land productivity  for <strong>{0}</strong> between <strong>{1}</strong> and <strong>{2}</strong>, indicate that potentially, <strong>{3}</strong> degraded, <strong>{4}</strong> improved and <strong>{5}</strong> remained stable.",
  veg_loss_gain:
    "Between <strong>{1}</strong> and <strong>{2}</strong>, <strong>{4}</strong>  of <strong>{0}</strong>  experienced vegetation gain, <strong>{3}</strong> vegetation loss, and <strong>{5}</strong>  remained stable.",
 
 Medalus:"The {0} for {1} in {2}, indicate that potentially, {3} Improved ,{4} Degraded and {5} remained stable.",
 ForestFire:"After the fire that took place between {0} and {1}, in {2}, {3} show Enhanced Regrowth, {4} Unburned, {5} Low Severity, {6} Moderate Severity and {7} High severity.",
    Summary_alternative: {
    no_data: "No data for the selected region ({0})",
    no_change: "There was no change ({0})",
    selected_area: "Area selected",
    No_data_values: "No data values"
  },
  //end of summary translation

  lossgain: {
    loss: "a net loss",
    gain: "a net gain",
    stability: " stability "
  },
  sdgSelections: {
    options0: {
      Productivity_: "Productivity",
      LULC: "LULC",
      carbon_stock: "Carbon Stock Change",
      land_degradation: "Land degradation"
    }
  },
  secondOptions: {
    Productivity: {
      land_productivity: "Land Productivity",
      land_productivity_change: "Land Productivity",
      trajectory: "Trajectory",
      State: "State",
      Performance: "Performance"
    },
    LULC: {
      Land_Cover: "Land Cover",
      Land_Cover_Change: "Land Cover Change"
    },
    CarbonStock: {
      Carbon_stock: "Carbon stock",
      Carbon_Stock_Change: "Carbon Stock Change"
    },
    LandDegradation: {
      Land_degradation: "Land degradation",
      Land_degradation_Change: "Land degradation Change"
    }
  },
  forest_fire: {
    prefire_range: "Prefire Range",
    postfire_range: "Postfire Range"
  },
  admin_page: {
    registered_users: "Registered Users",
    select_file: "File",
    select_file_type: "Type",
    year: "Year",
    select_geojson: "Paste valid geojson",

    select_file_options: {
      LULC: "LULC",
      SOC: "SOC",
      NDVI: "NDVI",
      Rainfall: "Rainfall",
      "Ecological Units": "Ecological Units"
    },

    shapefile_tables: "Uploaded Shape files",
    soc_refs: "SOC Reference Years",
    eco_refs: "Eco Reference Years",
    uploader: "Select",
    registered_users_table: {
      name: "Name",
      email: "Email",
      institution: "Institution",
      title: "Title",
      profession: "Profession",
      isActive: "isActive",
      edit: "Edit"
    },
    custom_shapefile_tables: {
      name: "Name",
      email: "Email",
      uploadDate: "Uploaded Date",
      isActive: "Active",
      del: "Delete"
    },
    edit_user: "Edit User",
    edit_user_form: {
      email: "Email",
      first_name: "First Name",
      is_active: "Active",
      is_admin: "Admin",
      last_name: "Last Name",
      profile: "Profile",
      can_upload_custom_shapefile: "Can Upload  Shapefile",
      can_upload_standard_raster: "Can Upload Raster",
      institution: "Institution",
      profession: "Profession",
      title: "Title"
    }
  },
  legend: {
    Water: "Water",
    Bareland: "Bareland",
    Artificial: "Artificial",
    Wetland: "Wetland",
    Cropland: "Cropland",
    Grassland: "Grassland",
    Forest: "Forest",
    Stable: "Stable",
    Improvement: "Improvement",
    Degradation: "Degradation",
    "Potential Degradation": "Potential Degradation",
    "Potential Improvement": "Potential Improvement",
    "Not degraded": "Not degraded",
    Degraded: "Degraded",
    Gain: "Gain",
    Loss: "Loss",
    forest_loss: "Forest Loss",
    "Vegetation Loss": "Vegetation Loss",
    "Vegetation Gain": "Vegetation Gain",
    //forest fire legend data
    "Enhanced Regrowth": "Enhanced Regrowth",
    Unburned: "Unburned",
    "Low Severity": "Low Severity",
    "Moderate Severity": "Moderate Severity",
    "High Severity": "High Severity",
    //medalus
    "Hyper-arid": "Hyper-arid",
    Arid: "Arid",
    "Semi-arid": "Semi-arid",
    "Dry sub-humid": "Dry sub-humid",
    "Moist sub-humid": "Moist sub-humid",
    Humid: "Humid",
    "High Quality": "High Quality",
    "Moderate Quality": "Moderate Quality",
    "Low Quality": "Low Quality",
    High:"High",
    Low:"Low",
    Moderate:"Moderate",
    //ESAI
    Critical_C3:"Critical_C3",
    Critical_C2:"Critical_C2",
    Critical_C1:"Critical_C1",
    Fragile_F3:"Fragile_F3",
    Fragile_F2:"Fragile_F2",
    Fragile_F1:"Fragile_F1",
    Potential:"Potential",
    "Non affected":"Non affected",
  },
  legend_title: {
    "Land Productivity": "Land Productivity",
    Trajectory: "Trajectory",
    State: "State",
    Performance: "Performance",
    "Land Cover": "Land Cover",
    "Land Cover Change": "Land Cover Change",
    "Carbon stock": "Carbon stock",
    "Carbon Stock Change": "Carbon Stock Change",
    "Land degradation": "Land degradation",
    "Land degradation Change": "Land degradation Change",
    vegetation_condition: "Vegetation",
    "Forest Fire": "Forest Fire",
    //medalus legend titles
    ESAI: "ESAI",
    CQI: "Climate Quality Index",
    MQI:"Management Quality Index",
    VQI:"Vegetation Quality Index",
    SQI:"Soil Quality Index",
    
  },
  profile: {
    geojson_table_header: "My custom region Uploads",
    profile_details: "My Details",
    upload_section: "Uploads",
    edit_details: "Edit Details",
    edit_button: "Edit Profile",
    edit_form: {
      confirm_change: "You need to confirm the details filled",
      confirm_check_box: "I have confirmed My details"
    }
  },
  forest_change: "Forest change",
  forest_loss: "Forest Loss",
  large_area_error_message:
    "The area selected is too large to compute , kindly select an area less than {0} ha or a sub-region.",
  Login_msg_Results: "Please log in to view the Results",
  user_feedback_pointer:
    "Please remember to be as descriptive as possible, you can drag or paste images too",
  guide_link: "Documentation",
  indexPage: {
    training_video: "Project Training Video",
    index_title: "MISLAND North Africa",
    index_title_subtitle:
      "Monitoring Integrated Service for Land Degradation, click",
    index_title_subtitle_documentation: "for documentation",
    index_land_degradation_indicators: "Land Degradation Indicators",
    index_land_degradation_indicators_subtitle:
      "Click the tree below to see the indicators and sub indicators monitored using this tool",
    feedback_and_help: "Feedback and Help",
    feedback_and_help_subsitle:
      "For any feedbacks please go to the feedback section here",
    here: "here",
    frequently_asked_questions: "Frequently asked Questions"
  }
};
