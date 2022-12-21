<template>
  <div class="q-pa-md edit-form " style="max-width: 500px">
    <div>
      <div class="text-h6 text-center">
        {{ $t("profile.edit_details") }}
      </div>
    </div>
    <q-form @submit="onSubmit">
      <div :class="$q.platform.is.desktop ? `row  q-mt-sm` : ``">
        <div v-for="(item, index) in Object.keys(form_details)" :key="index">
          <q-input
            class="col-xs-12 col-md-6 q-ml-xs"
            filled
            dense
            v-model="user_details[item]"
           :label="$t(`admin_page.edit_user_form.${item}`)"
            :hint="$t(`admin_page.edit_user_form.${item}`)"
            lazy-rules
            :rules="[val => (val && val.length > 0) || 'Please type something']"
            style="min-width: 220px"
          />
        </div>
      </div>
      <q-toggle v-model="accept" :label="$t('profile.edit_form.confirm_check_box')"/>
      <div class="q-pa-sm">
        <q-btn :label="$t('submit')" type="submit" color="primary" />
        <q-btn
          :label="$t('cancel')"
          @click="cancel"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { positive, negative } from "src/Services/Notifications";
import { Platform } from "quasar";
import _ from "lodash";
export default {
  props: {
    userdetails: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      user_details: {},
      accept: false
    };
  },
  computed: {
    form_details() {
       this.$Log("triggeres .................")
      const picked = this.pick_keys(this.userdetails,[
        "email",
        "first_name",
        "profession",
        "institution",
        "title",
        "last_name"
      ]);
      this.user_details={...picked}
      return picked;
    }
  },
  methods: {
    pick_keys(obj,keys) {
      const picked = _.pick(obj, keys);
      this.$Log(picked);
      return picked;
    },
    onSubmit() {
      if (this.accept !== true) {
        let msg = this.$t("profile.edit_form.confirm_change");
        negative(msg);
      } else {
          let original_detais = {...this.userdetails}
          let edited_details = {...this.user_details}
            edited_details  =  _.assign({}, original_detais, edited_details);
        const profile = this.pick_keys( edited_details ,["profession", "institution", "title"]);
        let user_details = _.omit( edited_details , [
          "profession",
          "institution",
          "title"
        ]);
        user_details = { ...user_details, profile: { ...profile } };
        this.$emit("edit_user", user_details);
      }
    },
    cancel() {
      this.$emit("cancel", false);
    }
  }
};
</script>

<style>
.edit-form {
  border: 2px solid #00695c;
  border-radius: 10px;
}
</style>
