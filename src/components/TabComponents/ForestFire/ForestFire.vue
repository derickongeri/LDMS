<template>
  <div>
    <div class="row">
      <div class="col-md-10  col-xs-10">
        <Selections @get_forest_fire="common($event)" />
        <!-- <YearSelection @yearselection="yearselection($event)" :years2="false" :width="150" /> -->
      </div>
      <div class="absolute-right q-pa-md">
        <Icons
          @downloadcsv="downloadcsv($event)"
          @download_chart="download_chart($event)"
          :show_download="show_download"
          :currentTab="currentTab"
          :forest_fire_selection="forest_fire_selection"
        />
      </div>
    </div>
    <div class="row q-pa-md">
      <div class="col-sm-12 " v-if="Object.keys(Piedata).length > 0">
        <PieChart
          :piedata="Piedata"
          :chart-id="`mycanvas`"
          :height="250"
          :width="350"
          :style="`background-color: #66b2b2`"
        />
      </div>
      <div class="col-xs-12 col-md-12" v-if="showsummary">
       
        <Summary :show="showsummary">
          <p v-html="$t('ForestFire', [
          forest_fire_selection.prefire_end,
          forest_fire_selection.postfire_start,
          `${area_selected}`,

            `${(Piedata.data[0] / 10000).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} ha (${checkSummaryPercentage(Piedata.data[0])})`,
                

            `${(Piedata.data[1] / 10000).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} ha (${checkSummaryPercentage(Piedata.data[1])})`,

            `${(Piedata.data[2] / 10000).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} ha (${checkSummaryPercentage(Piedata.data[2])})`,

            `${(Piedata.data[3] / 10000).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} ha (${checkSummaryPercentage(Piedata.data[3])})`,

            `${(Piedata.data[4] / 10000).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} ha (${checkSummaryPercentage(Piedata.data[4])})`,

          ])"></p>
        </Summary>
      </div>
    </div>
    <LargeAreaDialog
      :show_dialog="show_dialog"
      @cancel_request="cancel_request($event)"
      @queue_request="queue_request($event)"
    />
  </div>
</template>

<script>
import { downloadCSV } from "src/Download_Utils/Download_CSV";
import { download_chart } from "src/Download_Utils/Download_Chart";
import { RequestStats } from "src/Services/RequestAnalysis.js";
import LoadRaster from "src/Mixins/RenderRaster";
import { Log } from "src/Services/Logger";
import { positive, negative } from "src/Services/Notifications";
import GoogleAnalytics from "src/Mixins/GoogleAnalytics";
import { forestfirestats } from "./ForestFireStats";
import CalculateArea from "src/Mixins/CalculateArea";
export default {
  mixins: [LoadRaster, GoogleAnalytics, CalculateArea],
  props: {
    rasters: {
      type: Array
    },
    currentTab: {
      type: String
    }
  },
  components: {
    Selections: require("./ForestFireSelections").default,
    YearSelection: require("../../CommonTabItems/YearSelection").default,
    Summary: require("../../CommonTabItems/Summary").default,
    Icons: require("../../CommonTabItems/Icons.vue").default,
    PieChart: require("../../Charts/PieChart").default,
    LargeAreaDialog: require("../../Dialogs/LargeAreaDialog").default
  },
  data() {
    return {
      forest_fire_selection: null,
      dismissed: null,
      chartdata: {},
      show_download: false,
      showsummary: false //used to show summary
    };
  },
  computed: {
    current_geojson() {
      let current = this.$store.getters["Shapefiles/getcurrentGeoJson"];
      if (Object.keys(current).length > 1) {
        this.$Log(" current_geojson  computed", current);
        return current;
      }
    },
    Piedata() {
      return this.chartdata;
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
  watch: {
    current_geojson() {
      if (this.forest_fire_selection) this.common();
    }
  },
  methods: {
    async common(data) {
      this.showsummary = false;
      if (data && Object.keys(data).length > 0) {
        this.forest_fire_selection = { ...data };
      }
      let payload = this.payloadCreator();
      let stats;
      if (payload) stats = await RequestStats(`/api/forestfire/`, payload);

      if (stats && stats.stats) {
        this.chartdata = forestfirestats(stats.stats);
        this.$Log("Forest Fire response ", this.chartdata.data);
        this.sum = this.chartdata.data.reduce((a, b) => a + b, 0);
        this.showsummary = true;
      }
      if (stats) {
        let raster = {};
        raster.name = "Forest Fire";
        raster.rasterfile = stats.rasterfile;
        let classification = [];
        let color = [
          { color: "#768833", value: "Enhanced Regrowth" },
          { color: "#0ce244", value: "Unburned" },
          { color: "#f5fe0c", value: "Low Severity" },
          { color: "#fa671a", value: "Moderate Severity" },
          { color: "#a500d2", value: "High Severity" }
        ];
        if (stats && stats.hasOwnProperty("message"))
          return positive(stats.message, 0);
        if (stats && stats.rasterfile) {
          this.show_download = true;
          return this.load_raster(classification, color, raster);
        }
        negative("No data for area selected ");
        this.show_download = false;
      }
    },
    payloadCreator() {
      let requestData = {};
      requestData = { ...this.forest_fire_selection };
      if (
        typeof this.current_geojson === Object &&
        this.current_geojson.hasOwnProperty("empty")
      )
        return;
      console.log("this.current_geojson fire ", this.current_geojson);
      //check if defined region from selection or a custom polygon draw
      if (this.current_geojson.hasOwnProperty("id")) {
        requestData.vector = this.current_geojson.id;
        requestData.admin_level = this.current_geojson.level;
      } else {
        requestData.custom_coords = JSON.stringify(this.current_geojson);
        // const within = this.check_if_within();
        // this.$Log("within ", within);
        // if (!within) return;
      }
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
      requestData.transform = "area";
      requestData.show_change = 1;
      requestData.raster_type = 1;
      //  requestData.selections = this.selection;
      requestData.currentTab = this.currentTab;
      this.$Log("forest fire final data ", requestData);
      return requestData;
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
    downloadcsv() {
      let csv_data = [];
      if (process.env.DEV) console.log("forest fire csv ", this.Piedata);
      this.Piedata.data.forEach((data, i) => {
        csv_data.push({
          class: this.Piedata.labels[i],
          area: data
        });
      });
      let name = `Forest fire from ${this.forest_fire_selection.prefire_start}_${this.forest_fire_selection.prefire_end} to ${this.forest_fire_selection.postfire_start}_${this.forest_fire_selection.postfire_end} .csv`;
      downloadCSV({ filename: name, data: csv_data });
    },
    download_chart() {
      // Log("myBarCanvas ", this.years);
      let name = `Forest fire from ${this.forest_fire_selection.prefire_start}_${this.forest_fire_selection.prefire_end} to ${this.forest_fire_selection.postfire_start}_${this.forest_fire_selection.postfire_end}`;
      let chartImg = document.getElementById("mycanvas").toDataURL("image/png");
      download_chart(chartImg, name);
    }
  }
};
</script>

<style></style>
