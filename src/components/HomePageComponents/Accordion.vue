<template>
  <div class="q-pa-xs row">
    <q-tree
      class="col-sm-4"
      :nodes="simple"
      accordion
      node-key="label"
      :expanded.sync="expanded"
      :selected.sync="selected"
      @update:selected="getSelected"
    >
      <template v-slot:default-header="prop">
        <div class="row items-center">
          <div class="text-weight-bold text-primary">{{ prop.node.label }}</div>
        </div>
      </template>
    </q-tree>
    <div class="col-sm-7 q-ml-md">
      <span v-if="selected">
      <div class="text-subtitle2">{{ selected }} OverView</div>
        <q-separator  />
      </span>
      <div>{{ summary }}</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selected: "Land Degradation",
        old_target_val: null,
      summary: null,
      expanded: ["Land Degradation"],
      simple: [
        {
          label: "Land Degradation",

          children: [
            {
              label: "SDG15.3.1 Indicator",
              children: [
                {
                  label: "Productivity",
                  children: [
                    { label: "Trajectory" },
                    { label: "State" },
                    { label: "Performance" }
                  ]
                },
                {
                  label: "Landcover",
                  children: [
                    { label: "Land Cover" },
                    { label: "Land Cover Change" }
                  ]
                },
                {
                  label: "Carbon-stocks",
                  // children: [
                  //   {
                  //     label: "Carbon Stock Change"
                  //   }
                  // ]
                }
              ]
            },
            { label: "Vegetation Loss" },
            {
              label: "Forest Change",
              children: [{ label: "Forest Gain/Loss" }]
            },
            { label: "Forest Fires" }
          ]
        }
      ]
    };
  },
  mounted(){
   this.getSelected(this.selected) 
  },
  methods: {
    getSelected(target) {
    
      if (target && this.getCurrentSelected.hasOwnProperty(target)) {
        this.$Log("selected ", target);
        this.summary = this.getCurrentSelected[target];
        this.old_target_val = this.selected
      }else{
        this.selected =this.old_target_val
      }
    }
  },
  computed: {
    getCurrentSelected() {
      return {
        "Land Degradation": `Land degradation, as defined by the United Nations Convention to Combat Desertification (UNCCD), is a complex process that refers to the long-lasting reduction or loss of biological and economic productivity of lands, caused by human activities, sometimes exacerbated by natural phenomena. Terrestrial vegetation including crops depend on appropriate soil which is the substrate on which vegetation/crops grow, besides other climatic factor requirements.`,
        "SDG15.3.1 Indicator": `As part of the Sustainable development Goals(SDGs), SDG 15 is to: “Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forest, combat desertification, and halt and reverse land degradation and halt biodiversity loss” Target 15.3 aims to: “By 2030, combat desertification, restore degraded land and soil, including land affected by desertification, drought, floods, and strive to achieve land degradation-neutral world
        The indicator used to assess the progress of each SDG target is the 15.3.1 indicator: “Proportion of land that is degraded over total land area’’`,
        "Productivity":`Land productivity is the biological productive capacity of the land (i.e. the ability to produce food, fibre and fuel that sustain life). For easy interpretation the annual mean vegetation indices values at the pixel level will be used to assess three measures of change (trajectory, state and performance)`,
        "Trajectory":`The rate of change in primary productivity over time which will be computed using linear regression at the pixel level for various Landsat derived vegetation indices (NDVI, MSAVI2, SAVI). To identify areas experiencing changes in the primary productivity, a non-parametric significance test will be performed to show the significant changes (p-value of 0.05). Positive significant trends in the vegetation indices will indicate potential improvement while a negative significant trend will indicate potential degradation.`,
        "State":`The Productivity State indicator will be used to show recent changes in primary productivity compared to a baseline period. The indicator is computed from (NDVI, MSAVI2, SAVI) derived from medium resolution Landsat imagery `,
        "Performance":`The Productivity Performance indicator will measure the local productivity relative to other similar vegetation types in similar ecological units. A combination of soil units (based on Soil Grids data at 250m resolution) and land cover (ESA CCI at 300m resolution) will be used to define the ecological units`,
        "Landcover":`Monitoring of Land Use and Land Cover Changes (LULCCs) at both regional and local scales presents a major opportunity for identifying areas threatened by land degradation where mitigation measures should be taken. Traditionally, LULCCs have been interpreted by distinguishing between two transformation types: conversion and modification.
        To assess changes in land cover users need land cover maps covering the study area for the baseline and target years. These maps need to be of acceptable accuracy and created in such a way which allows for valid comparisons. LDMS uses ESA CCI land cover maps as the default dataset, but local maps can also be used`,
      "Carbon-stocks":`The third sub-indicator for monitoring land degradation as part of the SDG process quantifies changes in soil organic carbon (SOC) over the reporting period. Changes in SOC are particularly difficult to assess for several reasons, some of them being the high spatial variability of soil properties, the time and cost intensiveness of conducting representative soil surveys and the lack of time series data on SOC for most regions of the world. To address some of the limitations, a combined land cover/SOC method is used in LDMS to estimate changes in SOC and identify potentially degraded areas.`,     
      "Vegetation Loss" :`Land degradation hotsports (LDH) are produced via the analysis of time-series vegetation indices data and are used to characterize areas of different sizes, where the vegetation cover and the soil types are severely degraded.
Vegetation loss/gain hotspots will be calculated based on time series observation of selected suit of vegetation indices depending on the climatic zones and terrain morphology of the North African countries`,
     "Forest Change":`The quantification of the forest gain/loss hotspots will be based on pre-existing high-resolution global maps derived from Hansen Global Forest change dataset that can be accessed using Google Earth Engine API.

The maps are produced from time-series analysis of Landsat images characterizing forest extent and change over time.`,
"Forest Fires":`Burnt areas and forest fires will be highlighted and mapped out form remotely sensed Landsat/Sentinel data using the Normalized Burn Ratio (NBR). NBR is designed to highlight burned areas and estimate burn severity. It uses near-infrared (NIR) and shortwave-infrared (SWIR) wavelengths. Before fire events, healthy vegetation has very high NIR reflectance and a low SWIR reflectance. In contrast, recently burned areas show low reflectance in the NIR and high reflectance in the SWIR band.`
     };
    }
  }
};
</script>

<style></style>
