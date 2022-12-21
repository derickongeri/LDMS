<template>
  <div class="row">
    <div class="q-mt-sm q-mb-sm">
      <slot></slot>
    </div> 
   <div class="q-mt-xs" v-if="currentTab != 'forestfires'">
       <label >Cached</label>
   <q-checkbox class="" @input="handleChecked" v-model="cached" />
   </div>
    <div class="q-mr-sm q-ml  q-mt-sm" v-if="showDownLoad">
      <q-icon
        @click="download_chart"
        size="29px"
        name="crop_original"
        color="green"
      >
        <q-tooltip>export chart as Image</q-tooltip>
      </q-icon>
    </div>
    <div class="q-mt-sm q-mb-sm" v-if="showDownLoad">
      <q-icon
        @click="downloadcsv"
        size="sm"
        name="fas fa-download"
        color="green"
      >
        <q-tooltip>Download CSV Data</q-tooltip>
      </q-icon>
    </div>
    <div class="q-mr-sm q-ml-sm q-mb-sm q-mt-xs" v-if="getTiff">
      <q-icon @click="downloadGeoTiff" size="md" name="save_alt" color="green">
        <q-tooltip>Download tiff</q-tooltip>
      </q-icon>
    </div>
  </div>
</template>

<script>
import JSZip from "jszip";
export default {
  props: {
    rasters: {
      type: Array
    },
    show_download: {
      type: Boolean,
      default: true
    },
    currentTab: {
      type: String,
      default: ""
    },
    forest_fire_selection: {
      type: Object
    }
  },
  data() {
    return {
      showing: false,
      cached:false,
    };
  },
  computed: {
    getTiff() {
      let Tiff = this.$store.getters["Geotiffs/getTiffFile"];
      return Tiff;
    },
    showDownLoad() {
      return this.show_download;
    }
  },
  mounted(){
     this.cached =true
    this.handleChecked(true)
  },
  methods: {
    handleChecked(val){
 this.$emit("get_cached_results",val);
    },
    downloadcsv() {
      this.$emit("downloadcsv");
    },
    download_chart() {
      this.$emit("download_chart");
    },
    async downloadGeoTiff() {
      // let fileURL = window.URL.createObjectURL(new Blob([this.getTiff.response]));
      let fileName = this.getTiff.geotiff_name;
      if (process.env.DEV) console.log("downloadGeoTiff getTiff", this.getTiff);

      const response = await this.$axios({
        url: this.getTiff.response.url, //your url
        method: "GET",
        responseType: "blob" // important
      });
      if (process.env.DEV)
        console.log("downloadGeoTiff response", response.data.type);
      const type = response.data.type;

      if (this.currentTab === "forestfires") {
        let result = await this.addSymbology(response);
        return;
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${fileName}.${type === "image/tiff" ? "tiff" : "zip"}`
      ); //or any other extension
      document.body.appendChild(link);
      link.click();
    },
    async addSymbology(response) {
      let self = this;
      const img_response = await this.$axios.get('/api/forest_fire_qml/');
      if(process.env.DEV ) console.log("image qml response", img_response.data.url);
      let qml = await fetch(img_response.data.url);
      let name = qml.url.split("/");
      if (process.env.DEV) console.log(qml.ok, " styles qml", name);
      qml = await qml.blob();
      if (process.env.DEV) console.log("styles qml", qml);
      let zip = new JSZip(); // inistantiate unzip lib
      let zip1 = new JSZip(); // inistantiate unzip lib
      let blob = new Blob([response.data]); //get blob of zipped image
      let raster_img = await zip.loadAsync(blob);
      let buff = await raster_img.file("download.nd.tif").async("arraybuffer");
      if (process.env.DEV) console.log("downloadGeoTiff buff", buff);

      const {
        prefire_start,
        prefire_end,
        postfire_start,
        postfire_end
      } = this.forest_fire_selection;

      zip1.file(
        `${this.getTiff.geotiff_name}_${prefire_start}_${prefire_end}_${postfire_start}_${postfire_end}.tiff`,
        buff,
        { blob: true }
      );
      zip1.file('Fire_Severity.qml',qml,{ blob: true })

      zip1.generateAsync({ type: "base64" }).then(function(content) {
        let link = document.createElement("a");
        console.log("contnt ", content);
        link.href = "data:application/zip;base64," + content;
        link.href = "data:application/zip;base64," + content;
        link.download = `${self.getTiff.geotiff_name}_${prefire_start}_${prefire_end}_${postfire_start}_${postfire_end}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  }
};
</script>

<style></style>
