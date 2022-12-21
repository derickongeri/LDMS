<template>
  <div>
    <div class="q-pa-xs row">        
      <div class="col-md-3 q-mt-xs">
        <q-select
          @input="onRaster_source"
          rounded
          outlined
          v-model="raster_source"
          :options="raster_sources"
          dense
          options-dense
          label="Source"
          style="min-width: 100px"
        />
      </div>
      <div class="col-md-3 q-pa-xs">
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
      </div>
      <div class="col-md-9">
        <YearSelection
          @yearselection="yearselection($event)"
          :years2="true"
          :yearOnly="true"
          :change_years="default_years"
          :width="100"
          :empty_years="clears_years"
          :rasterType="raster_Type"
          :result_years="years"
        />
      </div>
      <div class="absolute-right q-mr-md">
        <Icons
          @downloadcsv="downloadcsv($event)"
          @download_chart="download_chart($event)"
           @get_cached_results="get_cached_results"
        >
        </Icons>
      </div>
    </div>
    <div class="row q-pa-xs">
      <div class="col-sm-12 col-md-12 q-mt-md" v-if="showsummary">
        <PieChart
          :piedata="ldh_piedata"
          :chart-id="`mycanvas`"
          :height="250"
          :width="350"
          :style="`background-color: #66b2b2`"
        />
      </div>
      <div class="col-sm-12 col-md-12" v-if="PieData.hasOwnProperty(`data`)">
        <Summary :show="showsummary">
          <div
            v-if="
              selection.selection1 === `State` &&
                Object.keys(selection).includes('year')
            "
          >
            <p
              v-html="
                $t('veg_loss_gain', [
                
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
          <!-- <p v-if="nodata">No data values {{ nodata }}</p> -->
       
        </Summary>
      </div>
      <div v-if="!showsummary">
          Change year or region to get Analysis
      </div>
    </div>
  <LargeAreaDialog :show_dialog="show_dialog" @cancel_request="cancel_request($event)" @queue_request="queue_request($event)" /> 
  <WaitForShapeFile :show="persistent"/>
  </div>
</template>
<script>
import Sdg1531 from "src/components/TabComponents/Sdg1531/Sdg1531";
import sdg from "src/components/TabComponents/Sdg1531/SDGs";
import LoadRaster from "src/Mixins/RenderRaster";
import { Log } from "src/Services/Logger";
export default {
  mixins: [Sdg1531, LoadRaster, sdg],
  props: {
    currentTab: {
      type: String
    }
  },
  components: {
    Icons: require("../../CommonTabItems/Icons.vue").default,
    YearSelection: require("../../CommonTabItems/YearSelection").default,
    Summary: require("../../CommonTabItems/Summary").default,
    PieChart: require("../../Charts/PieChart").default,
    WaitForShapeFile: require('src/components/Dialogs/WaitForShapeFile').default,
  },
  data() {
    return {
      persistent:false,
      show: false,
      selection: {},
      pie: false,
      years: {},
      veg_index:"NDVI"
    };
  },
  mounted() {
    if(this.getEmailResultID) {
      this.$Log(" getResults LDH ");
      this.$store.dispatch("Results/disable_default_years", false); //set to false to avoid resetting years to default
      return
    }
    
    this.$store.dispatch("Results/disable_default_years", true);
    this.raster_source = "Modis";
    let year = { start_year: 2000, end_year: 2010 };
    this.sdgselection({
      selection0: "Productivity",
      selection1: "State",
      raster_source:this.raster_source,
      years2: true,
      LDH: true
    });
  },
   watch:{
     getResults:{
        immediate: true,
       handler(val){
      this.$Log("getResuts watch out ",val)
      if (val ) {
         this.copiedResults = { ...val };
        // this.$store.dispatch("Results/setEmailTaskID", null);
        this.rasterType = { id: 1, name: "LULC" };
        this.selection =  this.copiedResults.args.selections;
        this.years = this.selection.year;
        this.veg_index =this.copiedResults.args.veg_index
        this.raster_source = this.selection.raster_source
        this.analize(val.result);
        this.persistent=true;
        this.$Log("getResuts watch  in ", this.selection);
      }
    },
     }
  },
  computed: {
    getResults() { // checks results from queued tasks
      let results = this.$store.getters["Results/getResults"];
      return results;
    },
     getEmailResultID() { //checks if we have taskid in store
      const EmailedTaskID = this.$store.getters["Results/getEmailTaskID"];
      return EmailedTaskID;
    },
     getDefaultYears() { //check if default years should be used
      const showDefaultYears = this.$store.getters["Results/getDefaultYears"];
      return showDefaultYears;
    },
    default_years() {
      //gets first and last raster and extract years
      if(this.copiedResults){
        return 
      }
       Log("ldh default_years ",this.copiedResults, "this.getDefaultYears ",this.getDefaultYears);
      if (this.raster_Type && this.getDefaultYears) {
        let year = this.$store.getters["Geotiffs/getRasterList"].filter(
          year => {
            return year.raster_type === this.raster_Type.id;
          }
        );
        let startyear =
          this.current_geojson.level === -1
            ? year[year.length - 2].raster_year
            : year[0].raster_year;
        let endyear = year[10].raster_year;

        Log("ldh++++++", startyear, "end year ", endyear);
        return {
          startyear,
          endyear
        };
      }
    },
    ldh_piedata() {
      let data = this.piedata;
      if (data) {
        data.labels = [
          this.$t("legend.Stable"),
          this.$t("legend.Gain"),
          this.$t("legend.Loss")
        ];
        this.pie = true;
        return data;
      }
    }
  },
  methods: {
    onRaster_source() {
      this.veg_index=null
      this.sdgselection({ empty_years:true})
      this.sdgselection({
        selection0: "Productivity",
        selection1: "State",
        years2: true,
        LDH: true,
        raster_source: this.raster_source.value,
      });
     
    // 
    },
    onVegIndexSelection(){
        this.sdgselection({empty_years:true})
    }
  }
};
</script>
