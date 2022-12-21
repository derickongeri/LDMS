<template>
  <div class="q-pa-md ">
    <q-dialog v-model="edit_modal" persistent>
      <q-card
        class="q-pa-md col-xs-12 col-sm-12 col-md-12 edit_user"
        style="width:480px"
        ><div>
          <div class="text-h4 text-center">
            {{ $t("admin_page.edit_user") }}
          </div>
        </div>
        <q-card-section>
          <div v-if="Object.keys(row).length > 0">
            <div v-for="(item, i) in Object.keys(row)" :key="item">
             
              <div class="row" v-if="item !== `id`">
                <div class="col-xs-4 q-mt-md">
                  <p class="text-subtitle2" v-if="item !== `profile`">
                    {{
                      $t(`admin_page.edit_user_form.${Object.keys(row)[i]}`)
                    }}
                  </p>
                </div>
                <div
                  class="col-xs-8"
                  v-if="[`is_admin`, `is_active`].includes(item)"
                >
                  <q-select
                    dense
                    v-model="row[Object.keys(row)[i]]"
                    :options="['true', false]"
                    style="width:200px"
                  />
                </div>
                <div class="col-xs-12" v-else-if="item === 'profile'">
                  <!-- <p v-if="item === `profile`" class="text-h6 text-center">
                    {{ capitalize(Object.keys(row)[i]) }}
                  </p> -->
                  <div
                    v-for="(prof, j) in Object.keys(row[item])"
                    :key="prof"
                    class="row"
                  >
                    <div class="col-xs-4 q-mt-sm">
                      <p class="text-subtitle2">
                        {{
                          $t(
                            `admin_page.edit_user_form.${
                              Object.keys(row[item])[j]
                            }`
                          )
                        }}
                      </p>
                    </div>
                    <div
                      v-if="
                        [
                          `can_upload_custom_shapefile`,
                          `can_upload_standard_raster`
                        ].includes(prof)
                      "
                      class="col-xs-8"
                    >
                      <q-select
                        dense
                        v-model="row[Object.keys(row)[i]][prof]"
                        :options="['true', false]"
                        style="width:200px"
                      />
                    </div>
                    <div v-else class="col-xs-8">
                      <q-input
                        dense
                        v-model="row[Object.keys(row)[i]][prof]"
                        style="width:200px"
                      />
                    </div>
                  </div>
                </div>
                <div v-else>
                  <q-input
                    dense
                    v-model="row[Object.keys(row)[i]]"
                    style="width:200px"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="edit" @click="submit_edit"></q-btn>
          <q-space />
          <q-btn flat v-close-popup>cancel</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="row">
      <div class="col-xs-12 col-md-12">
        <div class="bg-primary text-white text-center">
          <div class="text-h6">{{ $t("admin_page['registered_users']") }}</div>
        </div>
        <q-table
          dense
          row-key="index"
          :data="users"
          :filter="filter"
          :columns="columns"
        >
          <template v-slot:top-right>
            <q-input
              borderless
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr>
              <q-td key="name" :props="props">{{ props.row.first_name }}</q-td>
              <q-td key="email" :props="props">{{ props.row.email }}</q-td>
              <q-td key="institution" :props="props">{{
                props.row.profile.institution
              }}</q-td>
              <q-td key="title" :props="props">{{
                props.row.profile.title
              }}</q-td>
              <q-td key="profession" :props="props">{{
                props.row.profile.profession
              }}</q-td>
              <q-td key="active" :props="props">{{ props.row.is_active }}</q-td>
              <q-td auto-width key="edit">
                <q-btn
                  dense
                  round
                  flat
                  color="grey"
                  @click="editRow(props)"
                  icon="edit"
                ></q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
    <div class="row">
      <div class="col-md-3 col-lg-3 col-xs-12   q-mt-md pushmdleftmd">
        <q-card style="min-width:330px">
          <div class="bg-primary text-white">
            <div class="text-h6 text-center">{{$t('profile.upload_section')}}</div>
          </div>
          <q-card-section>
            <uploads />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-6 col-lg-5  col-xs-12 q-mt-md pushmdleft">
        <customRegions>{{ $t("admin_page.shapefile_tables") }} </customRegions>
      </div>
      <div class="col-md-2 col-lg-3 col-xs-12 pushmdleft">
        <div class="row q-mt-md pushmdleft">
          <div class="col-md-12  col-xs-12 ">
            <soclist />
          </div>
          <div class="col-md-12  col-xs-12 q-mt-sm">
            <ecolist />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegisterData from "src/Mixins/UserRegData";
export default {
  mixins: [RegisterData],
  components: {
    uploads: require("components/Admin/Uploads/uploaders").default,
    soclist: require("components/Admin/Lists/SOCList").default,
    ecolist: require("components/Admin/Lists/ECOUnitList").default,
    customRegions: require("components/Admin/Lists/CustomRegions").default
  },
  data() {
    return {
      edit_modal: false,
      title: null,
      filter: "",
      pagination: {
        rowsPerPage: 0
      },
      //
      row: {}
    };
  },
  computed: {
    columns() {
      return [
        {
          name: "name",
          label: this.$t("admin_page.registered_users_table.name"),
          align: "center",
          field: "first_name",
          sortable: true
        },
        {
          name: "email",
          align: "center",
          label: this.$t("admin_page.registered_users_table.email"),
          field: "email",
          sortable: true
        },
        {
          name: "institution",
          label: this.$t("admin_page.registered_users_table.institution"),
          field: "institution",
          sortable: true
        },
        {
          name: "title",
          label: this.$t("admin_page.registered_users_table.title"),
          field: "title"
        },
        {
          name: "profession",
          label: this.$t("admin_page.registered_users_table.profession"),
          field: "profession"
        },
        {
          name: "active",
          label: this.$t("admin_page.registered_users_table.isActive"),
          field: "is_active",
          sortable: true
        },
        {
          name: "Edit",
          label: this.$t("admin_page.registered_users_table.edit")
        }
      ];
    },
    users() {
      let users = this.$store.getters["Users/getusers"];
      if (users) return users;
    }
  },
  methods: {
    editRow(item) {
      this.edit_modal = true;
      this.$Log(item.row);
      this.row = { ...item.row };
    },
    capitalize(str, lower = false) {
      return (lower ? str.toLowerCase() : str).replace(
        /(?:^|\s|["'([{])+\S/g,
        match => match.toUpperCase()
      );
    },
    submit_edit() {
      this.$Log("submit-edit ", this.row);
      Object.entries(this.row).forEach(([key, value]) => {
        //sinnce js selection cannot hold true boolean, we need to convert string to boolean
        if (value === "true") {
          this.row[key] = true;
        }
        if (key === "profile") {
          //loop through innner objects and check if string true exists and turn to valid boolean
          Object.entries(this.row[key]).forEach(([k, v]) => {
            this.$Log("inside", k);
            if (v === "true") {
              this.row[key][k] = true;
            }
          });
        }
        this.$Log(key, value);
      });
      this.$store.dispatch("Users/updateuser", this.row);
       this.edit_modal = false;
    }
  },
  async mounted() {
    await this.$store.dispatch("Users/getusers");
  }
};
</script>

<style scoped>
.edit_user {
  border-radius: 20px;
  border: 4px solid #00695c;
}
@media screen and (min-width: 1023px) {
  .pushmdleft {
    margin-left: 20px;
  }
  .pushmdleftmd {
    margin-left: 10px;
    margin-right:35px;
  }
}
@media screen and (max-width: 1023px) {
  .pushmdleft {
    margin-top: 20px;
  }
  .pushmdleftmd {
    margin-top: 20px;
  }
}
</style>
