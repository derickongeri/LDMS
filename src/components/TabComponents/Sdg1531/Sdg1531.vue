<template>
  <div>
    <div class="row">
      <div
        :style="
          selection.selection0 !== `LULC` ? `margin-top:3px` : `margin-top:0px`
        "
        class="col-xs-7"
      >
        <div class="row">
          <SDGs
            :cloned_Result="clonedResult"
            @sdgselection="sdgselection($event)"
          />
          <div v-if="show_year">
            <YearSelection
              @yearselection="yearselection($event)"
              :years2="years2"
              :default_year="selection.default_year"
              :empy_years="clears_years"
              :rasterType="raster_Type"
              :width="100"
              :result_years="years"
            />
          </div>
        </div>
      </div>
      <div class="col-xs-5">
        <Icons
          @downloadcsv="downloadcsv($event)"
          @download_chart="download_chart($event)"
          @get_cached_results="get_cached_results"
          class=" float-right "
        >
          <q-btn
            v-if="
              `Land Productivity,Carbon Stock Change,Performance,Land degradation,State,Trajectory`.includes(
                selection.selection1
              )
            "
            round
            size="xs"
            icon="fas fa-cog"
            color="green"
          >
            <q-tooltip>More Options</q-tooltip>
            <q-menu :offset="[190, 20]">
              <div class="row q-pa-sm" style="width: 290px">
                <div
                  class="col-md-6 q-pa-xs"
                  v-if="
                    `Land Productivity,Performance,Land degradation`.includes(
                      selection.selection1
                    )
                  "
                >
                  <q-select
                    @input="onEcoRefselection"
                    label="Ref Eco Units"
                    rounded
                    outlined
                    v-model="reference_eco_units"
                    :options="Eco_RefOptions"
                    dense
                    options-dense
                  />
                  <q-tooltip>reference_eco_units</q-tooltip>
                </div>
                <div
                  class="col-md-6 q-pa-xs"
                  v-if="
                    `Land Productivity,Carbon Stock Change,Land degradation`.includes(
                      selection.selection1
                    )
                  "
                >
                  <q-select
                    @input="onSocRefselection"
                    label="Reference SOC"
                    rounded
                    outlined
                    v-model="soc_refselection"
                    :options="Soc_RefOptions"
                    dense
                    options-dense
                  />
                </div>
                <div
                  class="col  q-pa-xs"
                  v-if="
                    `Productivity,Land degradation`.includes(
                      selection.selection0
                    )
                  "
                >
                  <q-select
                    @input="onVegIndexSelection"
                    label="Veg Indices"
                    rounded
                    outlined
                    v-model="veg_index"
                    :options="veg_index_Options"
                    dense
                    options-dense
                  />
                  <q-tooltip>Vegetation Indices</q-tooltip>
                </div>
              </div>
            </q-menu>
          </q-btn>
        </Icons>
      </div>
    </div>
    <div class="row ">
      <!-- {{ rasterTypes }} -->
      <div class="col-xs-12 col-md-12 q-mt-sm" v-if="showsummary">
        <PieChart
          :piedata="piedata"
          :chart-id="`mycanvas`"
          :height="250"
          :width="350"
          :style="`background-color: #66b2b2;width:100%`"
        />
      </div>
      <div class="col-xs-12 col-md-12">
        <Summary :show="showsummary">
          <div
            v-if="
              (selection.selection1 === `Land Cover` &&
                Object.keys(PieData).length > 0 &&
                Object.keys(selection).includes('year')) ||
                (Object.keys(selection).includes('default_year') &&
                  Object.keys(PieData).length > 0)
            "
          >
            <p
              v-html="
                $t('landcover', [
                  `${selection.year.start_year}`,
                  `${area_selected}`,

                  `${(PieData.data[6] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[6])})`,
                  `${(PieData.data[5] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}  ha (${checkSummaryPercentage(PieData.data[5])})`,
                  `${(PieData.data[3] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[3])})`,
                  `${(PieData.data[1] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[1])})`,
                  `${(PieData.data[2] / 10000).toFixed(
                    2
                  )} ha (${checkSummaryPercentage(PieData.data[2])})`,
                  `${(PieData.data[4] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[4])})`
                ])
              "
            ></p>
          </div>
          <div
            v-if="
              selection.selection1 === `Carbon Stock` &&
                Object.keys(PieData).length > 0 &&
                Object.keys(selection).includes('year')
            "
          >
            The carbon stock change for
            <strong>{{ area_selected }}</strong>
            between
            <strong>{{ selection.year.start_year }}</strong>
            and
            <strong>{{ selection.year.end_year }}</strong>
            , indicate that potentially, {degraded area} degraded, {Improvement}
            improved and {Stable} remained stable.
          </div>

          <div
            v-if="
              selection.selection1 === `Land Cover Change` &&
                Object.keys(selection).includes('year')
            "
          >
            <p
              v-html="
                $t('Land_Cover_Change', [
                  `${area_selected}`,
                  `${selection.year.start_year}`,
                  `${selection.year.end_year}`,
                  `${(PieData.data[2] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[2])})`,
                  `${(PieData.data[1] / 10000).toFixed(
                    2
                  )} ha (${checkSummaryPercentage(PieData.data[1])})`,
                  `${(PieData.data[0] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[0])})`
                ])
              "
            ></p>
          </div>
          <div
            v-if="
              selection.selection1 === `Carbon Stock Change` &&
                Object.keys(selection).includes('year')
            "
          >
            <p
              v-html="
                $t('Carbon_Stock_Change', [
                  `${area_selected}`,
                  `${selection.year.start_year}`,
                  `${selection.year.end_year}`,
                  `${(PieData.data[2] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[2])})`,
                  `${(PieData.data[1] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[1])})`,
                  `${(PieData.data[0] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[0])})`
                ])
              "
            ></p>
          </div>
          <div
            v-if="
              selection.selection1 === `Trajectory` &&
                Object.keys(selection).includes('year')
            "
          >
            <p
              v-html="
                $t('Trajectory', [
                  `${area_selected}`,
                  `${selection.year.start_year}`,
                  `${selection.year.end_year}`,
                  `${(PieData.data[2] / 10000).toFixed(
                    2
                  )} ha (${checkSummaryPercentage(PieData.data[2])})`,
                  `${(PieData.data[1] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[1])})`,
                  `${(PieData.data[0] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[0])})`
                ])
              "
            ></p>
          </div>
          <div
            v-if="
              selection.selection1 === `Land degradation` &&
                Object.keys(selection).includes('year')
            "
          >
            <p
              v-html="
                $t('land_degradation', [
                  `${area_selected}`,
                  `${selection.year.start_year}`,
                  `${selection.year.end_year}`,
                  `${(PieData.data[2] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[2])})`,
                  `${(PieData.data[1] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[1])})`,
                  `${(PieData.data[0] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[0])})`
                ])
              "
            ></p>
          </div>
          <div
            v-if="
              selection.selection1 === `Land Productivity` &&
                Object.keys(selection).includes('year')
            "
          >
            <p
              v-html="
                $t('land_productivity', [
                  `${area_selected}`,
                  `${selection.year.start_year}`,
                  `${selection.year.end_year}`,
                  `${(PieData.data[2] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[2])})`,
                  `${(PieData.data[1] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[1])})`,
                  `${(PieData.data[0] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[0])})`
                ])
              "
            ></p>
          </div>
          <div
            v-if="
              selection.selection1 === `State` &&
                Object.keys(selection).includes('year')
            "
          >
            <p
              v-html="
                $t('State', [
                  `${area_selected}`,
                  `${selection.year.start_year}`,
                  `${selection.year.end_year}`,
                  `${(PieData.data[2] / 10000).toFixed(
                    2
                  )} ha (${checkSummaryPercentage(PieData.data[2])})`,
                  `${(PieData.data[1] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[1])})`,
                  `${(PieData.data[0] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[0])})`
                ])
              "
            ></p>
          </div>
          <div
            v-if="
              selection.selection1 === `Performance` &&
                Object.keys(selection).includes('year')
            "
          >
            <p
              v-html="
                $t('Performance', [
                  `${area_selected}`,
                  `${selection.year.start_year}`,
                  `${selection.year.end_year}`,

                  `${(PieData.data[1] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[1])})`,
                  `${(PieData.data[0] / 10000).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} ha (${checkSummaryPercentage(PieData.data[0])})`
                ])
              "
            ></p>
          </div>
          <!-- <p v-if="nodata">
            {{ $t("Summary_alternative.No_data_values") }} :{{ nodata }}
          </p> -->
        </Summary>
        <LargeAreaDialog
          :show_dialog="show_dialog"
          @cancel_request="cancel_request($event)"
          @queue_request="queue_request($event)"
        />
        <div v-if="!showsummary">
          Change year or region to get Analysis
        </div>
        <WaitForShapeFile :show="persistent" />
      </div>
    </div>
  </div>
</template>

<script>
import { RequestStats } from "src/Services/RequestAnalysis.js";
import {
  LulcPieChart,
  LulcChangePieChart
} from "src/Calculations/LULC_Calculation";
import {
  LulcFormatter,
  Lulc_changeFormatter
} from "src/RasterDataForrmatters/LULC_RasterFormatter";
import { selection_url } from "src/SDG_Selection/SDGselection";

import LoadRaster from "src/Mixins/RenderRaster";
import ReferenceRasters from "src/Mixins/ReferenceRasters";
import { positive, negative } from "src/Services/Notifications";
import checkArea from "src/Mixins/CalculateArea";
import GoogleAnalytics from "src/Mixins/GoogleAnalytics";
//testing
export default {
  mixins: [LoadRaster, ReferenceRasters, checkArea, GoogleAnalytics],
  props: {
    currentTab: {
      type: String
    }
  },
  data() {
    return {
      persistent: false,
      empty_years: false,
      dismissed: null, //holds function for notification and toast
      filename: null, //holds filename for csv
      rasterType: null,
      show: false, //hide or show year selection
      selection: {}, // holds selected items
      PieData: {}, //below holds data for the charts
      geometry_loaded: false, //checks if shapefile is loaded
      years: {}, //object to hold selected years
      sum: null, //hods addition of total area for stats  data
      showsummary: false, //hode or show summary
      nodata: null, //get nodata values in land degradation and productivity
      details: {}, //holds details for the selected analysis
      copiedResults: null /// holds result from queued process
    };
  },
  components: {
    PieChart: require("../../Charts/PieChart").default,
    Icons: require("../../CommonTabItems/Icons.vue").default,
    SDGs: require("./SDGs").default,
    YearSelection: require("../../CommonTabItems/YearSelection").default,
    Summary: require("../../CommonTabItems/Summary").default,
    LargeAreaDialog: require("../../Dialogs/LargeAreaDialog").default,
    WaitForShapeFile: require("src/components/Dialogs/WaitForShapeFile").default
  },
  watch: {
    current_geojson: function(val, oldval) {
      //checks changes in the store geometry data
      this.$store.dispatch("Shapefiles/geometry_loaded", true);
      if (this.clonedResult) this.selection = this.clonedResult.args.selections;
      if (process.env.DEV)
        console.log(
          val,
          " current_geojson watch sdg1531 this.getEmailResultID ",
          this.getEmailResultID
        );
      if (this.getEmailResultID === null) {
        // if taskID is null proceeed as usual and request analysis
        if (process.env.DEV)
          console.log("current_geojson watch sdg1531  inside null id");
        return this.common();
      }
      this.FinalGeojsonLoaded(); //check if final geojson is loaded of results are available
    },
    getResults: function(val, oldval) {
      this.$Log("getResuts watch out ", val);
      if (val) {
        this.copiedResults = { ...val };
        // this.$store.dispatch("Results/setEmailTaskID", null);
        this.rasterType = this.getLULC[0];
        this.selection = { ...this.copiedResults.args.selections };
        this.years = this.selection.year;
        this.analize(val.result);
        this.persistent = true;
        this.$Log("getResuts watch  in ", this.selection.year);
      }
    },
    immediate: true
  },
  computed: {
    getLULC() {
      const raster = this.rasterTypes.filter(type => {
        return type.name === "LULC";
      });
      return raster;
    },
    getApiSettigs() {
      return this.$store.getters["ApiSettings/GetApiSettings"];
    },
    getLoggedIn() {
      // check if user is logged in or not
      return this.$store.getters["auth/loggedin"];
    },
    years2() {
      //returns boolean value whether we show two or one year selection
      return this.selection.years2;
    },
    clonedResult() {
      //checks the queued task results, we copy it locally since we will clear the store after losding results
      return this.copiedResults;
    },
    getEmailResultID() {
      //checks if we have taskid in store
      const EmailedTaskID = this.$store.getters["Results/getEmailTaskID"];
      return EmailedTaskID;
    },
    getResults() {
      // checks results from queued tasks
      let results = this.$store.getters["Results/getResults"];
      return results;
    },
    clears_years() {
      //checks if we should clear year input fields
      return this.empty_years;
    },
    show_year() {
      //checks if we show year selection component or not
      return this.show;
    },
    area_selected() {
      //gets the message to show where specific area or custom polygon summary area message
      if (this.current_geojson) {
        this.$Log("area_selected :", this.current_geojson);
        return (
          this.current_geojson.name ||
          this.$t("Summary_alternative.selected_area")
        );
      }
    },
    raster_Type() {
      //holds currently selected rastetype according to data selection
      return this.rasterType;
    },
    rasterTypes: function() {
      // get rastertypes from store
      let rastertype = this.$store.getters["RasterTypes/getRasterTypes"];
      return rastertype;
    },
    piedata: function() {
      //get chart data after analysis
      if (this.PieData) {
        this.$Log("LULC this.PieData ", this.PieData);
        return this.PieData;
      }
    },
    get_admin0() {
      // get country geojson data
      return this.$store.getters["Shapefiles/getgeojson0"];
    },
    current_geojson() {
      let current = this.$store.getters["Shapefiles/getcurrentGeoJson"];

      if (Object.keys(current).length > 1) {
        this.$Log(" current_geojson  computed", current);
        return current;
      }
      // return {error:"not loaded"}
    },
    get_year() {
      //check if years is one or two
      this.$Log(
        this.years,
        " Year get_year",
        this.selection,
        "this.getResults ",
        this.getResults
      );
      let year;
      if (
        this.selection.hasOwnProperty("year") &&
        Object.keys(this.selection.year).length > 0
      ) {
        year = !this.selection.years2
          ? this.years.start_year
          : `${this.years.start_year}-${this.years.end_year}`;
        this.$Log("Year computed 1", year, "this.years ", this.years);
        return year;
      }
    }
  },
  methods: {
    get_cached_results(val) {
      this.selection.cached = val;
      if(process.env.DEV)console.log("get_cached_results ", val);
       this.common();
    },
    FinalGeojsonLoaded() {
      if (this.clonedResult) {
        const picked = Object.values(
          (({ admin0, admin1, admin2 }) => ({ admin0, admin1, admin2 }))(
            this.clonedResult.args
          )
        )
          .filter(id => {
            return id;
          })
          .pop();
        if (process.env.DEV)
          console.log(
            "getAdminLevel watch FinalGeojsonLoaded ",
            this.current_geojson,
            " getResults ",
            picked
          );

        if (
          this.current_geojson.id === picked ||
          this.current_geojson.name === "OSS States"
        ) {
          this.$store.dispatch("Results/setEmailTaskID", null);
          this.$Log(" getEmailResultID after analysis", this.getEmailResultID);
          this.$store.dispatch("Results/clearResult");
          this.$router.push("/dashboard");
          this.persistent = false;
        }
      }
    },
    checkSummaryPercentage(value) {
      //aids in summary percentage display
      let percentage = (value / this.sum) * 100;
      // this.$Log("checksummaryPercentage ", percentage);
      let statement = "";
      if (percentage === NaN) {
        this.$Log("checksummaryPercentage  NaN ", percentage);
        return 0;
      }
      if (percentage && percentage > 0 && percentage < 1) {
        statement = this.$t("lessthan");
        this.$Log("checksummaryPercentage  lessthan ", percentage);
        return statement;
      }
      if (percentage === 0 || percentage > 1) {
        statement = `${percentage.toFixed(0)}%`;
        this.$Log("checksummaryPercentage  0 ", percentage);
        return statement;
      }
    },
    async sdgselection(selection) {
      // receives selection from sdg and ldh components
      this.$Log(" EMPTY YEARS SELECTION 523 ", selection);
      if (selection.empty_years === true) {
        this.empty_years = true;
        this.$Log("EMPTY YEARS SELECTION 525 ", this.empty_years);
        return;
      }
      this.$Log("EMPTY YEARS SELECTION  proceeded");
      if (Object.keys(selection).length > 0) {
        this.selection = { ...selection };
        if (selection.show === false) {
          this.show = false;
          return;
        }
        this.show = true; //show year selector
      }

      if (this.selection.hasOwnProperty("LDH")) {
        this.details = await selection_url(this.rasterTypes, this.selection);
        if (this.details.type.length > 0) {
          this.rasterType = this.details.type[0];
          this.empty_years = false;
        }
      }
    },
    async yearselection(year) {
      if (this.getEmailResultID) {
        // if we have an task ID in memory return since User is viewing results
        return;
      }
      if (year.start_year) {
        //only proceed if start year is valid
        this.selection.year = { ...year };
        this.$Log(year, "yearselection ==== 1222", this.selection);
        return this.common();
      }
    },
    async analize(stats) {
      //processes results from api
      // this.$Log("In Analize :", stats);
      this.$Log("in analysis  625", stats);
      this.nodata = null;
      if (stats.hasOwnProperty("nodata")) {
        this.$Log("analize stats ", stats);
        this.nodata = stats.nodata; //no data though not currently displayed
      }
      if (stats.hasOwnProperty("extras") && stats.extras.rasters) {
        this.$store.dispatch("RasterTypes/setExtras", stats.extras);
      } else {
        this.$store.dispatch("RasterTypes/setExtras", null);
      }
      this.showsummary = false; //disable summary show
      this.filename = `${this.$t(
        `legend_title.${this.selection.selection1}`
      )}-${this.get_year}.csv`;
      if (!stats.stats.hasOwnProperty("mapping")) {
        this.$Log("Ingine analize without mapping", stats);
        //for data with raster
        let raster = {};
        raster.rasterfile = stats.rasterfile;
        let { classification, colors } = Lulc_changeFormatter({
          stats,
          selection: this.selection
        }); //lulc change/ carbon stock
        if (this.selection.LDH) {
          raster.name =
            this.$t(`legend_title.vegetation_condition`) + ": " + this.get_year;
          this.filename = `${this.$t("legend_title.vegetation_condition")}-${
            this.get_year
          }.csv`;
        } else {
          raster.name =
            this.$t(`legend_title.${this.selection.selection1}`) +
            ": " +
            this.get_year;
        }
        this.load_raster(classification, colors, raster);
        this.PieData = LulcChangePieChart(stats, colors);
        this.sum = this.PieData.data.reduce((a, b) => a + b, 0);
        this.showsummary = true;
        return;
      }
      this.$Log(
        "Ingine analize with mapping",
        stats,
        "selection ",
        this.selection
      );
      let raster = {};
      raster.rasterfile = stats.rasterfile;
      let { classification, colors } = LulcFormatter({
        stats,
        selection: this.selection
      });
      raster.name =
        this.$t(`legend_title.${this.selection.selection1}`) +
        ": " +
        this.get_year;
      this.load_raster(classification, colors, raster);
      this.PieData = LulcPieChart(stats); //generate data for populating piechart
      this.sum = this.PieData.data.reduce((a, b) => a + b, 0);
      this.showsummary = true;
    },
    async common() {
      // creates the final request object
      try {
        this.details = await selection_url(this.rasterTypes, this.selection);

        if (!this.details.hasOwnProperty("type")) return;
        if (this.details.type.length > 0) {
          this.rasterType = this.details.type[0];
          this.empty_years = false;
        }
        this.$Log(
          "Selection in common 592 ",
          this.selection,
          "this.show_dialog  ",
          this.show_dialog,
          "this.current_geojson ",
          this.current_geojson
        );
        this.showsummary = false; //disables the summary component from being shown
        let requestData = {};
        requestData.cached = this.selection.cached===undefined? true:this.selection.cached;
        let details = this.details;
        //if we do not have raster type we return else assign raster type
        if (details.hasOwnProperty("type") && details.type.length > 0) {
          this.rasterType = details.type[0];
        } else {
          return;
        }
        if (this.selection.raster_source === "Landsat 7") {
          requestData.admin_0 = this.get_admin0[this.get_admin0.length - 1].id;
        }
        requestData.custom_coords = "";
        //check if we do not have geojson data we return
        if (
          !this.current_geojson ||
          this.current_geojson.hasOwnProperty("empty")
        ) {
          return;
        }

        //check if defined region from selection or a custom polygon draw
        if (this.current_geojson.hasOwnProperty("id")) {
          requestData.vector = this.current_geojson.id;
        } else {
          requestData.custom_coords = JSON.stringify(this.current_geojson);
          const within = this.check_if_within(); //checks if polygon is within a country due to raster data limitations
          this.$Log("within ", within);
          if (!within) return;
        }
        //check if we are passing the show change flag
        requestData.show_change = 0;
        //check if we have two start and end year
        if (
          this.selection.years2 === true &&
          this.selection.hasOwnProperty("year")
        ) {
          requestData.show_change = 1;
          requestData.start_year = this.selection.year.start_year;
          requestData.end_year = this.selection.year.end_year;
        } else {
          //if one year, pass start year
          if (this.selection.hasOwnProperty("year")) {
            requestData.start_year = this.selection.year.start_year;
          } else {
            requestData.start_year = this.selection.default_year;
          }
        }
        //get which raster_type we are using
        if (details) requestData.raster_type = details.type[0].id;
        //checks which shapefile level e.g country, region or subregion
        requestData.admin_level = this.current_geojson.level;
        //required by api
        requestData.transform = "area";
        //check if we need to pass vegetation index name to use
        if (this.veg_index) requestData.veg_index = this.veg_index;
        //check if ref eco unit is not null then we pass  the year
        if (this.reference_eco_units)
          requestData.reference_eco_units = this.reference_eco_units.value;
        //check if we need to pass soc year reference raster to use
        if (this.soc_refselection)
          requestData.reference_raster = this.soc_refselection.value;

        if (this.selection.hasOwnProperty("reference_raster")) {
          requestData.reference_raster = this.selection.reference_raster;
        }
        if (this.selection.raster_source) {
          requestData.raster_source = this.selection.raster_source;
        }
        this.years = this.selection.year; //extract the years and persist them for any analysis when shapefile changes

        requestData.selections = this.selection; //pass the selection to help with results from queued tasks
        requestData.currentTab = this.currentTab; //pass the tab to that we will know which tab to be in when task result needs to be displayed
       
        if (this.current_geojson.hasOwnProperty("area")) {
          const area = this.checkArea({
            current_geojson: this.current_geojson,
            raster_source: this.selection.raster_source,
            requestData
          });
          this.$Log("this.current_geojson.hasOwnProperty area", area);
          if (area.area > area.threshold) {
            this.show_dialog = true;
            this.area_too_big = true;
            if (!this.shedule_request) {
              return;
            }
          }
        }

        if (this.current_geojson.hasOwnProperty("id")) {
          const area = this.checkArea({
            current_geojson: this.current_geojson.geojson.geometry,
            raster_source: this.selection.raster_source,
            requestData
          });
          this.$Log("this.current_geojson.hasOwnProperty id", area);
          if (area.area > area.threshold) {
            this.show_dialog = true;
            this.area_too_big = true;
            if (!this.shedule_request) {
              return;
            }
          }
        }
        //used to programatically clear any user notifications
        if (this.dismissed && typeof this.dismissed === "function") {
          this.dismissed();
        }
        //ensure we disable dialog of true and we have passed the assrtion
        this.show_dialog = false;
        this.shedule_request = false;
        // we only make the request if we do have years passed and that we are not viewing any task results
        // we use the taskID since we clear it after results have loaded and  user changes or all the shapefiles have loaded
        if (
          requestData.start_year &&
          (this.getEmailResultID === null ||
            this.getEmailResultID === undefined)
        ) {
           if (process.env.DEV) console.log("Final request ", requestData);
          let stats = await RequestStats(`/api${details.url}`, requestData); //make request
          this.$Log("704 stats", stats);
          if (stats && stats.hasOwnProperty("stats")) {
            this.copiedResults = null;
            return this.analize(stats);
          }
          if (stats && stats.hasOwnProperty("message")) {
            return positive(stats.message, 0);
          }
        }
      } catch (error) {
        this.$Log("common function error ", error);
        throw error;
      }
    }
  },
  beforeDestroy() {
    // used to clear any notifications upon tab changes
    this.$Log("beforeDestroy dismissed", this.dismissed);
    if (this.dismissed && typeof this.dismissed === "function")
      this.dismissed();
  }
};
</script>

<style></style>
