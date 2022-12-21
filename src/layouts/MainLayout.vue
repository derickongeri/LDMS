<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      style="background-image: linear-gradient(to right,#cdb03b , #de772d)"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <div class="row">
          <div class="col-sm-2">
            <q-img
              :src="require('assets/images/rsz_visuelmisland.png')"
              style="width: 70px; "
            />
          </div>
          <div class="col-sm-6 q-mt-sm hidesmall">
            <div class="row">
              <div class="col-sm-12" style="white-space: nowrap">
                <span style=" font-size: 13px;font-weight: bold;">{{
                  $t("logo.heading")
                }}</span>
                - <span>{{ $t("logo.north_africa") }}</span>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <span
                  style=" font-size: 12px; color:#112372;font-weight: bold;"
                >
                  {{ $t("logo.subtitle") }}</span
                >
              </div>
            </div>
          </div>
        </div>
      
        <q-toolbar-title></q-toolbar-title>
        <span class="hidesmall ">
          <q-btn flat exact to="/">
            <q-icon name="home" />
            <q-tooltip>Go to Home</q-tooltip>
          </q-btn>
          <q-btn flat exact to="/dashboard">
            <!-- Map -->
            &nbsp; &nbsp;
            <q-tooltip>Dashboard</q-tooltip>
            <q-icon name="dashboard" />
          </q-btn>
          <q-btn
            v-if="loggedin && userDetails.is_admin === 1"
            flat
            exact
            to="/admin"
          >
            <!-- Admin -->
            <q-icon name="admin_panel_settings" />
            <q-tooltip>Go to Admin</q-tooltip>
          </q-btn>
          <q-btn
            flat
            exact
            to="/login"
            @click="logout"
            v-if="!loggedin.loggedin"
          >
            <!-- Signin &nbsp; -->
            <q-icon name="fas fa-sign-in-alt" />
            <q-tooltip>Login</q-tooltip>
          </q-btn>

          <q-btn flat @click="logout" v-if="loggedin.loggedin">
            <!-- Logout &nbsp; -->
            <q-icon name="fas fa-sign-out-alt" />
            <q-tooltip>Logout</q-tooltip>
          </q-btn>
        </span>
        <div
          @click="gotTo('/user')"
          class="q-mr-sm q-mt-md hidesmall"
          v-if="loggedin.loggedin"
        >
          <q-avatar class="q-mb-md">
            <!-- <q-badge color="green" floating>4</q-badge> -->
            <q-icon size="md" name="account_circle" />
          </q-avatar>
          <!-- {{ loggedin.user }} -->
          <q-tooltip> User: {{ loggedin.user }}</q-tooltip>
        </div>
        <q-select
          dark
          v-model="locale"
          @input="setLocale"
          :options="[
            { label: 'English', value: 'en-us' },
            { label: 'Français', value: 'fr' }
          ]"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      :width="200"
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-1"
    >
      <q-list padding>
        <q-item clickable exact to="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          exact
          to="/admin"
          v-if="loggedin && userDetails.is_admin === 1"
        >
          <q-item-section avatar>
            <q-icon name="admin_panel_settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Admin</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable exact to="/dashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable exact to="/login" v-if="!loggedin.loggedin">
          <q-item-section avatar>
            <q-icon name="fas fa-sign-in-alt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sign in</q-item-label>
          </q-item-section>
        </q-item>
        <!-- <p  v-if="loggedin.loggedin">{{loggedin}}</p> -->
        <q-item clickable @click="logout" v-if="loggedin.loggedin">
          <q-item-section avatar>
            <q-icon name="fas fa-sign-out-alt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="gotTo('/user')" v-if="loggedin.loggedin">
          <q-item-section avatar>
            <q-icon size="md" name="account_box" />
          </q-item-section>
          <q-item-section>
            <q-item-label> {{ loggedin.user }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section avatar>
            <q-icon name="g_translate" />
          </q-item-section>
          <q-item-section>
            <div class="row">
              <div class="col-sm-8">
                <q-select
                  v-model="locale"
                  @input="setLocale"
                  :options="[
                    { label: 'English', value: 'en-us' },
                    { label: 'Français', value: 'fr' }
                  ]"
                />
              </div>
            </div>
          </q-item-section>
        </q-item>
        <q-space />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
 

    <div v-if="page !='dashboard'" class=" bg-white row" style=" border-top: 1px solid#d59434; ">
    
       <div class="col-md-10  offset-md-1 col-lg-10   offset-lg-1">
          <div class="row">
        <div class="col-md-6 col-lg-5 bg-white ">
          <div class="row bg-white">
            <div class=" q-ml-">
              <img
                class="q-ma-xs"
                  @click.stop="OpenLink('http://www.oss-online.org/en')"
                :src="require('assets/images/rsz_observertoire.png')"
                style="width: 100px;  height: 75px;object-fit: contain;cursor:pointer;"
              />
            </div>
            <div class=" q-ml-sm">
              <img
                class=" q-ma-xs"
                 @click.stop="OpenLink('https://gmes.rcmrd.org/')"
                :src="require('assets/images/gmes.png')"
                style="width: 130px; height: 75px; object-fit: contain; cursor:pointer;"
              />
            </div>
            <div class=" q-ml-md">
              <img
                class="q-ma-xs"
                  @click.stop="OpenLink('https://au.int/')"
                :src="require('assets/images/auweblogo-en.png')"
                style="width: 130px; height: 75px;object-fit: contain;cursor:pointer;"
              />
            </div>
            <div class=" q-ml-md">
              <img
                class="q-mt-xs "
                @click.stop="OpenLink('https://europa.eu/')"
                :src="require('assets/images/Flag-European-Union.jpg')"
                style="width: 80px; height: 75px;object-fit: contain;cursor:pointer;"
              />
             
            </div>
          </div>
    
        </div>
        <div class="col-md-1  bg-white q-mt-sm ">
       <div class="text-center text-black text-weight-bolder q-mr-md">
         Other Partners 
         </div>   
        </div>
        <div class="col-md-5">
          <div class="bg-white" style="overflow-x:scroll; white-space: nowrap;">
            <div
              style=" display:inline-block;"
              v-for="(logo, index) in OtherLogos"
              :key="index"
            >
              <img
              @click.stop="OpenLink(logo.link)"
                class="q-ml-xs q-mt-xs"
                :src="require(`assets/images/Logos/${logo.img}.jpg`)"
                style="width: auto; height: 45px; Object-fit:contain;cursor:pointer;"
              />
            </div>
          </div>
        </div>
      </div>
       </div>
    
     
    </div>
       </q-page-container>
  </q-layout>
</template>
<script>
import i18n from "src/boot/i18n";
import { Platform } from "quasar";
import { negative } from "src/Services/Notifications";
import { EventBus } from "src/Helpers/EventBus/eventBus.js";
export default {
  data() {
    return {
      leftDrawerOpen: false,
      locale: "English",
      // locale: this.$i18n.locale,
      OtherLogos: [
       {
         img:"Picture1",
         link:""
       },
       {
         img:"Picture2",
         link:""
       },
       {
         img:"Picture3",
         link:""
       },
       {
         img:"Picture4",
         link:""
       },
       {
         img:"Picture5",
         link:""
       },
       {
         img:"Picture6",
         link:""
       },
       {
         img:"Picture7",
         link:""
       },
       {
         img:"Picture8",
         link:""
       },
      ]
    };
  },
  computed: {
    page(){
      return this.$route.name;
    },
    loggedin() {
      let user = this.$store.getters["auth/loggedin"];
      if (user) {
        user = JSON.parse(localStorage.getItem("user"));
        if (user.token) {
          // this.$store.dispatch("Results/checkQueued"); //get backend settings e.g area thresholds
          return { loggedin: true, user: user.name };
        }
      }
      return false;
    },
    userDetails() {
      if (this.loggedin.loggedin)
        return JSON.parse(localStorage.getItem("user"));
    }
  },
  created() {
    this.checkUser(); //run initially to check if user is logged in
    this.getRasters(); // make api call to get rasters
    this.getRasterTypes(); //make api call to get rasterTypes
    this.GetRegionalShape(); //make api call to get shapefiles
    this.$store.dispatch("ApiSettings/GetApiSettings"); //get backend settings e.g area thresholds
    this.$store.dispatch("Carousel/getImages");
    this.$store.dispatch("Faqs/getFaqs");
  },
  methods: {
    async getRasters() {
      //get list of available raster files
      let rasters = await this.$store.dispatch("Geotiffs/GetRasterList");
      this.tiffs = [...rasters];
    },
    async getRasterTypes() {
      //get list of available raster files
      let rasters = await this.$store.dispatch("RasterTypes/GetrasterTypes");
      this.$Log("raster Types", rasters);
    },
    async GetRegionalShape() {
      //get list of available raster files
      let regional_shape = await this.$store.dispatch(
        "Shapefiles/GetRegionalShape"
      );
      // this.$Log("Regional", regional_shape);
    },
    findPos(obj) {
      let curtop = 0;
      if (obj.offsetParent) {
        do {
          curtop += obj.offsetTop;
        } while ((obj = obj.offsetParent));
        curtop = curtop + 150;
        this.$Log("curtop ", curtop);
        return curtop;
      }
    },
    setLocale(locale) {
      this.$i18n.locale = locale.value;
      // set quasar's language too!!
      import(`quasar/lang/${locale.value}`).then(language => {
        this.$q.lang.set(language.default);
      });
      localStorage.setItem("language", JSON.stringify(locale));
    },
    logout() {
      this.$store.dispatch("auth/Logout");
    },
    checkUser() {
      let user = localStorage.getItem("user");
      if (user) {
        user = JSON.parse(user);
        if (user.token) {
          return this.$store.dispatch("auth/setLoggedin", user);
        }
      }
    },
    gotTo(route) {
      try {
        this.$router.push({
          path: route,
          query: {
            q: this.searchQuery,
            t: new Date().getTime()
          }
        });
      } catch (err) {
        this.$Log("Router Error ", err);
      }
    },
    //we check of we are about to show queued results
    getResults(pathItems) {
      this.$store.dispatch(
        "Results/setEmailTaskID",
        pathItems[pathItems.length - 1]
      );
      EventBus.$emit("clear_legends_and_charts", false);
     if(process.env.DEV)console.log(" pathItems beforeEach", pathItems);
    },
    getUserLanguage() {
      this.$Log("language ", localStorage.getItem("language"));
      if (localStorage.getItem("language")) {
        const locale = JSON.parse(localStorage.getItem("language"));
        this.locale = locale.label;
        this.setLocale(locale);
      }
    },
    OpenLink(link){
    if(!link) return
    return
      window.open(link,'_blank');
    }
  },
  async mounted() {
    this.getUserLanguage();
    let pathItems = this.$router.currentRoute.path.split("/");
    this.$Log("beforeEach current ", pathItems);
    if (
      this.$router.currentRoute.path.startsWith("/dashboard") &&
      pathItems.includes("results")
    ) {
      this.getResults(pathItems);
    }
    await this.$router.beforeEach((to, from, next) => {
      pathItems = to.path.split("/");
      if (to.path.startsWith("/dashboard") && pathItems.includes("results")) {
        this.getResults(pathItems);
      }
      if (to.path === "/admin") {
        let loggedin = this.$store.getters["auth/loggedin"];
        this.$Log(
          "Logged in guard ",
          loggedin,
          "checkUser ",
          this.userDetails.is_admin
        );
        if (loggedin) {
          if (this.userDetails.is_admin === 1) {
            return next();
          }
          negative("You need to be an Admin  to access the Admin");
          return next("/dashboard");
        } else {
          negative("You need to be logged First");
          return next("/login");
        }
      }
      next();
    });
    // this.$router.push("/dashboard").catch(err => {});
  }
};
</script>
<style scoped>
@media screen and (max-width: 1122px) {
  .q-footer {
    display: none;
  }
  .hidesmall {
    display: none;
  }
}
.words {
  color: black;
  width: 100px;
  word-wrap: break-word;
}
/* firefox specific */
</style>
<style>
html, body {
     scrollbar-width: none;
}
body::-webkit-scrollbar {
  width: 0px;

}
</style>