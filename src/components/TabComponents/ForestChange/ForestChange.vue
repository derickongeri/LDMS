<template>
  <div>
    <div class="row q-ml-sm">
      <div class="col-md-3">
        <q-select
          @input="selectSource"
          rounded
          outlined
          dense
          options-dense
          v-model="source"
          :options="forest_raster_sources"
          label="Source"
        />
      </div>
      <div class="row q-mr-md">
        <div class="col" v-if="show_years">
          <!-- {{getResults}} -->
          <YearSelection
            @yearselection="yearselection($event)"
            :years2="two_years"
            :yearOnly="true"
            :change_years="default_years"
            :rasterType="rasterTypes[0]"
            :empty_years="clears_years"
            :hansen_year="hansen_year"
            :width="100"
            :result_years="resultYears"
          />
        </div>
      </div>

      <div class="absolute-right q-mr-md">
        <Icons
          @downloadcsv="downloadcsv($event)"
          @download_chart="download_chart($event)"
          :show_download="show_download"
          @get_cached_results="get_cached_results"
        />
      </div>
    </div>
    <div class="row q-pa-sm">
      <div
        class="col-xs-12 col-md-12"
        v-if="
          Object.keys(ChartData).length > 0 &&
            ChartData.datasets[0].data.length > 0 &&
            !inValidData &&
            showsummary
        "
      >
        <div class="row">
          <div
            v-if="loss"
            class="loss"
            style="margin-left: 80px; margin-top: 5px"
          ></div>
          <div v-if="loss" class="col">Forest Loss</div>
          <div v-if="gain" class="gain" style="margin-top: 5px"></div>
          <div v-if="gain" class="col">Forest Gain</div>
        </div>
        <BarChart
          :BarData="ChartData"
          :chart-id="`myBarCanvas`"
          :height="250"
          :width="250"
        />
      </div>

      <div class="col-xs-12 col-md-12">
        <Summary :show="showsummary">
          <div
            v-if="
              Object.keys(forestchangedata).length > 0 && loss_gain.length > 0
            "
          >
            <p
              v-if="!inValidData"
              v-html="
                $t('forestchangesummary', [
                  `${loss_gain[0].year}`,
                  `${loss_gain[loss_gain.length - 1].year}`,
                  `${this.current_geojson.name}`,
                  `${lossgain()}`,
                  `${Math.abs(computeSummary()).toLocaleString()}`
                ])
              "
            ></p>
            <p
              v-if="inValidData"
              v-html="$t('Summary_alternative.no_change', [`${area_selected}`])"
            ></p>
          </div>
          <div v-else>
            <p
              v-if="inValidData"
              v-html="$t('Summary_alternative.no_data', [`${area_selected}`])"
            ></p>
          </div>
          <p
            v-if="hansen"
            v-html="$t('forestchangesummaryalt', hansen_summary)"
          ></p>
          <p
            v-if="no_data_hansen"
            v-html="$t('Summary_alternative.no_data', [`${area_selected}`])"
          >
            forestchangesummaryalt
          </p>
        </Summary>
        <LargeAreaDialog
          :show_dialog="show_dialog"
          @cancel_request="cancel_request($event)"
          @queue_request="queue_request($event)"
        />
        <div v-if="!showsummary">
          Change year or region to get Analysis
        </div>
      </div>
    </div>
    <WaitForShapeFile :show="persistent" />
  </div>
</template>
<script>
import { RequestStats } from "src/Services/RequestAnalysis.js";
import { downloadCSV } from "src/Download_Utils/Download_CSV";
import { download_chart } from "src/Download_Utils/Download_Chart";
import { Log } from "src/Services/Logger";
import LoadRaster from "src/Mixins/RenderRaster";
import Analize_Hansen from "./ForestChangeCalculations/HansenAnalysis";
import { positive, negative } from "src/Services/Notifications";
import checkArea from "src/Mixins/CalculateArea";
import GoogleAnalytics from "src/Mixins/GoogleAnalytics";
export default {
  mixins: [LoadRaster, checkArea, GoogleAnalytics],
  props: {
    currentTab: {
      type: String
    }
  },
  components: {
    Icons: require("../../CommonTabItems/Icons.vue").default,
    YearSelection: require("../../CommonTabItems/YearSelection").default,
    Summary: require("../../CommonTabItems/Summary").default,
    BarChart: require("../../Charts/BarChart").default,
    LargeAreaDialog: require("../../Dialogs/LargeAreaDialog").default,
    WaitForShapeFile: require("src/components/Dialogs/WaitForShapeFile").default
  },
  data() {
    return {
      persistent: false,
      show_download: true,
      empty_years: false,
      source: null,
      show_years: false,
      hansen: false,
      no_data_hansen: false,
      hansen_year: false,
      hansen_summary: [],
      forest_raster_sources: [
        // { label: "LULC", value: "LULC" },
        { label: "Hansen", value: "Hansen" }
      ],
      raster_loss_gain: null,
      Loss_gain_rasters: [
        { label: "Loss", value: "Loss" },
        { label: "Gain", value: "Gain" }
      ],
      ///
      showsummary: false,
      chart: false, //whether to show chart or not
      forestchangedata: {}, //stores forestchange data stats
      years: {
        // stores year
        start_year: null,
        end_year: null
      },
      loss: false, //check if loss
      gain: false, //check if gain
      loss_gain: [], // holds the data received from api for
      nodata: null,
      //clone the result object
      copiedResults: null /// holds result from queued process
    };
  },

  computed: {
    resultYears() {
      if (this.clonedResult) {
        return {
          start_year: this.clonedResult.args.start_year,
          end_year: this.clonedResult.args.end_year
        };
      }
    },
    clears_years() {
      return this.empty_years;
    },
    two_years() {
      this.$Log("source two_years ===", this.source);
      if (this.source && this.source.value === "Hansen") {
        this.hansen_year = true;
        return false;
      }
      this.hansen_year = false;
      return true;
    },
    area_selected() {
      return (
        this.current_geojson.name ||
        this.$t("Summary_alternative.selected_area")
      );
    },
    current_geojson() {
      return this.$store.getters["Shapefiles/getcurrentGeoJson"];
    },
    default_years() {
      this.$Log("this.source default_years ", this.source);
      //gets first and last raster and extract years
      if (this.getEmailResultID === null && this.getDefaultYears) {
        this.$Log(
          "clonedResult in default_years  nullness ",
          this.getEmailResultID
        );
        if (
          (this.source && this.source.value === "LULC") ||
          this.source === "LULC"
        ) {
          let year = this.$store.getters["Geotiffs/getRasterList"].filter(
            year => {
              return year.raster_type === this.rasterTypes[0].id;
            }
          );

          let startyear =
            this.current_geojson.level === -1
              ? year[year.length - 2].raster_year
              : year[0].raster_year;
          let endyear = year[10].raster_year;

          // this.years.start_year = startyear;
          // this.years.end_year = endyear;

          return {
            startyear,
            endyear
          };
        }
      }
      if (this.getEmailResultID !== null) {
        //get result years and check if hansel or LULC data
        this.$Log("clonedResult in default_years ", this.clonedResult);
        if (this.source === "LULC" || this.source.value === "LULC") {
          this.years.start_year = this.clonedResult.args.start_year;
          this.years.end_year = this.clonedResult.args.end_year;
          return {
            startyear: this.clonedResult.args.start_year,
            endyear: this.clonedResult.args.end_year
          };
        } else {
          this.$Log("Hansel else ", this.clonedResult);
          this.years.start_year = this.clonedResult.args.start_year;
          this.years.end_year = this.clonedResult.args.end_year;
          return {
            startyear: this.clonedResult.args.start_year
          };
        }
      }
    },
    ChartData: function() {
      this.$Log(" Object.keys(ChartData).length ", this.forestchangedata);
      return this.forestchangedata;
    },
    show_chart: function() {
      if (Object.keys(this.forestchangedata).length > 0) {
        return true;
      }
      return false;
    },
    inValidData() {
      let max, min;
      if (Object.keys(this.ChartData).length > 0) {
        max = Math.max(...this.ChartData.datasets[0].data);
        min = Math.min(...this.ChartData.datasets[0].data);
        Log(" validdata chartdata max ", max, "min ", min);
        if (this.ChartData.datasets[0].data.length === 0) {
          return true;
        }

        if (max == 0 && min == 0) {
          return true;
        }
        if (!isFinite(max) || !isFinite(min)) {
          return true;
        }
        return false;
      }
    },
    rasterTypes: function() {
      let rastertype = this.$store.getters["RasterTypes/getRasterTypes"];
      let type = rastertype.filter(type => {
        if (type.name === "LULC") {
          // Log("found raster forest change ", type);
          return type;
        }
      });
      return type;
    },
    rasterTypeSources: function() {
      let rastertype = this.$store.getters["RasterTypes/getRasterTypes"];
      return rastertype;
    },
    getResults: function() {
      let results = this.$store.getters["Results/getResults"];
      return results;
    },
    getDefaultYears() {
      const showDefaultYears = this.$store.getters["Results/getDefaultYears"];
      return showDefaultYears;
    },
    getEmailResultID() {
      const EmailedTaskID = this.$store.getters["Results/getEmailTaskID"];
      return EmailedTaskID;
    },
    clonedResult() {
      return this.copiedResults;
    }
  },
  watch: {
    current_geojson: async function() {
      this.$store.dispatch("Shapefiles/geometry_loaded", true);
      if (!this.getEmailResultID) {
        this.common();
      }
      this.FinalGeojsonLoaded();
    },
    getResults: {
      deep: true,
      immediate: true,
      handler: function(val, oldval) {
        if (val) {
          this.copiedResults = { ...val };
          // this.$store.dispatch("Results/setEmailTaskID", null);
          this.$Log("getResuts watch forest 284 ", this.clonedResult);
          this.source = {};
          if (Object.keys(val.args.selections).length > 0) {
            this.source = val.args.selections;
            this.show_years = true;
          } else {
            this.source.value = val.args.selections;
          }
          (this.persistent = true), this.analize(val.result);
          this.$Log("getResuts watch forest  ", this.source);
        }
      }
    }
  },
  mounted() {
    this.$Log("EmailedTaskID in forest ", this.getEmailResultID);
    if (!this.getEmailResultID) {
      this.$store.dispatch("Results/disable_default_years", true);
      //check if we have task id in store, if not continue to make default stats
      this.source = {};
      this.source.value = "Hansen";
      this.source.label = "Hansen";
      this.show_years = true;
    }
  },
  methods: {
    get_cached_results(val) {
      this.cached = val;
      if (process.env.DEV) console.log("get_cached_results ", val);
       this.common();
    },
    selectSource(val) {
      // event listener when user changes from LULC and Hansen data
      this.$Log("selectSource ", this.source);
      this.$store.dispatch("Results/clearResult"); //clears any queued results loaded to store
      if (this.source && this.source.value === "LULC") {
        this.empty_years = true; // clears the start and end year selection for LULC
        this.show_download = true;
      } else {
        this.show_download = false;
      }
    },
    computeSummary() {
      //calculates forest gain or loss between years selected
      return (
        this.loss_gain[this.loss_gain.length - 1].value -
        this.loss_gain[0].value //get diffrence between the first and last year for the period selected
      );
    },
    lossgain() {
      //check which statement to use for forest change summary depending on the difference in value
      let lossgain = this.computeSummary();
      if (lossgain > 0) return this.$t("lossgain.gain");
      if (lossgain < 0) return this.$t("lossgain.loss");
      if (lossgain === 0) return this.$t("lossgain.stability");
    },
    async yearselection(years) {
      // handler function  for emitted values from year selection component
      if (this.getEmailResultID) {
        // if we have an task ID in memory return since User is viewing results
        return;
      }
      this.$Log(
        "yearselection forest =====",
        years,
        "this.getResults ",
        this.getResults
      );
      this.showsummary = false; //disable summary view when new request is about to be made
      this.years.start_year = years.start_year;
      this.years.end_year = years.end_year;
      this.common();
      this.$Log("after run =====", this.source);
    },
    async analize(stats) {
      Log("Forest analize 354 ", stats.stats, "this.years ", this.years);
      this.nodata = stats.nodata; //get no data values
      this.hansen_summary = null;
      this.no_data_hansen = false;
      this.hansen = false;
      this.forestchangedata = {};

      if (this.source.value === "Hansen") {
        this.$Log("Tuko Hansen");
        this.showsummary = true;
        let results = Analize_Hansen(stats, this.years.start_year);
        let raster = {};
        raster.rasterfile = stats.rasterfile;
        // let raster = await filter_forest_raster(stats);
        if (raster) {
          let classification = [];
          results.length > 0
            ? (classification = [results[0].key])
            : (classification = [0]);
          raster.name = `${this.$t("forest_loss")} ${this.years.start_year}`;
          let color = [{ color: "red", value: "forest_loss" }];
          this.load_raster(classification, color, raster);
        }
        if (results.length > 0) {
          this.hansen_summary = [
            this.years.start_year,
            this.area_selected,
            results[0].value.toLocaleString()
          ];
          this.hansen = true;
        } else {
          this.$Log(" Hansen no_data_hansen");
          this.no_data_hansen = true;
        }
        this.$Log(" Hansen required_stat", results, "raster ", raster);
      }
      if (this.source.value === "LULC" || this.source === "LULC") {
        //summary data
        this.loss_gain = [];
        stats.stats.stats.forEach(stat => {
          stat.stats.forEach(cl => {
            if (cl.label === "Forest") {
              cl.year = stat.year;
              this.loss_gain.push(cl);
            }
          });
        });
        Log("Stat outer ", this.loss_gain);
        let raster = {};
        raster.rasterfile = stats.rasterfile;
        Log("LULC forest change data ", raster);
        if (raster) {
          let classification = [7];
          raster.name = `${this.$t("forest_change")} ${this.years.start_year}-${
            this.years.end_year
          }`;
          let color = [{ color: "#003c00", value: "Forest", number: 7 }];
          this.load_raster(classification, color, raster);
        }
        let temp = {};
        let labels = [],
          datasets = [];
        let dataset = {
          // label: "",
          backgroundColor: [],
          data: []
        };
        let self = this;
        stats.stats.stats.forEach((stat, i) => {
          labels.push(stat.raster_name.split(" ")[1]); // main labels for chart

          stat.stats.forEach((arr, j) => {
            if (arr.label === "Forest") {
              dataset.data.push(arr.value);
            }
          });
        });
        let data = [];
        this.loss = false;
        this.gain = false;
        let it = dataset.data.length - 1;
        for (let i = 0; i < it; i++) {
          let hold = dataset.data[i + 1] - dataset.data[i];
          if (hold < 0) {
            this.loss = true;
            dataset.backgroundColor.push("red");
          } else {
            this.gain = true;
            dataset.backgroundColor.push("green");
          }
          data.push(hold);
        }
        this.chart = true;
        dataset.data = data;
        datasets.push(dataset);
        temp.datasets = datasets;
        temp.labels = labels.slice(1);
        this.forestchangedata = { ...temp };
        Log("forestchangedata ", this.forestchangedata);
        this.showsummary = true;
      }
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
        this.$Log(
          "getAdminLevel watch FinalGeojsonLoaded ",
          this.current_geojson.id,
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
    async common() {
      this.showsummary = false;
      let requestData = {};
      requestData.cached = this.cached === undefined ? true : this.cached;
      let raster_type_source;
      if (
        (this.source && this.source === "LULC") ||
        this.source.value === "LULC"
      ) {
        requestData.raster_source = "LULC";
        raster_type_source = "LULC";
      }
      if (
        (this.source && this.source === "Hansen") ||
        this.source.value === "Hansen"
      ) {
        requestData.raster_source = "Hansen";
        raster_type_source = "Forest Loss";
      }
      let raster_type = this.rasterTypeSources.filter(type => {
        //  Log("found forestCommon ", type);
        if (type.name === raster_type_source) {
          Log("found forestCommon ", type);
          return type.id;
        }
      });
      requestData.transform = "area";
      requestData.show_change = 1;
      if (this.current_geojson.hasOwnProperty("empty")) return;
      if (this.current_geojson.hasOwnProperty("id")) {
        requestData.admin_level = this.current_geojson.level;
        requestData.vector = this.current_geojson.id;
      } else {
        requestData.custom_coords = JSON.stringify(this.current_geojson);
      }
      requestData.raster_type = raster_type[0].id;
      requestData.start_year = this.years.start_year;
      if (
        (this.source && this.source === "Hansen") ||
        this.source.value === "Hansen"
      )
        this.years.end_year = this.years.start_year;
      requestData.end_year = this.years.end_year;
      // requestData.selections = this.selection;
      requestData.currentTab = this.currentTab;
      requestData.selections = this.source;

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
      Log("years ", this.years, "Request common Data forest", requestData);
      let stats = null;
      if (requestData.start_year && this.getResults === null) {
        stats = await RequestStats("/api/forestchange/", requestData);
      }
      Log("response stats forest ", stats);

      if (stats && stats.hasOwnProperty("stats")) {
        this.copiedResults = null;
        return this.analize(stats);
      }
      if (stats && stats.hasOwnProperty("message"))
        return positive(stats.message, 0);
    },

    downloadcsv() {
      let csv_data = [];
      this.$Log("this.forestchangedata 621 ", this.forestchangedata);
      this.forestchangedata.datasets[0].data.forEach((data, i) => {
        csv_data.push({
          year: this.forestchangedata.labels[i],
          change: data
        });
      });
      let name = `Forest change ${this.years.start_year}-${this.years.end_year}.csv`;
      downloadCSV({ filename: name, data: csv_data });
    },
    download_chart() {
      // Log("myBarCanvas ", this.years);
      let name = `Forest change ${this.years.start_year}-${this.years.end_year}`;
      let chartImg = document
        .getElementById("myBarCanvas")
        .toDataURL("image/png");
      download_chart(chartImg, name);
    }
  }
};
</script>

<style scoped>
.loss {
  height: 10px;
  width: 50px;
  background-color: red;
}
.gain {
  height: 10px;
  width: 50px;
  background-color: green;
}
</style>
