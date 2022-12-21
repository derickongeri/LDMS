<template>
  <div class="q-pa-sm row">
    <div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
      <q-card class="q-pa-xs">
        <q-card-section class="bg-primary text-white q-pb-none">
          <div class="text-p">{{ $t("maps.selectcountry") }}</div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-xs-12">
              <SelectFeatures @filter_data="filter_geoJson($event)" />
              <!-- Select feature component takes features and emits single feature selected  -->
            </div>
          </div>
          <div></div>
        </q-card-section>
      </q-card>

      <Tabs :rasters="tiffs" />
      <Logos v-if="$q.platform.is.desktop" />
    </div>

    <div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 ">
      <div id="mapid"></div>
      <div class="q-mt-sm">
        <Logos v-if="$q.platform.is.mobile" />
      </div>
    </div>
  </div>
</template>
<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw-src.css";
// import shp from "shpjs";
import GeoTIFF from "geotiff";
import geoblaze from "geoblaze";
import parse_georaster from "georaster";
import {
  renderGeoraster,
  renderForestGeoraster
} from "src/RasterDataForrmatters/RasterRenderer";
import { Loading, QSpinnerGears } from "quasar";
import { defaultIcon } from "../../Helpers/Markers_Icons/Marker.js";
import { colors } from "../../colors/colors";
import "../../Helpers/MapProviders/leaflet-providers.js";
import "leaflet-draw";
import "leaflet-side-by-side";
import { EventBus } from "src/Helpers/EventBus/eventBus.js";
import JSZip from "jszip";
import { negative } from "src/Services/Notifications.js";
import { convertToDMS } from "src/Services/LatLngToDeg";
import { download_chart } from "src/Download_Utils/Download_Chart";
export default {
  components: {
    SelectFeatures: require("../../components/Select_Features").default,
    Tabs: require("../../components/Tabs").default,
    DraggableDiv: require("../../components/Legend/Legend").default,
    Logos: require("src/components/MainLogos/Logos.vue").default
  },
  data() {
    return {
      coords: null,
      map: null,
      osm: null,
      overlays: {}, //object holding overlay data to be added in the layer control
      tiffs: [], //holds tiff file names that will be iterrated over during network fetch operation
      boundaries: [], //array storing the features extracted from geojson from the shape file
      geo: null, //holds the geoJson information processed from  shape file
      feature: null, //holds filtered geoJson feature/ location
      raster_layers: [], //stores the processed raster layers
      view_coords: [20.965348, 12.453222],
      gloal_georaster: null, //just putting current georaster to state for consumption it getting values
      data: [], //holds legend data
      colors: [], //holds legend colors
      legendTitle: null, //holds legend title
      legend: null, //instance of leaflet legend
      swapctl: null, //instance of swap button control
      raster_index: null,
      editableLayers: null, //geojson function
      sideByside: null, //holds sideby side instance
      current_raster: null,
      swapState: "swap", // name of the swap control button on map
      show_swap: false, //determines if we should show the side by side swap or analized raster layer
      leftYearControl: null, //holds the left year control swap
      rightYearControl: null, //holds the right year control swap
      years: [], //set swap years
      raster_details: {}
    };
  },
  computed: {
    getEmailResultID() {
      const EmailedTaskID = this.$store.getters["Results/getEmailTaskID"];
      return EmailedTaskID;
    },
    legendData() {
      return {
        title: this.legendTitle,
        data: this.data,
        colors: this.colors
      };
    },
    north() {
      return require("assets/images/north.png");
    },
    getViewportSize() {
      let e = window;
      let a = "inner";
      if (!("innerWidth" in window)) {
        a = "client";
        e = document.documentElement || document.body;
      }
      return { width: e[a + "Width"], height: e[a + "Height"] };
    }
  },
  methods: {
    async download_chart() {
      let mapElement = document.getElementById("mapid");
      if (this.$q.platform.is.desktop && this.getViewportSize.width > 1919) {
        mapElement.style.position = "relative";
        mapElement.style.top = "0px";
        mapElement.style.height = "109%";
      }
      if (
        this.$q.platform.is.desktop &&
        this.getViewportSize.width > 1023 &&
        this.getViewportSize.width < 1919
      ) {
        mapElement.style.position = "relative";
        mapElement.style.top = "0px";
        mapElement.style.height = "60%";
      }

      const dataURL = await domtoimage.toPng(mapElement, {
        width: mapElement.width,
        height: mapElement.height
      });

      let link = document.createElement("a");
      link.setAttribute("href", dataURL);
      link.setAttribute("download", this.legendTitle);
      document.body.appendChild(link); // Required for FF
      link.click();
      document.body.removeChild(link);
      if (this.getViewportSize.width > 1919) {
        mapElement.style.top = "80px";
        mapElement.style.position = "fixed";
        mapElement.style.height = "90%";
      }
      if (
        this.getViewportSize.width > 1023 &&
        this.getViewportSize.width < 1920
      ) {
        mapElement.style.top = "80px";
        mapElement.style.position = "fixed";
        mapElement.style.height = "86%";
      }
      if (this.getViewportSize.width < 1023) {
        mapElement.style.height = "400px";
      }
    },
    Remove_Controls_and_Layers() {
      if (this.swapctl) {
        //remove swap control button
        this.map.removeControl(this.swapctl);
      }
      if (this.legend) {
        //remove legend control button
        this.map.removeControl(this.legend);
      }
      if (this.legendTitle?.includes("Land Cover Change")) {
        //check if Land Cover Change
        this.swapState = "swap";
        this.addSwap(); //add button to swap for lulc change
      }
      if (this.sideByside !== null) {
        // this.$Log("sideByside remove: ", this.sideByside);
        this.map.removeControl(this.sideByside);
      }
      if (this.rightYearControl) {
        this.map.removeControl(this.rightYearControl);
      }
      if (this.leftYearControl) {
        this.map.removeControl(this.leftYearControl);
      }
    },
    async filter_raster(raster_details) {
   if(process.env.DEV) console.log("raster_details 188", raster_details);
      this.raster_details = { ...raster_details };
      //receiver function of the emmitted raster index in the  tiff array holding the tiff array
      this.data = raster_details.classification; //set values for the raster
      this.colors = raster_details.colors; //set colors
      for (let i = 0; i < this.raster_layers.length; i++) {
        this.map.removeLayer(this.raster_layers[i]);
      }
      if (raster_details.noRaster) return;
      let layer = await this.getTiff(raster_details); //get raster and render
      if (layer === undefined) return; // to catch failed to pull tiff from api
      this.overlays[raster_details.name] = layer;
      
       this.overlays[raster_details.name].addTo(this.map);
       Loading.hide(); //disable loading
      this.legendTitle = raster_details.name;
      this.Remove_Controls_and_Layers();
      this.addlegend(raster_details); //populate legend
    },
    filter_geoJson(dataObj) {
      if(process.env.DEV) console.log("received geojson object ", dataObj);
    
      let data = dataObj.geojson;
      this.editableLayers.removeLayer(this.geo);
      if (data === 0) {
        this.map.removeLayer(this.feature);
        this.map.setView(this.view_coords, 4);
        return;
      }

      if (this.map.hasLayer(this.feature)) {
        this.map.removeLayer(this.feature);
      }
      let styles = {
        color: "black",
        // "weight": 5,
        fillColor: "none",
        opacity: 1
      };
      this.feature = L.geoJSON(data, styles, {
        onEachFeature: function popUp(f, l) {
          var out = [];
          if (f.properties) {
            for (var key in f.properties) {
              out.push(key + ": " + f.properties[key]);
            }
            l.bindPopup(out.join("<br />"));
          }
        }
      });
      if(dataObj.custom){
                 let geometry ={}
           geometry = {...dataObj.geojson.geometry?.geometries[0]}
           if(process.env.DEV) console.log("c ustome ====== ", geometry);
  
        this.$store.dispatch("Shapefiles/StoreCurrentGeoJson", geometry);
      }else{
        this.$store.dispatch("Shapefiles/StoreCurrentGeoJson", dataObj);
      }
     if(process.env.DEV) console.log("feature ====== ", this.feature.toGeoJSON());
     if(process.env.DEV) console.log("Get the map here  ", this.map);
      this.feature.addTo(this.map);
      this.map.fitBounds(this.feature.getBounds(), { padding: [50, 50] });
    },
    async getTiff(tiff) {
    
      try {
        Loading.show({
          spinner: QSpinnerGears,
          message: "Loading and Rendering Raster Image"
        });
         if(process.env.DEV)console.log("gettiff request ", tiff);
        let response = await fetch(tiff.url);
        this.$Log("gettiff response ", response);
        if (!response.ok) {
          //check response from server
          throw "error: failed to get tiff";
          return;
        }

        let geotiff_name = tiff.name;
        //store the tiff response in store to facilitate download
        this.$store.dispatch("Geotiffs/storeTiffFile", {
          response,
          geotiff_name
        });
        let arrayBuffer = null; //create arrayBuffer to be used to hold tiff buffer
        //code below is used to pull raster image from GEE
        if (tiff.name === "Forest Fire") {
          //forest fire is from gee
          let new_zip = new JSZip(); // inistantiate unzip lib
          let blob = await response.blob(); //get blob of zipped image
          let raster_img = await new_zip.loadAsync(blob); //un
          let buff = await raster_img
            .file("download.nd.tif")
            .async("arraybuffer");
          arrayBuffer = buff;
        } else {
          arrayBuffer = await response.arrayBuffer(); // buffer of tiff from our servers
        }
        let georaster = await parseGeoraster(arrayBuffer);
        this.gloal_georaster = georaster;
        let layer = renderGeoraster(
          geotiff_name,
          georaster,
          this.data,
          this.colors
        );

        this.current_raster = layer; //keep curret layer in vue instance
        // if (!this.swapctl)
        this.current_raster.addTo(this.map); //add layer to map
        this.current_raster.bringToFront(); //ensure the layer is top most
       
        this.raster_layers.push(layer); //push the layer to array, will come in handly when usinng swap
       Loading.hide()
       return layer;
      } catch (error) {
       if(process.env.DEV)console.log("get tiff error ", error);
        negative(
          "Failed to load tiff image, please check if download manager is active then disable and try again",
          0
        );
        Loading.hide();
      }
    },
    addlegend(details) {
      
      if (process.env.DEV) console.log(" addlegend details ", details);
      if (this.legend) {
        if (process.env.DEV)
          console.log(this.legend, " addlegend details ", details.name);

        this.map.removeControl(this.legend); //destroy legend everytime new data come in
      }
      this.legend = L.control({
        position: "bottomright",
        name: this.legendTitle
      });
      let self = this; //pass vue instance to leaflet
      this.legend.onAdd = function(map) {
        //create legend based on data, translatios have been included
        let div = L.DomUtil.create("div", "legend");
        div.innerHTML += `<div v-html> <q-btn color="secondary" label="Secondary" /> </div >`;
        div.innerHTML += `<h4>${self.legendTitle}</h4>`;
        for (let i = 0; i < details.colors.length; i++) {
          div.innerHTML +=
            '<i style="background:' +
            self.colors[i].color +
            '"></i><span>' +
            self.$t(`legend.${details.colors[i].value}`) +
            "</span><br>";
        }
        let draggable = new L.Draggable(div); //the legend can be dragged around the div
        draggable.enable();
        return div;
      };
      this.legend.addTo(this.map);
      //update map title
      let title = document.querySelector(".map_title input");
      title.value = self.legendTitle;
    },
    //show swap button as part of map control layer
    addSwap() {
      let self = this;
      //add swap 
      if (this.swapctl) {
        this.map.removeControl(this.swapctl);
      }
      // L.Control.SwaPControl = L.Control.extend({
      this.swapctl = L.control({
        position: "topright"
      });
      this.swapctl.onAdd = function() {
        let el = L.DomUtil.create("div", "swapbutton");
        el.innerHTML = `<input id="ShowButton" type="button" value="Compare LULC">`;
        L.DomEvent.addListener(
          el,
          "click",
          function(event) {
            this.show_swap = !this.show_swap;
            if (self.swapState === "swap") return self.getLayersRasters();
            self.raster_layers.forEach(layer => {
              self.$Log("layer forEach ", layer.options.geotiff_name);
              if (layer.options.geotiff_name.includes("Land Cover Change")) {
                self.$Log("layer ", layer.options.geotiff_name);
                layer.bringToFront();
                self.map.removeControl(self.rightYearControl);
                self.map.removeControl(self.sideByside);
                self.map.removeControl(self.leftYearControl);
                document.querySelector("#ShowButton").value = "Compare LULC";
                if (process.env.DEV)
                  console.log("self.raster_details ", self.raster_details);
                self.legendTitle = self.raster_details.name;
                self.addlegend({
                  name: "LULC classification",
                  colors: self.raster_details.colors,
                  classification: self.raster_details.classification
                }); //populate legend
              }
              if (this.show_swap) {
                document.querySelector("#ShowButton").value =
                  "Show LULC change";
                self.swapState === "swap";
                self.leftYear(self.years[1]);
                self.rightYear(self.years[0]);
                self.show_sideBySide();
                layer.bringToFront();
                self.$Log("layer swapped ", this.show_swap);
              }
            });
          }
          // el
        );
        return el;
      };
      this.swapctl.addTo(this.map);
    },
    leftYear(year) {
      let self = this;
      //add swap functionality
      if (this.leftYearControl) {
        this.$Log("0000000000000 Left", year);
        this.map.removeControl(this.leftYearControl);
      }
      // L.Control.SwaPControl = L.Control.extend({
      this.leftYearControl = L.control({
        position: "topleft"
      });
      this.leftYearControl.onAdd = function() {
        let el = L.DomUtil.create("div");
        el.innerHTML = `<div class="showYears">
        <p style="padding:10px;"> LULC-${year}</p>
        </div>`;
        return el;
      };
      this.leftYearControl.addTo(this.map);
    },
    rightYear(year) {
      let self = this;
      //add swap functionality
      if (this.rightYearControl) {
        this.map.removeControl(this.rightYearControl);
      }
      // L.Control.SwaPControl = L.Control.extend({
      this.rightYearControl = L.control({
        position: "topright"
      });
      this.rightYearControl.onAdd = function() {
        let el = L.DomUtil.create("div");
        el.innerHTML = `<div class="showYears" style='margin-top: 100px;'>
        <p style="padding:10px;">  LULC-${year}</p>
        </div>`;
        return el;
      };
      this.rightYearControl.addTo(this.map);
    },
    async getLayersRasters() {
      const extras = this.$store.getters["RasterTypes/getSwapObject"];
      this.years = Object.keys(extras.rasters);
      const rasterUrls = Object.values(extras.rasters);
      this.$Log("getLayersRasters ", this.years, " ", rasterUrls);
      this.colors = [
        {
          color: "#0046c8",
          number: 1,
          value: "Water"
        },
        {
          color: "#fff5d7",
          number: 2,
          value: "Bareland"
        },
        {
          color: "#d7191c",
          number: 3,
          value: "Artificial"
        },
        {
          color: "#33e9f6",
          number: 4,
          value: "Wetland"
        },
        {
          color: "#f2fc83",
          number: 5,
          value: "Cropland"
        },
        {
          color: "#8ca000",
          number: 6,
          value: "Grassland"
        },
        {
          color: "#003c00",
          number: 7,
          value: "Forest"
        }
      ];
      this.data = [1, 2, 3, 4, 5, 6, 7];
      for (const [index, value] of rasterUrls.entries()) {
        await this.getTiff({
          url: value,
          name: `swap-${this.years[index]}`
        });
      }

      this.show_sideBySide();
      this.swapState = "Revert";
      this.addSwap(); //rebuild button with updated label
      this.leftYear(this.years[1]);
      this.rightYear(this.years[0]);
    },
    show_sideBySide() {
      //**code commented out below is for swap functionality**
      if (this.sideByside !== null) {
        // this.$Log("sideByside remove: ", this.sideByside);
        this.map.removeControl(this.sideByside);
      }
      this.sideByside = L.control.sideBySide(
        this.raster_layers[this.raster_layers.length - 2], //left
        this.raster_layers[this.raster_layers.length - 1] //right
      );
      this.legendTitle = "LULC classification";
      this.addlegend({
        name: "LULC classification",
        colors: this.colors,
        classification: this.data
      }); //populate legend
      this.sideByside.addTo(this.map);
    },
    title_change(val) {
      if(!val){
          //update map title
      let title = document.querySelector(".map_title input");
      title.value = this.legendTitle;
      };
    }
  },

  async mounted() {
    let self = this;
    EventBus.$on("filter_raster", raster_details => {
      // we listen to events fron renderRaster Mixin
      this.filter_raster(raster_details);
    });
    // we listen to events fron request analysis then destroy current legend and charts
    EventBus.$on("clear_legends_and_charts", value => {
      if (process.env.DEV)
        console.log("clear_legends_and_charts", this.overlays);
      const map_title = document.getElementsByClassName("map_title");
      if (value) {
        map_title[0].style.visibility = "visible";
      } else {
        this.Remove_Controls_and_Layers();
        map_title[0].style.visibility = "hidden";
        Object.keys(this.overlays).forEach(key => {
          this.map.removeLayer(this.overlays[key]);
        });
      }
    });
    //create map tiles
    let osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
      }
    );
    this.osm = osm;
    let mapboxSatellite = L.tileLayer.provider("MapBox", {
      id: "mapbox/satellite-v9",
      accessToken:
        "pk.eyJ1IjoiY2hyaXNiYXJ0IiwiYSI6ImNrZTFtb3Z2bDAweTMyem1zcmthMGY0ejQifQ.3PzoCgSiG-1-sV1qJvO9Og"
    });
    let mapbox = L.tileLayer.provider("MapBox", {
      id: "mapbox/streets-v11",
      accessToken:
        "pk.eyJ1IjoiY2hyaXNiYXJ0IiwiYSI6ImNrZTFtb3Z2bDAweTMyem1zcmthMGY0ejQifQ.3PzoCgSiG-1-sV1qJvO9Og"
    });
    let Stamen = L.tileLayer.provider("Stamen.Watercolor");
    //create geojson onject to hold properties of each feature

    //create the map and add the initial map tile layer, also set zoom
    let bounds = new L.LatLngBounds(
      new L.LatLng(40.31304321, -28.828125),
      new L.LatLng(13.39257927, 45.92772694)
    );

    this.map = L.map("mapid", {
      center: bounds.getCenter(),
      minZoom: 4.4,
      maxZoom: 17,
      zoom: 4.5,
      layers: [osm],
      // maxBounds: null,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0
    });
    //create basemap object to hold all the map tiles from the provider
    let baseMaps = {
      OpenStreetMap: osm,
      MapBox: mapbox,
      MapBoxSatellite: mapboxSatellite,
      Stamen: Stamen
    };
    
    let title = L.control({ position: "topright" });
    title.onAdd = function(map) {
      let div = L.DomUtil.create(
        "div",
        "map_title text-white float-left dynamic_content"
      );
      div.innerHTML = `<span  class="tooltip">
      <i class="fas fa-info-circle q-ml-xs"></i>
        <span class="tooltiptext">You can edit the title, to revert just delete your input</span>
      </span> <input  id="title_input" type="text" value="title" style="border:none;width:250px">`;
      L.DomEvent.addListener(div, "change ", function(event) {
        self.title_change(event.target.value);
      });
      return div;
    };
    title.addTo(this.map);
    // add the basemaps to the controls
    L.control.layers(baseMaps).addTo(this.map);
    //add scale to map
    L.control.scale().addTo(this.map);
    //add north arrow
    let north = L.control({ position: "bottomleft" });
    north.onAdd = function(map) {
      let div = L.DomUtil.create("div", "north");
      div.innerHTML = `<img src=${self.north} style="width:40px; height:40px;">`;
      return div;
    };

    north.addTo(this.map);

    //we add the polygon draw feature to map as seen  below
    this.editableLayers = new L.FeatureGroup();
    this.map.addLayer(this.editableLayers);
    let options = {
      position: "topleft",
      draw: {
        polyline: false,
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          showArea: true,
          drawError: {
            color: "#e1e100", // Color the shape will turn when intersects
            message: "<strong>Oh snap!<strong> you can't draw that!" // Message that will show when intersect
          },
          shapeOptions: {
            color: "black",
            fillColor: "none"
          }
        },
        circle: false, // Turns off this drawing tool
        rectangle: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: this.editableLayers, //REQUIRED!!
        edit: true
      }
    };
    let drawControl = new L.Control.Draw(options);
    this.map.addControl(drawControl);
    let prev; //create variable to hold current layer
    this.map.on("draw:drawstart", function(e) {
      //when we start drawing we remove the previous polygon
      self.$Log("L.EditToolbar.Delete ", L.EditToolbar.Delete);
      self.editableLayers.removeLayer(prev); //removes previous polygon
      EventBus.$emit("clear_legends_and_charts", false);
    });
    this.map.on("draw:editmove", function(e) {
      self.$Log("draw:deletestart", e); //removes previous polygon
    });
    this.map.on("draw:deleted", function(e) {
      self.$Log("draw:deletestart dispatched");
      self.$store.dispatch("Shapefiles/StoreCurrentGeoJson", { empty: true }); //we add empy boolean so that analysis watcher wont trigger requests if geojson is empty
    });

    this.map.on(L.Draw.Event.CREATED, function(e) {
      let type = e.layerType,
        layer = e.layer;
      self.$Log(
        "draw start ",
        L.GeometryUtil.geodesicArea(layer.getLatLngs()[0])
      );
      layer
        .bindTooltip(
          `${(
            L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]) / 10000
          ).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })} ha`,
          { permanent: false, sticky: true }
        )
        .openTooltip(); //add area in ha to the draw polygon
      if (type === "polygon" || type === "rectangle") {
        self.geo = layer;
        self.map.removeLayer(self.feature);
        let geojson = {};
        geojson = { ...layer.toGeoJSON() }; //convert the polygon to geojson
        geojson.area = Math.floor(
          L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]) // add area to the custom_geojson object
        );
        self.$store.dispatch("Shapefiles/StoreCurrentGeoJson", geojson); //store geojson in store to be used globally
        self.$Log("current_geojson_only", JSON.stringify(geojson));
        prev = layer; //assign prev the current layer
      }

      self.editableLayers.addLayer(self.geo); // add the polygon to map
    });
    //bring raster to the top whenever basemap chnages, e.g osm to mapbox
    this.map.on("baselayerchange", function(e) {
      self.$Log("Layer in basechange ", self.raster_layers);
      if (self.raster_layers.length > 0) {
        self.current_raster.bringToFront(); //current_raster can be tracked and brought to front
      }
    });

    // get value of pixel when right clicked
    let marker = null;
    this.map.on("contextmenu", e => {
      if (marker) {
        //remove marker when new click event is raised
        this.map.removeLayer(marker);
      }
      const latlng = [e.latlng.lng, e.latlng.lat]; //we get the latlong values
      // results is an array, which each item representing a separate band
      const results = geoblaze.identify(this.gloal_georaster, latlng); // we use geoblaze to identify values
      if (results !== null) {
        let num = this.colors.filter(color => {
          return color.number === results[0];
        });
        if (this.legendTitle === "Forest Fire") {
          if (results[0] >= -500 && results[0] <= -101)
            num = [{ color: "#768833", value: "Enhanced Regrowth" }];
          if (results[0] >= -100 && results[0] <= 99)
            num = [{ color: "#0ce244", value: "Unburned" }];
          if (results[0] >= 100 && results[0] <= 269)
            num = [{ color: "#f5fe0c", value: "Low Severity" }];
          if (results[0] >= 270 && results[0] <= 659)
            num = [{ color: "#fa671a", value: "Moderate Severity" }];
          if (results[0] >= 660 && results[0] <= 1300)
            num = [{ color: "#a500d2", value: "High Severity" }];
        }
        this.$Log("popup mapclick", results, " ", this.colors, " latlng ", num);
        marker = L.marker([e.latlng.lat, e.latlng.lng], {
          icon: defaultIcon
        })
          .addTo(self.map)
          .bindPopup(
            `
             ${
               num.length > 0 ? this.$t(`legend.${num[0].value}`) : ""
             }(${results}),
            ${num.length > 0 ? convertToDMS([e.latlng.lat, e.latlng.lng]) : ""}`
          )
          .openPopup(); // show popup with pixel value at the location clicked, good for visual confirmation
      }
    });
    //remove marker when left clicked
    this.map.on("click", e => {
      if (marker) {
        this.map.removeLayer(marker);
      }
    });
    let map = this.map;
    L.Control.MyControl = L.Control.extend({
      onAdd: function() {
        var el = L.DomUtil.create("div", "my-control");
        el.innerHTML = `<span class="material-icons" style='font-size:20px;color:grey;'>info</span>
        <a href="https://misland.readthedocs.io/en/latest/Service/Service_Guide.html#misland-service-tour"  target="_blank" >${self.$t(
          "guide_link"
        )}</a>`;
        return el;
      }
    });
    //add guid link on pan
    L.control.myControl = function(opts) {
      return new L.Control.MyControl(opts);
    };
    L.control
      .myControl({
        position: "topright"
      })
      .addTo(map);

    L.Control.MyControl = L.Control.extend({
      onAdd: function() {
        var el = L.DomUtil.create("div", "download_map");
        el.innerHTML = `<button><i class="fa fa-arrow-down" style='font-size:20px;color:grey;' aria-hidden="true"></i>
        </button>`;
        L.DomEvent.addListener(el, "click", function(event) {
          self.download_chart();
        });
        return el;
      }
    });
    //add guid link on pan
    L.control.myControl = function(opts) {
      return new L.Control.MyControl(opts);
    };
    L.control
      .myControl({
        position: "topleft"
      })
      .addTo(map);
  }
};
</script>

<style>
@media screen and (min-width: 1024px) and (max-width: 1919px) {
  #mapid {
    height: 86%;
    width: 58vw;
    top: 80px;
    bottom: 0;
    position: fixed;
  }
  .map_title {
    top: 0px;
    font-size: 15px;

    z-index: 0;
    background-color: grey;
    transform: translate(-230px);
  }
}
@media screen and (min-width: 1920px) {
  #mapid {
    height: 91%;
    width: 58vw;
    top: 80px;
    bottom: 0;
    position: fixed;
  }
  .map_title {
    top: 0px;
    font-size: 15px;

    z-index: 0;
    background-color: grey;
    transform: translate(-350px);
  }
}
.my-control {
  border-radius: 10px;
}
.my-control a {
  text-decoration: none;
  font-size: 12px;
}
@media screen and (max-width: 1023px) {
  #mapid {
    height: 400px;
    margin-top: 10px;
  }
}
/*Legend specific*/
.legend {
  font: 14px Arial, Helvetica, sans-serif;
  background-color: #66b2b2;
  color: rgb(15, 7, 7);
  min-width: 100px;
}
.legend h4 {
  text-align: center;
  font-size: 14px;
  color: rgb(0, 0, 0);
  line-height: 0px;
}

.legend span {
  position: relative;
  font-size: 10px;
  bottom: 3px;
}

.legend i {
  width: 27px;
  height: 10px;
  float: left;
  margin: 0 2px 0 0;
  opacity: 0.7;
  font-size: 9px;
}
.q-panel > div {
  height: 65vh;
  width: 100%;
  z-index: 1;
}
.my-control {
  background: #fff;
  padding: 5px;
  position: relative;
}
.showYears {
  height: 40px;
  text-align: center;
  font-weight: 600;
  font-size: 20px;
  background: white;
}
#ShowButton {
  padding: 10px;
  background: #fff;
  border-color: none;
  border-radius: 10px;
}

/* tool tip css */

.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 270px;
  background-color: rgb(92, 80, 80);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  top: 25px;
  left: 15%;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
