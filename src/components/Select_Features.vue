<template>
  <div>
    <div class="row" v-if="current_geojson === 1">
      <div class="col-xs-3 q-mr-xs" v-if="!custom_shapefile">
        <p>{{ $t("maps.selectcountry") }}</p>
        <q-select
          filled
          v-model="vect0"
          use-input
          input-debounce="0"
          :options="filter0Options"
          @filter="filterFn0"
          @input="onSelectionvect0"
          
        />       
        </span>
      </div>
      <div
        v-if="vect0 && vect0 !== 'OSS States' && vect1Options.length && !custom_shapefile > 0"
        class="col-xs-3 q-mr-xs"
      >
        <p>{{ $t("maps.selectregion") }}</p>
        <q-select
          filled
          v-model="vect1"
          use-input
          input-debounce="0"
          :options="filter1Options"
          @filter="filterFn1"
          @input="onSelectionvect1"
        />
        <span v-if="vect1">
          {{ vect1 }}
          <q-icon
            size="xs"
            name="disabled_by_default"
            @click="remove({ name: `name_1`, name_1: vect1 })"
          />
        </span>
      </div>
      <div v-if="vect1 && vect2Options.length && !custom_shapefile > 0" class="col-xs-4">
        <p>{{ $t("maps.selectsubregion") }}</p>
        <q-select
          filled
          v-model="vect2"
          use-input
          input-debounce="0"
          :options="filter2Options"
          @filter="filterFn2"
          @input="onSelectionvect2"
        />
        <span v-if="vect2">
          {{ vect2 }}
          <q-icon
            size="xs"
            name="disabled_by_default"
            @click="remove({ name: `name_2`, name_2: vect2 })"
          />
        </span>
      </div>
      <div class="col">
      <div class="row">
        <div class="col-md-6">
            <span>User AOI</span>
        <q-checkbox left-label v-model="custom_shapefile" @input="getCheckBoxState" />
      
        </div>
        <div class="col-md-6">
          <div class="r" v-if="custom_shapefile">
             <span>Custom</span>
        <q-select
          filled
          v-model="customShape"
          use-input
          input-debounce="0"
          :options="usershapefiles"
          @filter="filterFn2"
          @input="onSelectionCustomVect"
        />
      </div>
        </div>
      </div>
      </div>
    </div>
    <div v-else-if="current_geojson === 2">
      <p>Custom Region selected </p>
    </div>
    <div v-else-if="custom_shapefile">
      <span>Custom shape selected </span>
         <q-checkbox left-label v-model="custom_shapefile" @input="getCheckBoxState" />
    </div>
    <div v-else>
      Loading polygons and shapefiles ...
    </div>
   
  </div>
</template>

<script>
import { Loading, QSpinnerFacebook } from "quasar";
import { getregional } from "src/store/shapefiles/getters";
import { Log } from "src/Services/Logger";

const spinner =
  typeof QSpinnerFacebook !== "undefined"
    ? QSpinnerFacebook
    : Quasar.components.QSpinnerFacebook;
export default {
  data() {
    return {
      custom_shapefile: false,
      customShape: null,
      regionalVect: null,
      vect0: null, //holds selected country from select input
      vect1: null, // holds selected region from select input
      vect2: null, // holds selected sub region  from select input
      filter0Options: [], // holds country array names
      filter1Options: [], // holds region array names
      filter2Options: [], // holds subregion array names
      vect0_id: null, //holds country id
      vect1_id: null, //holds region id
      vect2_id: null, //holds sub region id
      geojsons: [], //holds current geojsons [country,region,subregion]
      vect0_obj: {},
      vect1_obj: {},
      vect2_obj: {},
      initialLoad: false, //used to select upto admin level 2 when true
    };
  },
  async mounted() {
    //load all the lists  and store the values in vuex store
    await this.$store.dispatch("Shapefiles/Getvect0List");
    await this.$store.dispatch("Shapefiles/Getvect1List");
    await this.$store.dispatch("Shapefiles/Getvect2List");
    this.$store.dispatch("Shapefiles/getCustomShapes");

    // if (this.vect0Options[0] !== "OSS States" && this.getEmailID === null) {
    //   this.onSelectionvect0("Tunisia", true);
    //   this.initialLoad = true;
    // }
  },
  watch: {
    // vectregional: async function (val) {
    //   if(this.getEmailID) return this.showRegionalVect();
    // },
    vect0Options(val) {
      Log("vect0Options ", val, "this.getEmailID", this.getEmailID);
      if (val[0] !== "OSS States" && this.getEmailID === null) {
        this.onSelectionvect0("Tunisia", true);
        this.initialLoad = true;
      }
    },
    getResults: async function (val) {
      if (val) {
        if(process.env.DEV) console.log("select features queued tasks ",JSON.stringify(val.args));
        const adminLevels = ["admin0", "admin1", "admin2"];
        for (const [index, value] of adminLevels.entries()) {
          if (val.args[value]) {
            await this.getAdminLevel(val.args[value], index);
          }
        }
      }
    },
  },
  computed: {
    usershapefiles() {
      const shapefiles = this.$store.getters["Shapefiles/getCustomShapeFiles"];
      return shapefiles?.map((sp) => {
        return {
          label: sp.shapefile_name,
          value: sp.id,
        };
      });
    },
    getEmailID() {
      const EmailedTaskID = this.$store.getters["Results/getEmailTaskID"];
      return EmailedTaskID;
    },
    //check if results
    getResults() {
      let results = this.$store.getters["Results/getResults"];
      return results;
    },

    //check which polygon is selected
    current_geojson() {
      let region = this.$store.getters["Shapefiles/getcurrentGeoJson"];
      if (region.hasOwnProperty("id")) {
        return 1;
      }
      if (region.hasOwnProperty("empty")) {
        //when polygon is cleared get previouslu selected region and show stats for it
        let selection = this.geojsons.pop();
        return this[`onSelectionvect${selection.level}`](selection.name);
      }
      if (region.hasOwnProperty("area")) {
        return 2;
      }
    },
    //computed method to get regional shapefile
    vectregional() {
      let regionalvect = this.$store.getters["Shapefiles/getregional"];
      return regionalvect[0];
    },
    // computed method to get country names for the selection
    vect0Options() {
      let region = this.vectregional;
      let vect0name = [];
      let vect0List = this.$store.getters["Shapefiles/getvect0"];
      vect0name = vect0List.map((resp) => {
        if (process.env.DEV) console.log("resp :", resp);
        return resp.name_0;
      });
      if (region) {
        // add oss region to coutries array
        Log("this.vectregional.name ", this.vectregional.name);
        // vect0name.sort();
        // vect0name.push("OSS States North Africa");
      }
      this.$Log("vect0name 149", vect0name);
      let Western_Sahara_Idex = vect0name.indexOf("Western Sahara");
      vect0name.splice(Western_Sahara_Idex, 1);
      return vect0name.sort();
    },
    // computed method to get name array for regions selection
    vect1Options() {
      let vect1names = [];
      let vect1List = this.$store.getters["Shapefiles/getvect1"].filter(
        (obj) => {
          return obj.admin_zero_id === this.vect0_id; //filter regions to only the country selected
        }
      );
      vect1List.forEach((resp) => {
        vect1names.push(resp.name_1);
      });
      return vect1names;
    },
    //computed method to get the  subregion names array for the select to work
    vect2Options() {
      let vect2names = [];
      let vect2List = this.$store.getters["Shapefiles/getvect2"].filter(
        (obj) => {
          //filter subregions to only belong to the region
          return obj.admin_one_id === this.vect1_id;
        }
      );
      vect2List.forEach((resp) => {
        vect2names.push(resp.name_2);
      });
      return vect2names;
    },
  },
  methods: {
    // function to remove country or regions/subregion selected
    remove(vector) {
      Log("geojsons remove ", this.geojsons);
      let index = parseInt(vector.name.split("_")[1]); //get index of the geometry in the geojson array
      this.geojsons.forEach((geo) => {
        if (this.geojsons.indexOf(geo) === index) {
          for (let i = this.geojsons.length - index; i > 0; i--) {
            this[`vect${this.geojsons.length - i}`] = null; // remove the name of the selected country/ region e,g vect0= null
          }
          this.geojsons.splice(index, this.geojsons.length - index); // remove the geometry of the country/ region in the array
        }
      });
      if (this.geojsons.length > 0) {
        this.$emit("filter_data", this.geojsons[this.geojsons.length - 1]);
      }
    },
    // function to filter country names from the selection
    filterFn0(val, update) {
      update(() => {
        if (val === "") {
          this.filter0Options = this.vect0Options;
        } else {
          const needle = val.toLowerCase();
          this.filter0Options = this.vect0Options.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    },
    // function to filter reginal names in the select input
    filterFn1(val, update) {
      update(() => {
        if (val === "") {
          this.filter1Options = this.vect1Options;
        } else {
          const needle = val.toLowerCase();
          this.filter1Options = this.vect1Options.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    },
    // function to filter sub region entries on the selection input
    filterFn2(val, update) {
      update(() => {
        if (val === "") {
          this.filter2Options = this.vect2Options;
        } else {
          const needle = val.toLowerCase();
          this.filter2Options = this.vect2Options.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    },
    //function to get regional shapefile
    async showRegionalVect() {
      this.Show_Loading(true);
      let regional_shapefile = await this.$store.dispatch(
        "Shapefiles/GetRegionVect",
        this.vectregional.id
      );
      let final = {
        geojson: regional_shapefile,
        id: this.vectregional.id,
        name: "OSS States",
        level: -1,
      };
      this.regionalVect = final;
      Log("showRegionalVect ", final);
      this.$emit("filter_data", final);
      this.vect0 = this.regionalVect.name;
      this.Show_Loading(false);
    },
    //fuction to get country geojson data
    async onSelectionvect0(val, loaded = false) {
      if (!loaded) {
        this.initialLoad = false;
      }
      try {
        this.Show_Loading(true);
        this.vect0 = val;
        if (this.vectregional && this.vectregional.hasOwnProperty("name")) {
          Log("onSelectionvect0 val ", val, loaded);
          if (val === this.vectregional.name) return this.showRegionalVect();
        }
        this.vect1 = null;
        this.geojsons = [];

        let vect0 = this.$store.getters["Shapefiles/getvect0"].filter((obj) => {
          return obj.name_0 === val;
        });
        Log("String options vect0", vect0[0], "val ", val);
        if (val === "OSS States North Africa") return this.showRegionalVect();
        let vect0Geojson;
        if (vect0.length > 0) {
          this.vect0_id = vect0[0].id; //get id of the country selected

          vect0Geojson = await this.$store.dispatch(
            "Shapefiles/Getvect0",
            this.vect0_id
          );
        }
        if (vect0Geojson) {
          let final = {
            geojson: vect0Geojson,
            id: this.vect0_id,
            name: this.vect0,
            level: 0,
          };
          Log(this.initialLoad, " this.initialLoad String options ", final, "this.vect1Options ",this.vect1Options);

          if (this.initialLoad) {
            await this.onSelectionvect1(this.vect1Options[0]);
            this.initialLoad = false;
          } else {
            this.$emit("filter_data", final);
          }
          this.geojsons[0] = final;
          this.$store.dispatch("Shapefiles/storeCountryGeoJson", vect0Geojson);
        }
        this.Show_Loading(false);
      } catch (error) {
        Log("select features vect0 error", error);
        this.Show_Loading(false);
      }
    },
    //function to get region geojson data
    async onSelectionvect1(val) {
      Log("region select 1", val);
      this.vect2 = null;
      this.vect1 = val;
      try {
        this.Show_Loading(true);
        let vect1 = this.$store.getters["Shapefiles/getvect1"].filter((obj) => {
          return obj.name_1 === val;
        });
       
          // console.log(val , "  kikikiki  ", this.$store.getters["Shapefiles/getvect1"]);
      
        this.vect1_id = vect1[0].id; //get id of the region selected
        // Log("String options 1", vect1[0]);
        let vect1Geojson = await this.$store.dispatch(
          "Shapefiles/Getvect1",
          this.vect1_id
        );
        if (vect1Geojson) {
          let final = {
            geojson: vect1Geojson,
            id: this.vect1_id,
            name: this.vect1,
            level: 1,
          };
          this.$emit("filter_data", final);
          this.geojsons[1] = final;
          this.Show_Loading(false);
        }
      } catch (error) {
        Log("vect1 error", error);
        this.Show_Loading(false);
      }
    },
    //function to get sub region data
    async onSelectionvect2(val) {
      Log("region select 2", val);
      this.vect2 = val;
      try {
        this.Show_Loading(true);
        let vect2 = this.$store.getters["Shapefiles/getvect2"].filter((obj) => {
          return obj.name_2 === val;
        });
        if (vect2.length > 0) {
          this.vect2_id = vect2[0].id;
        }

        // Log("String options 2", vect2[0]);
        let vect2Geojson = await this.$store.dispatch(
          "Shapefiles/Getvect2",
          this.vect2_id
        );
        if (vect2Geojson) {
          let final = {
            geojson: vect2Geojson,
            id: this.vect2_id,
            name: this.vect2,
            level: 2,
          };
          this.$emit("filter_data", final);
          this.geojsons[2] = final;
        }
        this.Show_Loading(false);
      } catch (error) {
        Log("select feature vect2 error", error);
        this.Show_Loading(false);
      }
    },
    Show_Loading(show) {
      if (show) {
        return Loading.show({
          spinner,
          spinnerColor: "yellow",
          spinnerSize: 140,
          message: "Loading shape file",
          backgroundColor: "teal",
          messageColor: "white",
        });
      }
      return Loading.hide();
    },
    async getAdminLevel(id, i) {
      this.$Log("getAdminLevel level ", id, " i ", i);
      this.Show_Loading(true);

      if (i === 0) {
        //check if admin 0 is part of the result
        let admin = await this.$store.dispatch("Shapefiles/Getvect0", id);
        this.$Log("watch select features 0 ", admin.properties.name_0);
        await this.onSelectionvect0(admin.properties.name_0);
      }

      if (i === 1) {
        //check if admin 1 is part of the result
        let admin = await this.$store.dispatch("Shapefiles/Getvect1", id);
        this.$Log("watch select features 1", admin.properties.name_1);
        await this.onSelectionvect1(admin.properties.name_1);
      }

      if (i === 2) {
        //check if admin 2 is part of the result
        let admin = await this.$store.dispatch(
          "Shapefiles/Getvect2",
          id
        );
        this.$Log("watch select features 2 ", admin.properties.name_2);
        await this.onSelectionvect2(admin.properties.name_2);
      }
    },
    async onSelectionCustomVect() {
      try {
        this.Show_Loading(true);
        let customRegion = await this.$store.dispatch(
          "Shapefiles/getCustomGeojson",
          this.customShape.value
        );
        if (process.env.DEV)
          console.log("geojson onSelectionCustomVect ", customRegion);
        let final = {
          geojson: { ...customRegion },
          // id: customRegion.id,
          custom:true
        };
        this.Show_Loading(false);
        this.$emit("filter_data", final);
        
        if (process.env.DEV)
          console.log("geojson onSelectionCustomVect final ", final);
      } catch (error) {
        if (process.env.DEV)
          console.log("error getting onSelectionCustomVect ", error);
      }
    },
    getCheckBoxState(val) {
      if (!val) {
        this.customShape = "";
        return this.$store.dispatch("Shapefiles/StoreCurrentGeoJson", {
          empty: true,
        });
      }
    },
  },
};
</script>
