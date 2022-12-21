<template>
  <div class="q-pa-md q-gutter-sm">
   
    <q-dialog
      v-model="show"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card
        class="text-white"
        style="width: 450px; background-color: #d78d32"
        v-if="show"
      >
        <q-card-section>
          <div class="text-h6 text-center">Attention</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ $t("large_area_error_message", [thresholdArea]) }}
          <div v-if="!getLoggedIn">
            Please Login/signup to queue
            <span @click="gotToAuth" style="cursor: pointer; color:blue">click here to login/signup</span>
          </div>
        </q-card-section>

        <q-card-actions align="around" class="bg-white text-teal">
          <q-btn flat label="Select Area" @click="cancel" />

          <q-btn v-if="this.getLoggedIn" flat label="Schedule Task" @click="shedule" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { EventBus } from "src/Helpers/EventBus/eventBus.js";

export default {
  props: {
    show_dialog: {
      type: Boolean
    }
  },
  data() {
    return {};
  },
  computed: {
    current_geojson() {
      return this.$store.getters["Shapefiles/getcurrentGeoJson"];
  },
    thresholdArea() {
      // we get the thresholf area based on user is logged in or not
      return this.$store.getters["ApiSettings/GetCurrentThresholdArea"];
    },
    getLoggedIn() {
      // check if user is logged in or not
      return this.$store.getters["auth/loggedin"];
    },
    getloggedUser() {
      // check if user is logged in or not
      return this.$store.getters["auth/loggedUser"];
    },
    show() {
      this.$Log(" 00000000000====computed============", this.show_dialog);
      return this.show_dialog;
    }
  },
  methods: {
    cancel() {
      this.$emit("cancel_request", { show: false });
       EventBus.$emit("filter_raster", {noRaster:true});
             
    },
    shedule() {
      if (this.getLoggedIn) {
        this.$emit("queue_request", { show: false, proceed: true });
         EventBus.$emit("filter_raster", {noRaster:true});
      }
      
    },
    gotToAuth() {
      this.$router.push("/login");
    }
  }
};
</script>

<style></style>
