<template>
  <div class="q-pa-md">
    <div class="q-pa-sm">
      <div class="text-h6 text-center">
        The following are the frequently asked questions, if these are not
        satisfactory please use the <span  style="cursor:pointer;" @click="gotTo('/userfeedback')">User Feedback section </span>
      </div>
    </div>
    <div v-for="(faq,i) in Faqs" :key="faq.question_text">
      <div class="text-subtitle1 text-bold" :style="parseInt(selected_question_index)=== i?`color:red;`:``"> {{ faq.question_text }}</div>
     <div class="text-body1" style=""> {{ faq.answer }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        selected_question_index:null,
    };
  },
  mounted() {
      this.selected_question_index = this.$route.params.index
    this.$Log("Parameter", this.selected_question_index);
  },
  computed: {
    Faqs() {
      let Faqs = this.$store.getters["Faqs/GetFaqs"];
      if (Faqs) {
        return Faqs;
      }
    }
  },
  methods: {
    gotTo(route) {
      this.$router.push(route);
    }
  },
};
</script>

<style></style>
