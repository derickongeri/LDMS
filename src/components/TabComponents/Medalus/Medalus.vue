<template>
  <div>
    <div class="q-pa-xs ">
      <div class="row">
        <div class="col-md-3">
          <IsdSelection
            @yearshow="yearshow($event)"
            @medalus_selection="medalus_selection($event)"
            :cloned_Result="copiedResults"
          />
        </div>
        <div v-if="show" class="col-md-3 q-mt-xs">
          <YearSelection
            @yearselection="yearselection($event)"
            :years2="years2"
            :default_year="default_year"
            :empty_years="clears_years"
            :rasterType="getRasterType[0]"
            :width="130"
            :result_years="Resultyears"
          />
        </div>
        <div class="col ">
          <div class=" q-mr-md  float-right">
            <Icons
              @downloadcsv="downloadcsv($event)"
              @download_chart="download_chart($event)"
              @get_cached_results="get_cached_results"
            />
          </div>
        </div>
      </div>
      <!-- {{current_geojson}} -->
    </div>
    <div class="row q-pa-xs">
      <div class="col-sm-12 " v-if="show_pie_chart">
        <PieChart
          :piedata="piedata"
          :chart-id="`mycanvas`"
          :height="250"
          :width="350"
          :style="`background-color: #66b2b2;width:100%`"
        />
      </div>
      <div class="col-xs-12 col-md-12" v-if="showsummary">
        <Summary :show="showsummary">
          <p
            v-html="
              $t('Medalus', [
                $t(`legend_title.${selection.selection1}`),
                `${area_selected}`,
                `${selection.year.start_year}`,

                `${(piedata.data[0] / 10000).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} ha (${checkSummaryPercentage(piedata.data[0])})`,

                `${(piedata.data[2] / 10000).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} ha (${checkSummaryPercentage(piedata.data[2])})`,

                `${(piedata.data[1] / 10000).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} ha (${checkSummaryPercentage(piedata.data[1])})`
              ])
            "
          ></p>
        </Summary>
      </div>
      <LargeAreaDialog
        :show_dialog="show_dialog"
        @cancel_request="cancel_request($event)"
        @queue_request="queue_request($event)"
      />
      <WaitForShapeFile :show="persistent" />
    </div>
  </div>
</template>
<script>
import GoogleAnalytics from "src/Mixins/GoogleAnalytics";
import checkArea from "src/Mixins/CalculateArea";
import { RequestStats } from "src/Services/RequestAnalysis.js";
import { positive, negative } from "src/Services/Notifications";
import * as Medalus from "./Medaluscalculations/MedalusCalculations";
import LoadRaster from "src/Mixins/RenderRaster";
export default {
  mixins: [GoogleAnalytics, checkArea, LoadRaster],
  props: {
    rasters: {
      type: Array
    },
    currentTab: {
      type: String
    }
  },
  components: {
    IsdSelection: require("./IsdSelection").default,
    Icons: require("../../CommonTabItems/Icons.vue").default,
    YearSelection: require("../../CommonTabItems/YearSelection").default,
    Summary: require("../../CommonTabItems/Summary").default,
    PieChart: require("../../Charts/PieChart").default,
    LargeAreaDialog: require("../../Dialogs/LargeAreaDialog").default,
    WaitForShapeFile: require("src/components/Dialogs/WaitForShapeFile").default
  },
  data() {
    return {
      persistent: false,
      show_pie_chart: false,
      empty_years: false,
      show: false, // used to disable dom elements
      selection: {}, //holds user selections
      selections: [],
      filename: null, //holds name for download file
      years: {}, //holds years selected
      showsummary: false, //used to show summary
      years2: false,
      url: null,
      default_year: null,
      PieData: null,
      copiedResults: null,
      Resultyears: {}
    };
  },
  mounted() {
    this.default_year = 2018;
  },
  watch: {
    current_geojson: function(val, oldval) {
      //checks changes in the store geometry data
      this.$store.dispatch("Shapefiles/geometry_loaded", true);
      this.$Log(
        val,
        " current_geojson watch sdg1531 this.getEmailResultID ",
        this.getEmailResultID
      );
      if (this.getEmailResultID === null) {
        // if taskID is null proceeed as usual and request analysis
        this.$Log("current_geojson watch medalus  inside null id");
        return this.common();
      }
      this.FinalGeojsonLoaded(); //check if final geojson is loaded of results are available
    },
    getResults: {
      immediate: true,
      handler(val, oldval) {
        this.$Log(this.show, " getResuts watch out medalus", val);
        if (val) {
          this.copiedResults = { ...val };
          // this.$store.dispatch("Results/setEmailTaskID", null);
          this.selection = this.copiedResults.args.selections;
          this.Resultyears = this.selection.year;
          this.show = true;
          this.persistent = true;
          this.analize(val.result);
          this.$Log("getResuts watch medalus ", this.selection);
        } else {
          this.empty_years = true;
        }
      },
      deep: true
    }
  },
  computed: {
    clonedResult() {
      //checks the queued task results, we copy it locally since we will clear the store after losding results
      return this.copiedResults;
    },
    getResults() {
      // checks results from queued tasks
      let results = this.$store.getters["Results/getResults"];
      return results;
    },
    piedata: function() {
      //get chart data after analysis
      if (this.PieData) {
        this.$Log("Medalus PieData ", this.PieData);
        return this.PieData;
      }
    },
    getEmailResultID() {
      //checks if we have taskid in store
      const EmailedTaskID = this.$store.getters["Results/getEmailTaskID"];
      return EmailedTaskID;
    },
    get_year() {
      return this.years.start_year;
    },
    getUrl() {
      return {
        CQI: "/api/climatequality/",
        SQI: "/api/soilquality/",
        MQI: "/api/managementquality/",
        VQI: "/api/vegetationquality/",
        ESAI: "/api/esai/"
      };
    },
    clears_years() {
      //checks if we should clear year input fields
      return this.empty_years;
    },
    current_geojson() {
      //get the current geojson data
      return this.$store.getters["Shapefiles/getcurrentGeoJson"];
    },
    rasterTypes: function() {
      // get rastertypes from store
      let rastertype = this.$store.getters["RasterTypes/getRasterTypes"];
      return rastertype;
    },
    getRasterType() {
      const raster = this.rasterTypes.filter(type => {
        return type.name === "Aspect";
        // return type.name === "LULC";
      });
      return raster;
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
    }
  },
  methods: {
    get_cached_results(val) {
      this.cached = val;
      if (process.env.DEV) console.log("get_cached_results ", val);
      this.common();
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
    medalus_selection(selection) {
      this.$Log("medalus _selection ", selection);
      this.show = true;
      if (selection.selection0)
        this.selection.selection0 = selection.selection0;
      this.empty_years = true;
      if (selection.hasOwnProperty("selection1")) {
        this.url = this.getUrl[selection.selection1];
        this.selection.selection1 = selection.selection1;
      } else {
        this.url = this.getUrl[selection.selection0];
        this.selection.selection1 = selection.selection0;
      }
      this.default_year = null;
      this.$Log("medalus this.selection ", this.selection);
    },
    yearselection(year) {
      //get year selected
      this.$Log("medalus  year before  ", year);
      if (year.start_year != null) {
        this.years = { ...year };
        this.selection.year = { ...year };
        this.selection.year.end_year = year.end_year;
        if (year.end_year === null) {
          this.selection.year.end_year = year.start_year;
        }
        this.$Log("medalus  year after  ", this.selection.year);
        this.common();
      }
      this.$Log("medalus  year  ", year);
    },
    yearshow(show) {
      this.show = show;
    },
    async common() {
      this.filename = `${this.$t(
        `legend_title.${this.selection.selection1}`
      )}-${this.get_year}.csv`; //assign filename
      this.showsummary = false;
      this.empty_years = false;
      let requestData = {};
      requestData.cached = this.cached === undefined ? true : this.cached;
      requestData.transform = "area";
      requestData.show_change = 1;
      if (this.current_geojson.hasOwnProperty("empty")) return;
      if (this.current_geojson.hasOwnProperty("id")) {
        requestData.admin_level = this.current_geojson.level;
        requestData.vector = this.current_geojson.id;
      } else {
        requestData.custom_coords = JSON.stringify(this.current_geojson);
      }
      requestData.raster_type = this.getRasterType[0].id;
      requestData.start_year = this.years.start_year;
      requestData.end_year = this.years.end_year;
      if (requestData.end_year === null) {
        requestData.end_year = this.years.start_year;
      }
      requestData.selections = this.selection;
      requestData.currentTab = this.currentTab;

      if (this.current_geojson.hasOwnProperty("area")) {
        const area = this.checkArea({ current_geojson: this.current_geojson });
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
          current_geojson: this.current_geojson.geojson.geometry
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
      this.show_dialog = false;
      this.shedule_request = false;
      this.$Log(
        "years ",
        this.years,
        "Request common Data medalus",
        requestData,
        "this.getResults ",
        this.getResults
      );
      let stats = null;
      if (requestData.start_year && !this.getResults) {
        stats = await RequestStats(this.url, requestData);
      }
      if(process.env.DEV)console.log("response stats forest ", stats);

      if (stats && stats.hasOwnProperty("stats")) {
        this.copiedResults = null;
        return this.analize(stats);
      }
      if (stats && stats.hasOwnProperty("message"))
        return positive(stats.message, 0);
    },
    analize(stats) {
      // this.$Log("medalus  analize ", stats);
      let raster = {};
      raster.rasterfile = stats.rasterfile;
      raster.name =
        this.$t(`legend_title.${this.selection.selection1}`) +
        ": " +
        (this.get_year || this.Resultyears.start_year);

      let analized_data = null;

      if (this.selection.selection1 === "CQI") {
        analized_data = Medalus.CQICalculations(stats);
      }
      if (this.selection.selection1 === "VQI") {
        analized_data = Medalus.CQICalculations(stats);
      }
      if (this.selection.selection1 === "SQI") {
        analized_data = Medalus.CQICalculations(stats);
      }
      if (this.selection.selection1 === "MQI") {
        analized_data = Medalus.CQICalculations(stats);
      }
      if (this.selection.selection1 === "ESAI") {
        analized_data = Medalus.ESAICalculations(stats);
      }
      let { classification, colors, chart_data } = analized_data;
      console.log("medalus data 419 ", analized_data);
      this.PieData = chart_data;
      this.show_pie_chart = true;
      this.load_raster(classification, colors, raster);
      this.sum = this.PieData.data.reduce((a, b) => a + b, 0);
      this.showsummary = true;
    },
    FinalGeojsonLoaded() {
      this.$Log("FinalGeojsonLoaded ", this.clonedResult);
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
        this.$Log(
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
    }
  }
};
</script>
