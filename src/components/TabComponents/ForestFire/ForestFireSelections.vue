<template>
  <div class="row">
    <div class="col-md-4 col-xs-12 q-pa-xs">
      <p class="text-cente">{{$t('forest_fire.prefire_range')}}</p>
      <div class="row ">
        <div class=" q-pa-xs col-xs-12 date">
          <q-datetime-picker
            label="Prefire Start Date"
            v-model="forest_fire.prefire_start"
            target="self"
            dense
            mode="date"
            @input="prefire_start"
            :date-options="startSentinelDate"
          ></q-datetime-picker>
        </div>
        <div class=" q-pa-xs col-xs-12 date">
          <q-datetime-picker
            label="Prefire End Date"
            target="self"
            v-model="forest_fire.prefire_end"
            dense
            @input="prefire_end"
          ></q-datetime-picker>
        </div>
      </div>
    </div>
    <div v-if="forest_fire.prefire_end" class="col-md-4 col-xs-12  q-pa-xs">
      <p class="text-cente">Postfire range</p>
      <div class="row ">
        <div class=" q-pa-xs col-xs-12 date">
          <q-datetime-picker
            label="Postfire Start Date"
            v-model="forest_fire.postfire_start"
            target="self"
            dense
            @input="postfire_start"
          ></q-datetime-picker>
        </div>
        <div class=" q-pa-xs col-xs-12 date">
          <q-datetime-picker
            label="Postfire End Date"
            v-model="forest_fire.postfire_end"
            target="self"
            dense
            @input="postfire_end"
          ></q-datetime-picker>
        </div>
      </div>
    </div>
    <div v-if="forest_fire.postfire_end" class="col-md-4 col-xs-12 q-pa-xs ">
      <p class="text-center">Select Platform</p>
      <div class="q-pa-sm q-pa-xs">
        <q-select
          @input="OnRasterSourceSelection"
          outlined
          dense
          v-model="forest_fire.raster_source"
          :options="options"
          label="Platform"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { date } from "quasar";
import { positive, negative } from "src/Services/Notifications";
export default {
  data() {
    return {
      forest_fire: {
        prefire_start: null,
        prefire_end: null,
        postfire_start: null,
        postfire_end: null,
        raster_source: null
      },
      emit:false,
      options: [{label:"Sentinel 2",value:"Sentinel 2"}, {label:"Landsat",value:"Landsat 8"}]
    };
  },
  methods: {
    startSentinelDate(date){
   return date >= '2016/02/03' 
    },
    prefire_start(date){
      this.$Log("prefire_start ",date)
      if(this.forest_fire.prefire_end && date>this.forest_fire.prefire_end){
        negative("Prefire end date must be greater than prefire start date",0)
        this.emit=false
      }else{
         this.emit=true
      }
      this.forest_fire.raster_source= null
      this.$Log("prefire_start ",date)
    },
    prefire_end(date){
       if(this.forest_fire.prefire_start && date<this.forest_fire.prefire_start){
        negative("Prefire end date must be greater than prefire start date",0)
     this.emit=false
      }
      else if(date>this.forest_fire.postfire_start){  negative("Prefire end date must be less than postfire start date",0);
        this.emit=false
      }
      else{
         this.emit=true
      }
       this.forest_fire.raster_source= null
      this.$Log("prefire_end ",date)
    },
    postfire_start(date){
       if(this.forest_fire.prefire_end && date<this.forest_fire.prefire_end){
        negative("Postfire start date must be greater than prefire end date",0)
       this.emit=false
      }
      else if(date>this.forest_fire.postfire_end){  negative("Postfire end date must be greater than postfire start date",0);
        this.emit=false
      }
      else{
         this.emit=true
      }
       this.forest_fire.raster_source= null
      this.$Log("postfire_start ",date)
    },
    postfire_end(date){
       if(this.forest_fire.postfire_start && date<this.forest_fire.postfire_start){
        negative("Postfire end date must be greater than postfire start date",0)
      this.emit=false
      }else{
         this.emit=true
      }
       this.forest_fire.raster_source= null
      this.$Log("postfire_end ",date)
    },
    OnRasterSourceSelection(values) {
      let nullValues = Object.values(this.forest_fire).filter(value => {
        return value === null;
      });
      let Obj = {};
      this.$Log("OnRasterSourceSelection ", nullValues);
      for (const property in this.forest_fire) {
        if (property.startsWith("prefire") || property.startsWith("postfire")) {
          Obj[property] = date.formatDate(
            this.forest_fire[property],
            "YYYY-MM-DD"
          );
        }
      }

      Obj.raster_source = this.forest_fire.raster_source.value;
      this.$Log("OnRasterSourceSelection Obj", Obj);
      if (nullValues.length === 0  && this.emit ===true) return this.$emit("get_forest_fire", Obj);
        negative("Error please check if the date are overlapping",0)
    }
  }
};
</script>

<style scoped></style>
