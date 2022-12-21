<script>
import { Log } from "src/Services/Logger";
import { EventBus } from "src/Helpers/EventBus/eventBus.js";
import { download_chart } from "src/Download_Utils/Download_Chart";
import { downloadCSV } from "src/Download_Utils/Download_CSV";
import { positive, negative } from "src/Services/Notifications";
export default {
  methods: {
    async load_raster(classification, colors, raster) {
     if(process.env.DEV) console.log("load_raster details RenderRaster", classification, "colors ", colors, "raster ",raster);
      let raster_details = {};
      let base = raster.rasterfile.match(/^http[s]?:\/\/[^#?\/]+/)[0];
      let url = raster.rasterfile.substring(base.length); //extract /media/...
      raster_details.name = raster.name;
      raster_details.classification = classification;
      raster_details.colors = colors;
      //check if running in production or dev mode to know whick url to use
      if (process.env.DEV && raster_details.name !== "Forest Fire") {
        // raster_details.url = `steve${url}`;
          // raster_details.url = `http://10.1.60.103:1337/media/lulc20210609160809157665.tif`;
            raster_details.url = `${raster.rasterfile}`;
      } else {
        raster_details.url = `${raster.rasterfile}`;
      }
      EventBus.$emit("filter_raster", raster_details);
    },
    download_chart() {
      //used to name and create an image of the chart
      let name = `${this.selection.selection1}-${this.get_year}`;
      this.$Log("initial year years", this.get_year);
      this.$Log("initial year name", name);
      let chartImg = document.getElementById("mycanvas").toDataURL("image/jpg");
      download_chart(chartImg, name); //pass data to be downloaded located in /src/Download_Utils
    },
    downloadcsv() {
      //used to download csv
      let csv_data = [];
      this.PieData.data.forEach((data, i) => {
        csv_data.push({
          labels: this.PieData.labels[i],
          data: data
        });
      });
      //send data for parsing
      downloadCSV({
        filename: this.filename,
        data: csv_data
      });
    },
    check_if_within() {
      //uses turf.js to check if custom polygon is within a country
      const poly = this.get_admin0[this.get_admin0.length - 1];
      let result;
      if(process.env.DEV)console.log(" this.current_geojson +++++++",this.current_geojson);
      let coords = []
     if(this.current_geojson.geometry){
        coords = this.current_geojson.geometry.coordinates[0];
     }else{
       return true
     }
      for (let i = 0; i < coords.length; i++) {
        const within = turf.inside(coords[i], poly);
        this.$Log("Coordinate ", within);
        if (!within) {
          this.dismissed = negative(
            `Polygon must be within the selected country (${poly.properties.name_0})`
          );
          result = false;
          break;
        } else {
          if (this.dismissed && typeof this.dismissed === "function") {
            this.dismissed();
          }
          result = true;
        }
      }
      return result;
    }
  }
};
</script>
