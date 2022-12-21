<template>
  <div class="q-mt-lg">
    <div class="q-gutter-y-md">
      <!-- <q-card height> -->
      <q-tabs
        dark
        v-model="tab"
        dense
        class="bg-primary text-white"
        active-color="yellow"
        indicator-color="yellow"
        align="justify"
        narrow-indicator
        @input="getTab"
      >
        <q-tab
          :disable="false"
          name="sdg"
          label="SDG 15.3.1"
          @mouseover="details('sdg')"
          
        />

        <q-tab name="ldh" :label="$t('tabs.ldh')" @mouseover="details('ldh')" />
        <q-tab
          name="forestchange"
          :label="$t('tabs.forestchange')"
          @mouseover="details('forestchange')"
           
        />
        <q-tab
          name="forestfires"
          :label="$t('tabs.forestfires')"
          @mouseover="details('forestfires')"
           
        />
        <q-tab name="medalus" label="Medalus" @mouseover="details('medalus')"  >
         
        
        </q-tab>
        <q-menu v-model="show" transition-show="scale"
          transition-hide="scale"
           anchor="top right"
          self="top left" >
            <div class="q-pa-xs" style="max-width:300px;" >
              {{ getCurrentSelected[overItem] }}
            </div>
        </q-menu>
      </q-tabs>

      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel class="tab-analysis" name="sdg">
          <SDG1531 :rasters="rasters" :currentTab="tab" />
        </q-tab-panel>
        <q-tab-panel class="tab-analysis" name="medalus">
          <Medalus :currentTab="tab" />
        </q-tab-panel>
        <q-tab-panel class="tab-analysis" name="ldh">
          <LDH :currentTab="tab" />
        </q-tab-panel>
        <q-tab-panel class="tab-analysis" name="forestchange">
          <ForestChange :rasters="rasters" :currentTab="tab" />
        </q-tab-panel>
        <q-tab-panel class="tab-analysis" name="forestfires">
          <ForestFires :rasters="rasters" :currentTab="tab" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
<script>
import { EventBus } from "src/Helpers/EventBus/eventBus.js";

export default {
  props: {
    rasters: {
      type: Array
    }
  },
  components: {
    //tabs component
    SDG1531: require("./TabComponents/Sdg1531/Sdg1531.vue").default,
    LDH: require("./TabComponents/LDH/LDH.vue").default,
    ForestChange: require("./TabComponents/ForestChange/ForestChange.vue")
      .default,
    ForestFires: require("./TabComponents/ForestFire/ForestFire.vue").default,
    Medalus: require("./TabComponents/Medalus/Medalus.vue").default
  },
  data() {
    return {
      // tab: "medalus",
      tab: "sdg",
      tabs: ["sdg", "ldh", "forestchange", "forestfires", "medalus"],
      gee: {},
      show: false,
      overItem: null
    };
  },
  watch: {
    getResultsTab(val, oldval) {
      if (val && val != oldval) {
        this.tab = val;
      }
    },
    selectedTab(val, oldval) {
      if (oldval != val) {
        this.$store.dispatch("Geotiffs/storeTiffFile", null);
      }
    }
  },
  computed: {
    selectedTab() {
      return this.tab;
    },
    getResultsTab() {
      let results = this.$store.getters["Results/getResults"];
      if (results) {
        this.$Log(" getResultsTab mounted tabs", results);
        let tab = results.args.currentTab;
        return tab;
      }
    },
    getCurrentSelected() {
      return {
        sdg: `As part of the Sustainable development Goals(SDGs), SDG 15 is to: “Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forest, combat desertification, and halt and reverse land degradation and halt biodiversity loss” Target 15.3 aims to: “By 2030, combat desertification, restore degraded land and soil, including land affected by desertification, drought, floods, and strive to achieve land degradation-neutral world`,
        ldh: `Land degradation hotsports (LDH) are produced via the analysis of time-series vegetation indices data and are used to characterize areas of different sizes, where the vegetation cover and the soil types are severely degraded.`,
        forestchange: `The quantification of the forest gain/loss hotspots will be based on pre-existing high-resolution global maps derived from Hansen Global Forest change dataset that can be accessed using Google Earth Engine API.The maps are produced from time-series analysis of Landsat images characterizing forest extent and change over time.`,
        forestfires: `Burnt areas and forest fires will be highlighted and mapped out form remotely sensed Landsat/Sentinel data using the Normalized Burn Ratio (NBR). NBR is designed to highlight burned areas and estimate burn severity. It uses near-infrared (NIR) and shortwave-infrared (SWIR) wavelengths. Before fire events, healthy vegetation has very high NIR reflectance and a low SWIR reflectance. In contrast, recently burned areas show low reflectance in the NIR and high reflectance in the SWIR band.`,
        medalus:
          "The Mediterranean Desertification and Land Use (MEDALUS) is the name of a project supported by Europe to assess, model and understand the desertification phenomena that increasingly affect the Mediterranean area. It provides a satisfied result about land degradation vulnerability."
      };
    }
  },
  methods: {
    getTab() {
      if (process.env.DEV) console.log(" selected tab");
      EventBus.$emit("clear_legends_and_charts", false);
    },
    details(tab) {
      // alert(this.getCurrentSelected[tab]);
      this.overItem = tab;
      this.show = true;
    }
  }
};
</script>
<style scoped>
.q-tab-panel {
  padding: 3px;
}

.tab-analysis {
  overflow-y: hidden;
  height: 100%;
}
</style>
