<template>
  <div class="q-pa-xs row">
    <div class="col q-pa-xs" style="width:150px">
      <q-select
        @input="onSelection"
        rounded
        outlined
        v-model="selection"
        :options="options"
        label="Medalus"
        dense
        options-dense
      />
    </div>
    <div class="col q-pa-xs" style="width:150px" v-if="selection === `CQIs`">
      <q-select
        @input="onCQI_Selection"
        rounded
        outlined
        v-model="selection1"
        :options="CQI_options"
        label="Medalus"
        dense
        options-dense
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    cloned_Result: {
      type: Object
    }
  },
  data() {
    return {
      selection: null,
      selection1: null,
      // CQI_selection: null,
      options: ["ESAI", "SQI", "CQI", "VQI", "MQI"],
      CQI_options: ["Aridity", "CQI"],
      medalus_obj: null
    };
  },
  computed: {
     getEmailResultID() {
      //checks if we have taskid in store
      const EmailedTaskID = this.$store.getters["Results/getEmailTaskID"];
      return EmailedTaskID;
    },
    getResults() {
      return this.cloned_Result;
    }
  },
  watch: {
    getResults: {
      immediate: true,
      handler(val) {
        if (val) {
          this.$Log("watch getresult in Medalus selection ", val.args.selections);
          this.selection = val.args.selections.selection0;
          this.selection1 = val.args.selections.selection1;
        }
      },
      deep: true
    }
  },
  mounted() {
    if(this.getEmailResultID) return
    this.$emit("medalus_selection", {
      selection0: "VQI",
      selection1: "VQI"
    });
    this.selection = "VQI";
    this.selection1 = "VQI";
  },
  methods: {
    async onSelection(val) {
      this.$Log("medalus onSelection ", val);
      this.medalus_obj = {};
      this.medalus_obj.selection0 = val;
      if (val != "CQIs" && !this.getEmailResultID) {
        this.$emit("medalus_selection", this.medalus_obj);
        this.$emit("yearshow", true);
      } else {
        this.$emit("yearshow", null);
      }
    },
    onCQI_Selection(val) {
      if (!this.medalus_obj) this.medalus_obj = {};
      this.medalus_obj.selection1 = val;
      if(!this.getEmailResultID){
      this.$emit("medalus_selection", this.medalus_obj);
      this.$emit("yearshow", true);
      }
      this.$Log("medalus  onCQI_Selection", this.medalus_obj);
    }
  }
};
</script>
