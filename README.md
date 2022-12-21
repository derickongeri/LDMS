# oss-ldms-webapp

Frontend web application for OSS Land Degradation Monitoring Service (LDNS)

# Maps (maps)

 App to show rasta and tif files on maps

## Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```

## Prerequisites

1. Install node js (prefered latest stable version)
2. Install quasar Cli
```bash
npm install -g @quasar/cli
```

One can now clone the repository, install dependencies and run or build using the commands provided above

# Project structure

```📦src
 ┣ 📂assets
 ┃ ┣ 📂images
 ┃ ┃ ┣ 📜auweblogo-en.png
 ┃ ┃ ┣ 📜Flag-European-Union.jpg
 ┃ ┃ ┣ 📜gmes.png
 ┃ ┃ ┣ 📜li.png
 ┃ ┃ ┣ 📜Observertoire.png
 ┃ ┃ ┣ 📜rsz_1rsz_observertoire.png
 ┃ ┃ ┣ 📜rsz_observertoire.png
 ┃ ┃ ┗ 📜rsz_visuelmisland.png
 ┃ ┗ 📜quasar-logo-full.svg
 ┣ 📂boot
 ┃ ┣ 📜.gitkeep
 ┃ ┣ 📜auth_guards.js
 ┃ ┣ 📜axios.js
 ┃ ┣ 📜i18n.js
 ┃ ┗ 📜VueGtag.js
 ┣ 📂Calculations
 ┃ ┗ 📜LULC_Calculation.js
 ┣ 📂colors
 ┃ ┗ 📜colors.js
 ┣ 📂components
 ┃ ┣ 📂Admin
 ┃ ┃ ┣ 📂Lists
 ┃ ┃ ┃ ┣ 📜CustomRegions.vue
 ┃ ┃ ┃ ┣ 📜ECOUnitList.vue
 ┃ ┃ ┃ ┗ 📜SOCList.vue
 ┃ ┃ ┗ 📂Uploads
 ┃ ┃ ┃ ┗ 📜uploaders.vue
 ┃ ┣ 📂Charts
 ┃ ┃ ┣ 📜BarChart.vue
 ┃ ┃ ┣ 📜Doughnut.vue
 ┃ ┃ ┣ 📜linechart.vue
 ┃ ┃ ┗ 📜PieChart.vue
 ┃ ┣ 📂CommonTabItems
 ┃ ┃ ┣ 📜Icons.vue
 ┃ ┃ ┣ 📜Summary.vue
 ┃ ┃ ┗ 📜YearSelection.vue
 ┃ ┣ 📂Dialogs
 ┃ ┃ ┗ 📜LargeAreaDialog.vue
 ┃ ┣ 📂Forms
 ┃ ┃ ┗ 📜Edit_User_Details.vue
 ┃ ┣ 📂HomePageComponents
 ┃ ┃ ┣ 📜Accordion.vue
 ┃ ┃ ┗ 📜UserFeedback.vue
 ┃ ┣ 📂Legend
 ┃ ┃ ┗ 📜Legend.vue
 ┃ ┣ 📂TabComponents
 ┃ ┃ ┣ 📂ForestChange
 ┃ ┃ ┃ ┣ 📂ForestChangeCalculations
 ┃ ┃ ┃ ┃ ┗ 📜HansenAnalysis.js
 ┃ ┃ ┃ ┗ 📜ForestChange.vue
 ┃ ┃ ┣ 📂ForestFire
 ┃ ┃ ┃ ┣ 📜ForestFire.vue
 ┃ ┃ ┃ ┣ 📜ForestFireSelections.vue
 ┃ ┃ ┃ ┗ 📜ForestFireStats.js
 ┃ ┃ ┣ 📂LDH
 ┃ ┃ ┃ ┗ 📜LDH.vue
 ┃ ┃ ┣ 📂Medalus
 ┃ ┃ ┃ ┣ 📂Medaluscalculations
 ┃ ┃ ┃ ┃ ┗ 📜MedalusCalculations.js
 ┃ ┃ ┃ ┣ 📜IsdSelection.vue
 ┃ ┃ ┃ ┗ 📜Medalus.vue
 ┃ ┃ ┗ 📂Sdg1531
 ┃ ┃ ┃ ┣ 📜Sdg1531.vue
 ┃ ┃ ┃ ┗ 📜SDGs.vue
 ┃ ┣ 📜Select_Features.vue
 ┃ ┗ 📜Tabs.vue
 ┣ 📂css
 ┃ ┣ 📜app.sass
 ┃ ┗ 📜quasar.variables.sass
 ┣ 📂Download_Utils
 ┃ ┣ 📜Download_Chart.js
 ┃ ┗ 📜Download_CSV.js
 ┣ 📂Helpers
 ┃ ┣ 📂EventBus
 ┃ ┃ ┗ 📜eventBus.js
 ┃ ┣ 📂MapProviders
 ┃ ┃ ┗ 📜leaflet-providers.js
 ┃ ┗ 📂Markers_Icons
 ┃ ┃ ┗ 📜Marker.js
 ┣ 📂i18n
 ┃ ┣ 📂en-us
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📂fr
 ┃ ┃ ┗ 📜index.js
 ┃ ┗ 📜index.js
 ┣ 📂layouts
 ┃ ┗ 📜MainLayout.vue
 ┣ 📂Mixins
 ┃ ┣ 📜CalculateArea.vue
 ┃ ┣ 📜GoogleAnalytics.vue
 ┃ ┣ 📜ReferenceRasters.vue
 ┃ ┣ 📜RenderRaster.vue
 ┃ ┗ 📜UserRegData.vue
 ┣ 📂pages
 ┃ ┣ 📂Admin
 ┃ ┃ ┗ 📜Admin.vue
 ┃ ┣ 📂Authentication
 ┃ ┃ ┗ 📜Login.vue
 ┃ ┣ 📂Faq
 ┃ ┃ ┗ 📜Faq.vue
 ┃ ┣ 📂FeedBack
 ┃ ┃ ┗ 📜FeedBackPage.vue
 ┃ ┣ 📂Home
 ┃ ┃ ┗ 📜Index.vue
 ┃ ┣ 📂Map
 ┃ ┃ ┗ 📜Maps.vue
 ┃ ┣ 📂UserProfile
 ┃ ┃ ┗ 📜Profile.vue
 ┃ ┗ 📜Error404.vue
 ┣ 📂RasterDataForrmatters
 ┃ ┣ 📜LULC_RasterFormatter.js
 ┃ ┗ 📜RasterRenderer.js
 ┣ 📂router
 ┃ ┣ 📜index.js
 ┃ ┗ 📜routes.js
 ┣ 📂SDG_Selection
 ┃ ┗ 📜SDGselection.js
 ┣ 📂Services
 ┃ ┣ 📜Logger.js
 ┃ ┣ 📜Notifications.js
 ┃ ┗ 📜RequestAnalysis.js
 ┣ 📂store
 ┃ ┣ 📂ApiSettings
 ┃ ┃ ┣ 📜actions.js
 ┃ ┃ ┣ 📜getters.js
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┣ 📜mutations.js
 ┃ ┃ ┗ 📜state.js
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📜actions.js
 ┃ ┃ ┣ 📜getters.js
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┣ 📜mutations.js
 ┃ ┃ ┗ 📜state.js
 ┃ ┣ 📂carousel
 ┃ ┃ ┣ 📜actions.js
 ┃ ┃ ┣ 📜getters.js
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┣ 📜mutations.js
 ┃ ┃ ┗ 📜state.js
 ┃ ┣ 📂Faq
 ┃ ┃ ┣ 📜actions.js
 ┃ ┃ ┣ 📜getters.js
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┣ 📜mutations.js
 ┃ ┃ ┗ 📜state.js
 ┃ ┣ 📂geotiffs
 ┃ ┃ ┣ 📜actions.js
 ┃ ┃ ┣ 📜getters.js
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┣ 📜mutations.js
 ┃ ┃ ┗ 📜state.js
 ┃ ┣ 📂queuedResults
 ┃ ┃ ┣ 📜actions.js
 ┃ ┃ ┣ 📜getters.js
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┣ 📜mutations.js
 ┃ ┃ ┗ 📜state.js
 ┃ ┣ 📂RasterTypes
 ┃ ┃ ┣ 📜actions.js
 ┃ ┃ ┣ 📜getters.js
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┣ 📜mutations.js
 ┃ ┃ ┗ 📜state.js
 ┃ ┣ 📂shapefiles
 ┃ ┃ ┣ 📜actions.js
 ┃ ┃ ┣ 📜getters.js
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┣ 📜mutations.js
 ┃ ┃ ┗ 📜state.js
 ┃ ┣ 📂users
 ┃ ┃ ┣ 📜actions.js
 ┃ ┃ ┣ 📜getters.js
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┣ 📜mutations.js
 ┃ ┃ ┗ 📜state.js
 ┃ ┣ 📜index.js
 ┃ ┗ 📜store-flag.d.ts
 ┣ 📜App.vue
 ┗ 📜index.template.html
```