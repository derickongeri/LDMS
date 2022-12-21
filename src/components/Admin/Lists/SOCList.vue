<template>
  <div  >
    <q-card>
       <div class="bg-primary text-white text-center">
        <div class="text-h6">{{$t('admin_page.soc_refs')}}</div>
      </div>
      <q-card-section>
        <q-list bordered dense separator>
          <q-item clickable v-ripple v-for="soc in Soc_RefOptions " :key="soc.value">
            <q-item-section class="text-center">{{soc.label}}</q-item-section>
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
