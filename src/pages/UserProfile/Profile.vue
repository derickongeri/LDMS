<template>
  <q-page>
    <div class="profile-container q-mb-sm">
      <div class="profile-photo text-center">
        <div class="default-user-image">
          <q-avatar
            round="round"
            color="blue-grey-10"
            icon="person"
            font-size="100px"
            size="100px"
            text-color="white"
          ></q-avatar>
        </div>
      </div>
      <div class="text-weight-bold text-h6 text-white" v-if="userdetails">
        {{ userdetails.first_name + " " + userdetails.last_name }}
      </div>
    </div>
    <div class="row q-pa-sm">
      <div class="col-xs-12 col-sm-12  ">
        <q-card class="my-card" v-if="userdetails">
          <div class="bg-primary text-white">
            <div class="text-h6 text-center">
              {{ $t("profile.profile_details") }}
            </div>
          </div>
          <q-card-section>
            <div class="row justify-center">
              <div class=" user-info" v-if="show_user_details">
                <div class="row justify-between">
                  <label class="text-subtitle1 text-weight-bold"
                    >{{ $t("admin_page.edit_user_form.first_name") }}:</label
                  >
                  <p class="text-subtitle1 text-weight-bold">
                    {{ userdetails.first_name }}
                  </p>
                </div>
                <div class="row justify-between">
                  <label class="text-subtitle1 text-weight-bold"
                    >{{ $t("admin_page.edit_user_form.last_name") }}:</label
                  >
                  <p class="text-subtitle1 text-weight-bold">
                    {{ userdetails.last_name }}
                  </p>
                </div>
                <div class="row justify-between">
                  <label class="text-subtitle1 text-weight-bold"
                    >{{ $t("admin_page.edit_user_form.email") }}:</label
                  >
                  <p class="text-subtitle1 text-weight-bold">
                    {{ userdetails.email }}
                  </p>
                </div>
                <div class="row justify-between">
                  <label class="text-subtitle1 text-weight-bold"
                    >{{ $t("admin_page.edit_user_form.title") }}:</label
                  >
                  <p class="text-subtitle1 text-weight-bold">
                    {{ userdetails.title }}
                  </p>
                </div>
                <div class="row justify-between">
                  <label class="text-subtitle1 text-weight-bold"
                    >{{ $t("admin_page.edit_user_form.profession") }}:</label
                  >
                  <p class="text-subtitle1 text-weight-bold">
                    {{ userdetails.profession }}
                  </p>
                </div>
                <div class="row justify-between">
                  <label class="text-subtitle1 text-weight-bold"
                    >{{ $t("admin_page.edit_user_form.institution") }}:</label
                  >
                  <p class="text-subtitle1 text-weight-bold">
                    {{ userdetails.institution }}
                  </p>
                </div>

                <q-btn
                  class="full-width"
                  unelevated
                  rounded
                  color="primary"
                  :label="$t('profile.edit_button')"
                  @click="
                    show_edit = true;
                    show_user_details = false;
                  "
                />
              </div>
              <div v-if="userdetails && show_edit">
                <EditUserForm
                  :userdetails="userdetails"
                  @edit_user="edit_user($event)"
                  @cancel="cancel($event)"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-pa-sm">
      <div class="col-md-6 col-lg-6 col-xs-12 col-sm-12 ">
        <!-- <q-card style="min-width:330px">
          <div class="bg-primary text-white">
            <div class="text-h6 text-center">
              {{ $t("profile.upload_section") }}
            </div>
          </div>
          <q-card-section> -->
            <uploads default_file="Shapefile" />
          <!-- </q-card-section>
        </q-card> -->
      </div>
      <div class="col-md-6 col-lg-6 col-xs-12 col-sm-12 q-pa-sm ">
        <customRegions>{{ $t("profile.geojson_table_header") }} </customRegions>
      </div>
    </div>
  </q-page>
</template>
<script>
import { positive, negative } from "src/Services/Notifications";
import { i18n } from "src/boot/i18n";
export default {
  components: {
    uploads: require("components/Admin/Uploads/uploaders").default,
    customRegions: require("components/Admin/Lists/CustomRegions").default,
    EditUserForm: require("components/Forms/Edit_User_Details").default
  },
  data() {
    return {
      url: "https://placeimg.com/500/300/nature",
      show_edit: false,
      show_user_details: true
    };
  },
  computed: {
    loggedin() {
      let user = this.$store.getters["auth/loggedin"];

      if (user) {
        user = JSON.parse(localStorage.getItem("user"));
        if (user.token) return { token: user.token, user: user.name };
      }

      return false;
    },
    userdetails: function() {
      let details = this.$store.getters["Users/getuser"];
      this.$Log("User Profile ", details);
      if (details) return details;
    },
    usershapefiles() {
      return this.$store.getters["Shapefiles/getCustomShapeFiles"];
    }
  },
  methods: {
    edit_user(user) {
      positive("Submited successufly");
      this.$store.dispatch("Users/updateuser", user);
      this.$Log("edit_user :", user);
      this.show_edit = false;
      this.show_user_details = true;
    },
    cancel(cancel) {
      this.show_user_details = true;
      this.show_edit = false;
    }
  },
  mounted() {
    this.$store.dispatch("Users/getuser", this.loggedin.token);
    this.$store.dispatch("Shapefiles/getCustomShapes");
  }
};
</script>

<style scoped>
.background-photo {
  cursor: pointer;
}

.profile-container {
  position: relative;
  text-align: center;
  background: rgba(0, 0, 0, 0);
  background-image: url("https://cdn.quasar.dev/img/material.png");
}

.user-info {
  padding: 10px;
  min-width: 24em;
  position: relative;
  border: 2px solid #00695c;
  border-radius: 10px;
}
</style>
