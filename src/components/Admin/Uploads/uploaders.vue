<template>
  <div class="row">
    <!-- <div class="col-xs-12 col-md-12"> -->
    <!-- <div class="row">
        <div class="col-md-4 col-xs-12">
          <q-card>
            <div class="bg-primary text-white text-center">
              <div class="text-subtitle1">
                {{ $t("admin_page.select_file_type") }}
              </div>
            </div>
            <q-card-section>
              <q-select
                @input="file_type_selection"
                v-model="file_type"
                :options="file_types"
                label="Select File"
              />
            </q-card-section>
          </q-card>
        </div>
        <div
          class="col-md-7 col-xs-12 sm_left"
          v-if="file_type === 'Shapefile'"
        >
          <q-card>
            <div class="bg-primary text-white text-center">
              <div class="text-subtitle1">
                {{ $t("admin_page.select_file") }}
              </div>
            </div>
            <q-card-section>
              <q-select
                v-model="shape_type"
                :options="[
                  { label: 'Shapefile', value: 'Shapefile' },
                  
                ]"
                label="GeoJson Data type"
              />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-md-4 col-xs-12 sm_left " v-if="file_type === 'Raster'">
          <q-card>
            <div class="bg-primary text-white text-center">
              <div class="text-subtitle1">
                {{ $t("admin_page.select_file") }}
              </div>
            </div>
            <q-card-section>
              <q-select v-model="option" :options="options" label="File" />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-md-3 col-xs-12  sm_left" v-if="file_type === 'Raster'">
          <q-card>
            <div class="bg-primary text-white text-center">
              <div class="text-subtitle1">{{ $t("admin_page.year") }}</div>
            </div>
            <q-card-section>
              <q-select v-model="year" :options="years" label="Year" />
            </q-card-section>
          </q-card>
        </div>
      </div> -->
    <!-- </div> -->
    <!-- <div class="col-xs-12 q-mt-sm" v-if="file_type === 'Raster'">
      <q-uploader
        url="http://localhost:4444/upload"
        label="Individual upload"
        multiple
        style="max-width: 300px"
      />
    </div> -->
    <div class="col-xs-12 q-mt-sm" v-if="shape_type === 'Shapefile'">
      <q-card>
        <div class="bg-primary text-white text-center">
          <div class="text-subtitle1">
            <!-- {{ $t("admin_page.select_file") }} -->
            Select zipped shapefile
          </div>
        </div>
        <q-card-section class="row">
          <div class="col-xs-12">
            <div
              class="q-pa-xs bg-red-5 text-center text-weight-bold text-white"
            >
              <span class="material-icons" style="font-size:15px;">
                error
              </span>
              Please ensure the shapefile has a single geometry and it is a
              valid shapefile
            </div>
          </div>
          <div class="col-xs-12">
            <div class="q-pa-sm">
              <input type="file" @change="checkType" />
            </div>
          </div>
          <div class=" col-xs-12">
            <div class="q-pa-xs">
              <q-input
                dense
                outlined
                v-model="shape_file_name"
                label="file name"
              />
            </div>
          </div>
          <div class="col-xs-12">
            <div class="q-pa-xs">
              <q-btn color="primary" @click="uploadFile" label="Upload" />
            </div>
          </div>
        </q-card-section>
        <div>
          <p
            :style="ValidGeoJson.valid ? `color:green;` : `color:red`"
            class="text-center"
          >
            {{ ValidGeoJson.message }}
          </p>
        </div>
      </q-card>
    </div>
    <div
      class="col-xs-12 q-mt-sm"
      v-if="shape_type && shape_type.value === 'GeoJson'"
    >
      <q-card>
        <div class="bg-primary text-white text-center">
          <div class="text-subtitle1">
            {{ $t("admin_page.select_geojson") }}
          </div>
        </div>
        <q-card-section>
          <q-input v-model="Geojson" filled type="textarea" />
        </q-card-section>
        <p
          :style="ValidGeoJson.valid ? `color:green;` : `color:red`"
          class="text-center"
        >
          {{ ValidGeoJson.message }}
        </p>
      </q-card>
    </div>
  </div>
</template>
<script>
import gjv from "geojson-validation";
import shp from "shpjs";
import { Log } from "src/Services/Logger";
import { positive, negative } from "src/Services/Notifications";
import { Loading, QSpinnerFacebook } from "quasar";
export default {
  props: {
    default_file: {
      type: String
    }
  },
  data() {
    return {
      shape_file_name: null,
      option: null,
      file_type: null,
      year: null,
      shape_type: "Shapefile",
      Geojson: null,
      file: null,
      isValidGeoJson: {},
      file_data: null
    };
  },
  computed: {
    d_file() {
      this.file_type = this.default_file;
      return this.default_file;
    },
    ValidGeoJson() {
      return this.isValidGeoJson;
    },
    years() {
      let currentYear = new Date().getFullYear();
      let year = [];

      let startYear = 1980;
      for (let i = startYear; i <= currentYear; i++) {
        year.push(startYear++);
      }
      return year.reverse();
    },
    file_types() {
      return ["Shapefile"];
    },
    label() {
      if (this.option)
        return `${this.$t("admin_page.uploader")} ${this.option.label}`;
      return `Click + icon  to Upload`;
    },
    options() {
      let types = this.$store.getters["RasterTypes/getRasterTypes"];
      let arr = [];
      if (types.length > 0) {
        types.forEach(type => {
          arr.push({
            label: this.$t(`admin_page.select_file_options.${type.name}`),
            value: type.id
          });
        });
      }
      return arr;
    }
  },
  watch: {
    immediate: true,
    Geojson: function(val, oldval) {
      this.ValidateGeoJson(val);
    },
    d_file(val, oldval) {}
  },
  methods: {
     Show_Loading(show) {
       const spinner =
  typeof QSpinnerFacebook !== "undefined"
    ? QSpinnerFacebook
    : Quasar.components.QSpinnerFacebook;
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
    checkType(ev) {
      let type = this.file_type;
      switch (type) {
        case "Shapefile":
          this.loadShapeFile(ev);
          break;
        case "Raster":
          this.loadRaster(ev);
          break;
        default:
          if (process.env.DEV) console.log(" loadShapeFile No handler");
      }
    },
    file_type_selection(input) {
      this.shape_type = null;
      this.isValidGeoJson = {};
    },
    loadShapeFile(ev) {
      let self = this;
      this.fileToArrayBuffer(ev).then(buffer => {
        shp(buffer)
          .then(function(geojson) {
            const isValid = self.ValidateGeoJson(geojson);
            if (process.env.DEV) console.log(" loadShapeFile success", isValid);
            if (isValid) {
              self.file_data = ev;
            } else {
              self.file_data = null;
            }
          })
          .catch(function(response) {
            if (process.env.DEV) console.log(response);
          });
      });
    },
    loadRaster(ev) {
      alert("Raster");
    },
    testJSON(val) {
      try {
        if (typeof val !== "string") {
          val = JSON.stringify(val);
        }
        let obj = JSON.parse(val);
        return { json: true, data: obj };
      } catch (error) {
        return false;
      }
    },
    fileToArrayBuffer(ev) {
      return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(ev.target.files[0]);
      });
    },
    ValidateGeoJson(data) {
      let val = this.testJSON(data);
      if (val.json) {
        if (gjv.valid(val.data)) {
          this.isValidGeoJson.valid = true;
          this.isValidGeoJson.message = "Valid GeoJson";
          if (process.env.DEV)
            console.log("loadShapeFile ================== valid", val);
          return true;
        } else {
          this.isValidGeoJson.valid = false;
          this.isValidGeoJson.message = "Invalid GeoJson";
          if (process.env.DEV)
            console.log("loadShapeFile ================== invalid", val);
          return false;
        }
      } else {
        this.isValidGeoJson.valid = false;
        this.isValidGeoJson.message = "Not valid Json Object";
        if (process.env.DEV)
          console.log("loadShapeFile ================== invalid", val);
        return false;
      }
    },
    async uploadFile() {
      try {
        if (!this.file_data)
          return negative("Please select valid shapefile zip");
            this.Show_Loading(true);
        let event = this.file_data;
        if (process.env.DEV) console.log(" uploadFile ", event.target.files[0]);

        let data = new FormData();
        let file = event.target.files[0];

        // data.append('shapefile', file)
        data.append(
          "shapefile_name",
          this.shape_file_name || file.name.split(".")[0]
        );
        data.append("shapefile", new Blob([file], { type: "application/zip" }));

     
        // return;
        await this.$axios.post("/api/customvect/", data, {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`
          }
        });
        this.$store.dispatch("Shapefiles/getCustomShapes");
          this.Show_Loading(false);
        positive("successfuly added your shapefile");
        this.shape_file_name = null
        this.file_data = null
      } catch (error) {
          this.Show_Loading(false);
       if(process.env.DEV) console.log("error ", error);
        negative("There was an error while uploading custom shapefile");
      }
    }
  }
};
</script>

<style scoped>
@media screen and (min-width: 1023px) {
  .sm_left {
    margin-left: 10px;
  }
}
@media screen and (max-width: 1023px) {
  .sm_left {
    margin-top: 10px;
  }
}
</style>
