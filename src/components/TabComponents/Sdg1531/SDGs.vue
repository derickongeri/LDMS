<template>
  <div class="q-pa-xs row sdg">
    <!-- <p class="q-mt-md">Custom</p>
    <q-checkbox v-model="checked" />-->
    <div v-if="!checked" class="col" style="min-width: 100px">
      <q-select
        rounded
        :key="$i18n.locale"
        outlined
        v-model="selection0"
        :options="filteredoptions"
        label="Select SDG Indicator"
        dense
        options-dense
        style="max-width: 150px"
      />
    </div>
    <div
      class="col q-ml-sm"
      v-if="['Productivity', 'Land degradation'].includes(selection0.value)"
    >
      <q-select
        rounded
        outlined
        v-model="raster_source"
        :options="raster_sources"
        dense
        options-dense
        label="Source"
        style="min-width: 110px"
      />
    </div>
    <div
      class="col q-ml-sm"
      v-if="
        selection0 &&
          !directSelection.includes(selection0.value) &&
          !checked &&
          selection0.value !== 'Land degradation' //hide selection 1 for land degradation
      "
    >
      <q-select
        @input="onSelection1"
        rounded
        outlined
        v-model="selection1"
        :options="options1"
        dense
        options-dense
        label="Analysis"
        style="min-width: 100px"
      />
    </div>

    <div v-if="checked" class="q-pa-md">
      <q-file
        v-model="file"
        dense
        label="Upload file"
        filled
        style="min-width: 80px"
      />
    </div>
    <!-- {{selection_0}} -->
  </div>
</template>
<script>
import { i18n } from "src/boot/i18n";
import { Log } from "src/Services/Logger";
import checkArea from "src/Mixins/CalculateArea";

export default {
  mixins: [checkArea],
  props: {
    cloned_Result: {
      type: Object
    }
  },
  data() {
    return {
      directSelection: ["Carbon Stock Change"], //holds options that does not require selection 1
      selection0: "",
      selection1: "",
      selection2: "",
      raster_source: "",
      TwoYearFields: [
        "Trajectory",
        "State",
        "Performance",
        "Land Cover Change",
        "Carbon Stock Change",
        "Land degradation",
        "Land Productivity"
      ],
      level2Only: ["Land degradation", "Productivity", "Carbon Stock Change"],
      year: null,
      initial: false,
      checked: false,
      file: null, // file upload
      soc: [], //holds soc reference raster array
      filteredoptions: []
    };
  },
  watch: {
    initialyear: function(val, old) {
      if (this.year) {
        Log("SDG Year ", val, "Old YEAR ", old);
        this.default_selector(); //default selector function => LULC Landcover
        this.onSelection1(this.selection1, this.initialyear);
      }
    },
    checked: function(val) {
      if (val) {
        //check if the custom upload checkbox has been pressed
        this.$emit("sdgselection", { show: false });
        this.selection0 = "";
        this.selection1 = "";
      }
    },
    selection1: function(val, oldval) {
      //check if new value is empty then clear the year selection
      // Log("Changes in selection1", this.selection1);
      // if (Object.values(oldval).length > 0) {;this.raster_source=""};
      Log("+++++++++, selection1 ", val, "old val ", oldval);
      if (val === "") this.$emit("sdgselection", { show: false });
    },
    selection0: function(val, oldval) {
      //check if we need to clear all the fields of the old value was not empty
      if (this.directSelection.includes(val.value)) {
        this.onSelection1(val, null);
        this.selection1 = val;
        return;
      }
      if (Object.values(oldval).length > 0) {
        this.selection1 = "";
        this.raster_source = "";
      }
      Log("+++++||||||||++++, selection0 ", val, "old val ", oldval);
    },
    raster_source: function(val, oldval) {
      Log("jjjjjkkkkkkkkkkkkkk", val, "selection0 ", this.selection0);
      if (val && this.selection0.value === "Land degradation") {
        Log("jjjjj", val);
        this.selection1 = this.selection0;
        return this.onSelection1(val.value, null);
      }
      if (!this.getResults) this.selection1 = "";
    },
    current_geojson: function(val, oldval) {
      this.updateSelection0(val, oldval);
    },
    options0: function(val) {
      //checks for language translation
      let loaded = [];
      val.forEach(option => {
        this.filteredoptions.forEach(opt => {
          if (opt.value === option.value) {
            loaded.push(option);
          }
        });
      });
      this.filteredoptions = [...loaded];
    },
    //watcher for results
    getResults(val, oldval) {
      this.$Log(" watch Results from get sdg ", val);
      if (val && val.args.currentTab === "sdg") {
        this.selection0 = {};
        this.selection0.value = val.args.selections.selection0;
        this.selection0.label = val.args.selections.selection0;
        this.selection1 = val.args.selections.selection1;
        this.raster_source = val.args.selections.raster_source;
        // this.raster_source.value = val.args.selections.raster_source
      }
    },
    immediate: true
  },
  mounted() {
    this.updateSelection0(this.current_geojson);
    if (this.year) {
      this.default_selector();
      this.onSelection1(this.selection1, this.year);
    }
  },
  computed: {
    raster_sources() {
      this.$Log("area= sdg juu", this.current_geojson);
      if(Object.keys(this.current_geojson).length<1) return
      const area = this.checkArea({
        current_geojson:
          this.current_geojson.hasOwnProperty('name') ? this.current_geojson.geojson.geometry : this.current_geojson,
        raster_source: this.raster_source
      });
      this.$Log("area= sdg", area);
      if (area.area > area.threshold) {
        return [{ label: "Modis", value: "Modis" }];
      }
      
      return [
        { label: "Modis", value: "Modis" },
        { label: "Landsat", value: "Landsat 7" }
      ];
    },

    getResults() {
      return this.cloned_Result;
    },
    current_geojson() {
      let geojson = null;
      geojson = this.$store.getters["Shapefiles/getcurrentGeoJson"];
      if (geojson) {
        return geojson;
      }
    },
    selection_0() {
      return this.selection0;
    },
    options0() {
      let options = [
        {
          label: this.$t("sdgSelections.options0.Productivity_"),
          value: "Productivity"
        },
        { label: this.$t("sdgSelections.options0.LULC"), value: "LULC" },
        {
          label: this.$t("sdgSelections.options0.carbon_stock"),
          value: "Carbon Stock Change"
        },
        {
          label: this.$t("sdgSelections.options0.land_degradation"),
          value: "Land degradation"
        }
      ];

      return options;
    },
    secondOptions() {
      return {
        Productivity: [
          {
            label: this.$t(
              "secondOptions.Productivity.land_productivity_change"
            ),
            value: "Land Productivity"
          },
          {
            label: this.$t("secondOptions.Productivity.trajectory"),
            value: "Trajectory"
          },
          {
            label: this.$t("secondOptions.Productivity.State"),
            value: "State"
          },
          {
            label: this.$t("secondOptions.Productivity.Performance"),
            value: "Performance"
          }
        ],
        LULC: [
          {
            label: this.$t("secondOptions.LULC.Land_Cover"),
            value: "Land Cover"
          },
          {
            label: this.$t("secondOptions.LULC.Land_Cover_Change"),
            value: "Land Cover Change"
          }
        ]
      };
    },
    initialyear() {
      // get year and send it as options (LULC is the first analysis users get by default)
      let rastertype = this.$store.getters["RasterTypes/getRasterTypes"];
      let type=null
      if(rastertype){
         type = rastertype.filter(raster=>{
          return raster.name ===  "LULC"
        })
      }else{
        return
      }
      let rasters = this.$store.getters["Geotiffs/getRasterList"];
       Log("Rasters in sdg : ", type);
      if (rasters.length > 0) {
        let lulc = rasters.filter(raster => {
          return raster.raster_type === type[0].id;
        });
        let yearsValues =[]
        lulc.forEach(year=>{
          yearsValues.push(year.raster_year)
        })
          let uniqueYears = yearsValues.filter((v, i, a) => a.indexOf(v) === i) //get only unique values
        this.year = uniqueYears[uniqueYears.length - 1];
        Log("Rasters: ", lulc, "id ", uniqueYears);
      }
      return this.year;
    },
    carbonRefOptions() {
      let rasters = this.$store.getters["Geotiffs/getRasterList"];
      this.soc = [];
      let soc_ref_years = [];
      if (rasters.length > 0) {
        this.soc = rasters.filter(raster => {
          return raster.name === "Reference SOC";
        });
        this.soc.forEach(element => {
          soc_ref_years.push(element.raster_year);
        });
      }
      return soc_ref_years;
    },

    options1() {
      switch (this.selection0.value) {
        case "Productivity":
          return this.secondOptions.Productivity;
        case "LULC":
          return this.secondOptions.LULC;
        // case "Carbon Stock":
        //   return this.secondOptions.CarbonStock;
        // case "Land degradation":
        //   return this.secondOptions.LandDegradation;
      }
    }
  },
  methods: {
    onSelection1(selection, year = null) {
      this.send(selection, year);
    },
    async send(selection, year) {
      let choice = {};
      if (year !== null) {
        choice.default_year = year;
      } else {
        this.initial = false;
        await this.$emit("sdgselection", { show: false });
      }
      choice.selection0 = this.selection0.value;
      choice.selection1 = this.selection1.value;
      choice.years2 = false;
      if (this.TwoYearFields.includes(this.selection1.value)) {
        choice.years2 = true;
      }
      if (this.raster_source.value)
        choice.raster_source = this.raster_source.value;
      Log(
        "onSelection1 292",
        choice,
        "this.raster_source ",
        this.raster_source
      );
      await this.$emit("sdgselection", choice);
    },

    default_selector() {
      const EmailedTaskID = this.$store.getters["Results/getEmailTaskID"];
      if (EmailedTaskID) {
        this.$Log(`EmailedTaskID found ${EmailedTaskID}`);
        return;
      }
      this.initial = true;
      this.selection0 = this.options0[1];
      this.selection1 = this.options1[0];
    },
    updateSelection0(val, oldval) {
      //show other sdg options only if area is smaller
      let options0 = [];
      let options = this.options0;
      this.filteredoptions = this.options0; //overide
    }
  }
};
</script>

<style scoped>
div.sdg {
  font-size: 90px;
}
</style>
