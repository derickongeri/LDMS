<template>
  <div>
    <div class="bg-primary text-white text-center">
      <div class="text-h6">
        <slot></slot>
      </div>
    </div>
    <q-table
      dense
      row-key="index"
      :data="usershapefiles"
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
          <q-td key="name" :props="props">{{ props.row.shapefile_name }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filter: "",
      pagination: {
        rowsPerPage: 0
      },

      columns: [
        {
          name: "name",
          label: this.$t("admin_page.custom_shapefile_tables.name"),
          align: "center",
          field: "name",
          sortable: true
        }
      ]
    };
  },
  computed: {
    usershapefiles() {
      return this.$store.getters["Shapefiles/getCustomShapeFiles"];
    }
  },
  methods: {
    deletegeojson(item) {
      alert("deleting ", JSON.stringify(item.row));
    }
  }
};
</script>

<style scoped>
@media screen and (min-width: 1024px) {
  .table_height {
    height: 350px;
  }
}
</style>
