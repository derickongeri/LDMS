<template>
  <div>
    <q-card>
      <div class="bg-primary text-white text-center">
        <div class="text-h6">{{$t('admin_page.eco_refs')}}</div>
      </div>
      <q-card-section>
        <q-list bordered separator dense v-for="eco in Eco_RefOptions" :key="eco.value">
          <q-item clickable v-ripple>
            <q-item-section  class="text-center">{{eco.label}}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import ReferenceRasters from "src/Mixins/ReferenceRasters";
export default {
  mixins: [ReferenceRasters],

};
</script>

<style></style>
