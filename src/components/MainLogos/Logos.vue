<template>
  <div class="q-pa-none">
    <div class="row">
      <div class="col-xs-12 col-md-10 offset-md-2 col-lg-8 offset-lg-2 ">
        <div class="row">
          <div class="">
            <img
              @click.stop="OpenLink('http://www.oss-online.org/en')"
              class="q-ma-xs"
              :src="require('assets/images/rsz_observertoire.png')"
              style="width: 80px; height: 35px;object-fit: contain;cursor:pointer;"
            />
          </div>
          <div class="">
            <img
              @click.stop="OpenLink('https://gmes.rcmrd.org/')"
              class=" q-ma-xs"
              :src="require('assets/images/gmes.png')"
              style="width: 90px; height: 35px; object-fit: contain;cursor:pointer;"
            />
          </div>
          <div class="">
            <img
              @click.stop="OpenLink('https://au.int/')"
              class="q-ma-xs"
              :src="require('assets/images/auweblogo-en.png')"
              style="width: 80px; height:35px;object-fit: contain;cursor:pointer;"
            />
          </div>
          <div class="">
            <img
              @click.stop="OpenLink('https://europa.eu/')"
              class="q-mt-xs"
              :src="require('assets/images/Flag-European-Union.jpg')"
              style="width: 80px; height:35px; object-fit: contain;cursor:pointer;"
            />
          </div>
        </div>
      </div>
    </div>
    <q-separator inset />
    <div class="row q-pa-sm">
      <div class="col-xs-12 col-md-8 offset-md-2 col-lg-6 offset-lg-">
        <div
          class="bg-white logos"
          style="overflow-x:scroll; white-space: nowrap;"
        >
          <div
            style=" display:inline-block;height:40px;"
            v-for="(logo, index) in OtherLogos"
            :key="index"
          >
            <img
              @click.stop="OpenLink(logo)"
              class="q-ml-md"
              :src="require(`assets/images/Logos/${logo.img}.jpg`)"
              style="width:auto; height: 30px; Object-fit:contain;"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      OtherLogos: [
        {
          img: "Picture1",
          link: ""
        },
        {
          img: "Picture2",
          link: ""
        },
        {
          img: "Picture3",
          link: ""
        },
        {
          img: "Picture4",
          link: ""
        },
        {
          img: "Picture5",
          link: ""
        },
        {
          img: "Picture6",
          link: ""
        },
        {
          img: "Picture7",
          link: ""
        },
        {
          img: "Picture8",
          link: ""
        }
      ]
    };
  },
  methods: {
    OpenLink(link) {
      if (!link) return;
      return
      window.open(link, "_blank");
    }
  }
};
</script>

<style>
body::-webkit-scrollbar {
  width: 0px;
}
.logos::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  background: #f3dcb9;
}
.logos::-webkit-scrollbar-thumb:hover {
  background: #d59535;
}
.logos {
  scrollbar-width: thin;
  scrollbar-color:  #f3dcb9 rgb(233, 224, 224);
}
</style>
