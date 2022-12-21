<template>
  <div class="row q-pa-md">
     <div class="col-md-8  offset-md-2">
       <div class="text-h6 text-center">
        {{$t('user_feedback_pointer')}}
       </div>
        <Feedback/>
     </div>
  </div>
</template>

<script>
export default {
components: {
    Feedback: require("../../components/HomePageComponents/UserFeedback").default,
  },
}
</script>

<style>

</style>