<template>
  <div>
      <!-- <q-dialog
          v-model="persistent"
          persistent
          transition-show="scale"
          transition-hide="scale"
        >
          <q-card class="bg-primary text-white">
            <q-card-section class="q-pt-none">
              <q-circular-progress
                indeterminate
                size="120px"
                color="lime"
                class="q-pa-md"
              />
            </q-card-section>
          </q-card>
        </q-dialog> -->
  </div>
</template>

<script>
export default {
props:{
    show:{
        type:Boolean,
        // default:false
    }
},
computed:{
    persistent(){
        return this.show
    }
}
}
</script>

<style>

</style>