<template>
  <div class="q-pa-xs">
    <div class="row">
      <div :style="!years2 || yearOnly ? `width:${width}px;` : `width:115px;`">
        <q-select
          @input="selectStartYear"
          rounded
          outlined
          color="green"
          v-model="year.start_year"
          :options="years"
          :label="years2 ? `Start Year` : `Year`"
          dense
          :options-dense="true"
          menu-anchor="bottom middle"
          menu-self="bottom middle"
        ></q-select>
      </div>
      <div
        v-if="years2"
        class="q-ml-xs"
        :style="!years2 || yearOnly ? `width:${width}px;` : `width:115px;`"
      >
        <q-select
          size="xs"
          @input="selectEndYear"
          rounded
          outlined
          color="green"
          v-model="year.end_year"
          :options="years"
          :label="years2 ? `End Year ` : `Year`"
          :dense="true"
          :options-dense="true"
          menu-anchor="bottom middle"
          menu-self="bottom middle"
        ></q-select>
      </div>
    </div>
  </div>
</template>
<script>
import { Log } from "src/Services/Logger";
import { negative } from "src/Services/Notifications";
export default {
  props: {
    hansen_year: {
      //check if we are computing hansen forest loss
      type: Boolean,
      default: false
    },
    years2: {
      //check if two year selection is required
      type: Boolean
    },
    width: {
      //css to set the selection input width
      type: Number
    },
    yearOnly: {
      //boolean to check if only one year is required
      type: Boolean
    },
    default_year: {
      //prop for receiving default year for initial load
      type: Number
    },
    change_years: {
      //for two years e.g forest change
      type: Object
    },
    rasterType: Object,
    empty_years: {
      // a boolean to check if the year selections should be emptied
      type: Boolean
    },
    result_years: {
      type: Object
    }
  },
  data() {
    return {
      year: {
        start_year: null,
        end_year: null
      },
      endyear: null,
      startyear: null,
      show_result_years: false,
      defaultChanged: false
    };
  },
  methods: {
    EmitData() {
      if (this.years.start_year >= this.years.end_year) {
        negative("start year cannot be greater than end year");
        return;
      }
      Log(
        "this.years2 ",
        this.years2,
        " result years ",
        this.result_years,
        " yearselection 89 this.year ",
        this.year,
        " this.show_result_years ",
        this.show_result_years
      );
      if (!this.show_result_years) {
        this.$emit("yearselection", this.year);
      }
    },
    selectStartYear(val) {
      this.$store.dispatch("Results/setEmailTaskID", null);
      this.startyear = val;
      this.year.start_year = val;
      Log(
        "selectStartYear 110",
        val,
        "this.year ",
        this.year.start_year,
        "this.years2",
        this.years2,
        "this.default_year ",
        this.default_year
      );
      if (this.years2 === false) {
        this.show_result_years = false;
        this.defaultChanged = true;
        this.year.start_year = val;
      } else {
        this.year.end_year = null;
      }
    },
    selectEndYear(val) {
      this.$store.dispatch("Results/setEmailTaskID", null);
      this.$store.dispatch("Results/disable_default_years", false);
      this.show_result_years = false;
      this.year.end_year = val;
      Log("selectEndYear 128", val, "this.year ", this.year);
    }
  },
  computed: {
    getResulYears() {
      return this.result_years;
    },
    check_years() {
      return this.empty_years;
    },
    raster_Type() {
      return this.rasterType;
    },
    _default_year() {
      Log(
        "this.default_year  145",
        this.default_year,
        " defaultChanged ",
        this.defaultChanged,
        "this.change_years ",
        this.change_years
      );
      if (this.change_years !== undefined) {
        Log("defaultChanged =================");
        if (this.change_years.startyear >= this.change_years.endyear) {
          negative("End year must be greater than start year");
          return;
        }
        this.year.start_year = this.change_years.startyear;
        this.year.end_year = this.change_years.endyear;
        return;
      }
      if (this.default_year !== undefined && !this.defaultChanged) {
        Log("this.default_year inside ");
        this.year.start_year = this.default_year;
        let year = {};
        year.start_year = this.default_year;
        // this.$emit("initialyear", year);
        Log(
          "initial_year pppp",
          this.default_year,
          "this.year.start_year ",
          this.year.start_year
        );
        return this.default_year;
      }
    },
    years() {
      //list all years
      let years = [];
      let rasters = this.$store.getters["Geotiffs/getRasterList"];
      this.$Log("rasters years", rasters, "raster_Type ", this.raster_Type);
      if (this.raster_Type) {
        rasters.forEach(raster => {
          if (
            this.raster_Type.id === raster.raster_type &&
            !raster.name.includes("Landsat")
          ) {
            years.push(raster.raster_year);
          }
        });
      }

      if (this.hansen_year && !this.show_result_years) {
        this.$Log("Years in Year#  999", years);
        years=years.filter((v, i, a) => a.indexOf(v) === i) 
        const index = years.indexOf(2000);
        years.splice(index, 1);
        this.year.start_year = years[0];
      }
      this.$Log("Years in Year# ", years, "Raster ", this.raster_Type);
      let uniqueYears = years.filter((v, i, a) => a.indexOf(v) === i) //get only unique values
      return uniqueYears.reverse();
    },
    getEmailID() {
      const EmailedTaskID = this.$store.getters["Results/getEmailTaskID"];
      return EmailedTaskID;
    }
  },
  watch: {
    //deep true
    getResulYears: {
      immediate: true,
      handler(val) {
        if (val && Object.keys(val).length > 0 && this.getEmailID) {
          Log("getEmailID ", this.getEmailID, " getResulYears 202 ", val);
          // this.$store.dispatch("Results/setEmailTaskID", null);
          this.show_result_years = true;
          this.year.start_year = val.start_year;
          this.year.end_year = val.end_year;
          //  this.year = {...val}
          Log(" getResulYears 206 ", this.year);
        }
      },
      deep: true
    },
    check_years: {
      immediate: true,
      handler(val) {
        this.$Log("EMPTY  YEARS  9999", val);
        if (val === true) {
          this.year.start_year = null;
          this.year.end_year = null;
          //  this.EmitData();
        }
      },
      deep: true
    },

    _default_year: function(val) {
      Log("defaultChanged watch _default_year ", val, " this.year ", this.year);
      if (this.default_year) {
        // this.year.start_year = this.default_year;
        // this.year.start_year = 2017;
      }
    },

    year: {
      immediate: true,
      handler(val) {
        this.$Log(
          "selectEndYear hanlder ",
          val,
          "this.show_result_years ",
          this.show_result_years,
          "this.years2 ",
          this.years2
        );
        if (this.show_result_years === false) {
          if (this.years2 && val.end_year !== null) {
            this.EmitData();
          }
          if (!this.years2) {
            this.EmitData();
          }
        }
      },
      deep: true //very important
    }
  }
};
</script>
