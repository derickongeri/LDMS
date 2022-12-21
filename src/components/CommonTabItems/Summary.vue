<template>
  <div class="row">
    <div class="col-xs-12" v-if="show">
      <div class="text-h6 text-center">{{ $t("summary") }}</div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean
  }
};
</script>

<style></style>
