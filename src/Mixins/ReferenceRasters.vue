<script>
import { Log } from "src/Services/Logger";
export default {
  data() {
    return {
      veg_index: "NDVI",
      soc_refselection: null, //holds carbon selection refence year
      reference_eco_units: null, //holds reference_eco_units for degradation
      soc_ref_id: null, // soc ref id
      reference_eco_id: null, //reference_eco_units id
      soc: [], //holds soc reference raster array
      eco: [] //holds eco  reference raster array
    };
  },
  computed: {
    veg_index_Options() {
      return ["NDVI", "SAVI", "MSAVI"];
    },
    Soc_RefOptions() {
      // will make it generic for all rasters requiring reference rasters
      let rasters = this.$store.getters["Geotiffs/getRasterList"];
      this.soc = [];
      let soc_ref_years = [];
      if (rasters.length > 0) {
        this.soc = rasters.filter(raster => {
          return raster.name === "Reference SOC";
        });
        Log("carbonRefOptions ", this.soc);
        this.soc.forEach(element => {
          Log("Raster in carbonRefOptions", element);
          soc_ref_years.push({
            label: element.raster_year,
            value: element.id
          });
        });
      }
      this.soc_refselection = soc_ref_years[0];
      return soc_ref_years;
    },
    rasterTypeList() {
      let types = this.$store.getters["RasterTypes/getRasterTypes"];
      if (types) {
        return types;
      }
    },
    Eco_RefOptions() {
      this.$Log("Eco RefOptions ", this.rasterTypeList);
      // will make it generic for all rasters requiring reference rasters
      let id;
      if (this.rasterTypeList.length > 0) {
        id = this.getRefrasterId("Ecological Units", this.rasterTypeList);
      }
      let rasters = this.$store.getters["Geotiffs/getRasterList"];
      this.eco = [];
      let eco_ref_years = [];
      if (rasters.length > 0) {
        this.eco = rasters.filter(raster => {
          return raster.raster_type === id;
        });
        this.$Log("Eco RefOptions ", this.eco);
        this.eco.forEach(element => {
          this.$Log("Raster in carbonRefOptions", element);
          eco_ref_years.push({
            label: element.raster_year,
            value: element.id
          });
        });
      }
      this.reference_eco_units = eco_ref_years[0];
      return eco_ref_years;
    }
  },
  methods: {
    onSocRefselection(selection) {
      //get ref year for soc computation
      this.$Log("onRefselection", selection, "soc ", this.soc);
      let ref_rast = this.soc.filter(soc => {
        return soc.raster_year === selection;
      });
      let id = ref_rast[0].id;
      this.$Log("id ", id);
    },
    onEcoRefselection(selection) {
      //get ref year for eco computation
      this.$Log("onRefselection", selection, "soc ", this.soc);
      let ref_rast = this.eco.filter(eco => {
        return eco.raster_year === selection;
      });
      let id = ref_rast[0].id;
      this.$Log(" soc id ", id);
    },
    getRefrasterId(name, rasterTypes) {
      let type = rasterTypes.filter(type => {
        return type.name === name;
      });
      this.$Log("refid ", rasterTypes);
      return type[0].id;
    },
    onVegIndexSelection(value) {
      this.veg_index = value;
    }
  }
};
</script>
