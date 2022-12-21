<script>
export default {
  data() {
    return {
      show_dialog: false, //boolean to show dialog when area is too big
      shedule_request: false, // boolean to continue with  task queueing
      area_too_big: false, //set to true when area is too big
      received_raster_source: null //stores raster_source
    };
  },
  computed: {
    getApiSettigs() {
      //we get the latest api settings including user and guest area threshold for analysis
      return this.$store.getters["ApiSettings/GetApiSettings"];
    },
    getLoggedIn() {
      // we use this property to check if user is logged in or not
      // check if user is logged in or not
      return this.$store.getters["auth/loggedin"];
    },
    thresholdArea() {
      if (this.received_raster_source) {
          let threshold = this.getApiSettigs.thresholds.filter(threshold => {
            return (threshold.datasource === this.received_raster_source);
          });
          this.$Log("souce in threshold area ", threshold);
           if (this.getLoggedIn) {
             return threshold[0].authenticated_user_threshold
           }
           return threshold[0].guest_user_threshold
        }
      // we get the thresholf area based on user is logged in or not
      if (this.getLoggedIn) {
        return this.getApiSettigs.signedup_user_polygon_size_limit;
      }
      return this.getApiSettigs.guest_user_polygon_size_limit;
    }
  },
  methods: {
    cancel_request(val) {
      //called when the user clicks select area
      this.show_dialog = val.show;
    },
    queue_request(val) {
      //called when user clicks to queue request
      this.$Log(" queue_request method  currenTab", this.currentTab);
      this.show_dialog = val.show;
      if (val.proceed) {
        this.shedule_request = true;
        this.common(); //this naming is strategic in all tab items to avoid code repetition
      }
    },
     checkArea({ current_geojson, raster_source,requestData }) {
      // we check area again the currently set threshold from the api
      this.received_raster_source = raster_source
      try {
        this.$Log("getApiSettigs ", this.getApiSettigs.thresholds);
        this.$Log("getApiSettigs requestData ", requestData);
        this.$Log(
          this.thresholdArea,
          " CheckArea current_geojson ",
          current_geojson,
          " raster_source ",
          this.received_raster_source
        );
        const area = turf.area(current_geojson);
        if (area) {
          //if we have have area from turf js function, we return area of the region selected and the corresponding threshold
          const result = { area: area / 10000, threshold: this.thresholdArea };
          this.$Log("CheckArea ", result);
          this.$store.dispatch('ApiSettings/SetcurrentThresholdArea', this.thresholdArea)
          return result;
        }
      } catch (err) {
        this.$Log("Error in checkArea ", err);
        return "Error";
      }
    }
  }
};
</script>

<style></style>
