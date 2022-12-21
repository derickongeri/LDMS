<template>
  <div style="background-color:#d69234">
    <div class="q-pa-xs">
      <q-carousel
        swipeable
        animated
        v-model="slide"
        :autoplay="autoplay"
        :fullscreen.sync="fullscreen"       
        infinite
        arrows
      >
        <q-carousel-slide
          v-for="image in images"
          :key="image.image_name"
          :name="image.image_name"
          :img-src="`${api_url}${image.image_file}`"
        >
          <div class="absolute-center	 custom-caption ">
            <div class="text-h6">{{ image.image_name }}</div>
            <div class="text-subtitle1">{{ image.image_desc }}</div>
          </div>
        </q-carousel-slide>
        <template v-slot:control>
          <q-carousel-control position="bottom-right" :offset="[18, 18]">
            <q-btn
              push
              round
              dense
              color="white"
              text-color="primary"
              :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="fullscreen = !fullscreen"
            />
          </q-carousel-control>
        </template>
      </q-carousel>
    </div>
    <div class="row">
      <div class="col-sm-6 q-pa-xs">
        <q-card flat bordered class="my-card full-height">
          <q-card-section>
            <div class="text-h5 text-weight-bold">
              {{ $t("indexPage.index_title") }}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <p class="text-subtitle2">
              {{ $t("indexPage.index_title_subtitle") }}
              <a
                href="https://misland.readthedocs.io/en/latest/"
                target="_blank"
                >{{ $t("indexPage.here") }}</a
              >
              {{ $t("indexPage.index_title_subtitle_documentation") }}
            </p>
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            MISLAND-North Africa is an operational instrument relying on the
            international standards for reporting SDG 15.3.1 and technical
            approaches allowing the delivery of regular information on
            vegetation cover gain/loss to decision makers and environmental
            agencies at the first place..
            <q-card-section class="q-mt-xs">
              The core-service provides land degradation indicators for six
              North African Countries at two levels:

              <li class="q-pa-xs">
                At the regional level(North Africa action zone) where low and
                medium resolution EO are used.
              </li>
              <li class="q-pa-xs">
                At the pilot site level, where(customized indicators) can be
                developed, using medium resoultion data(landsat time series
                imagery and derived vegetation indices, combined with different
                satellite-derived climate data)
              </li>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-sm-6 q-pa-xs videocard">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h5 text-weight-bold">
              {{ $t("indexPage.training_video") }}
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-video
              style="height: 350px;"
              src="https://www.youtube.com/embed/weiM6tCwjDw"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6 q-pa-xs">
        <q-card flat bordered class="my-card card-same-height">
          <q-card-section>
            <div class="text-h5 text-weight-bold">
              {{ $t("indexPage.index_land_degradation_indicators") }}
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            {{ $t("indexPage.index_land_degradation_indicators_subtitle") }}
          </q-card-section>
          <q-separator inset />

          <q-card-section>
            <Accordion />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-sm-6 q-pa-xs">
        <q-card flat bordered class="my-card card-same-height fullwidth">
          <q-card-section>
            <div class="text-h5 text-weight-bold">
              {{ $t("indexPage.feedback_and_help") }}
            </div>
          </q-card-section>
          <q-separator inset />
          <q-card-section class="q-pt-none">
            <p class="text-subtitle2">
              {{ $t("indexPage.feedback_and_help_subsitle") }}
              <span
                @click="gotTo('/userfeedback')"
                style="cursor:pointer;color:#d69234;"
                >{{ $t("indexPage.here") }}
              </span>
            </p>
          </q-card-section>
          <q-card-section>
            <div class="text-h6">
              {{ $t("indexPage.frequently_asked_questions") }}
            </div>
          </q-card-section>
          <q-card-section>
            <ul v-for="(question, i) in Faqs" :key="question">
              <li
                class="text-subtitle2"
                style="cursor:pointer;list-style-type: none;"
                @click="gotTo(`/FrequentlyAskQuestions/${i}`)"
              >
                {{ i + 1 }}. {{ question }}
              </li>
              <!-- <li>What is MISLAND?</li>
             <li>How to use the site</li>
             <li>why  is the map limited to North Africa?</li> -->
            </ul>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //carousel variables
      slide: 1, //set carousel slide
      autoplay: true, //autoplay the carousel
      fullscreen: false, // we can make caurosel image full screen
      api_url: "http://172.105.246.124"
    };
  },
  components: {
    Accordion: require("../../components/HomePageComponents/Accordion").default,
    Feedback: require("../../components/HomePageComponents/UserFeedback")
      .default
  },
  methods: {
    gotTo(route) {
      this.$router.push(route);
    }
  },
  computed: {
    images() {
      //get carousel images
      let images = this.$store.getters["Carousel/GetCarouselImages"];
      if (images.length > 0) {
        this.$Log("Index carousel images ", images);
        return images;
      }
    },
    Faqs() {
      let Faqs = this.$store.getters["Faqs/GetFaqs"];
      let questions = [];
      if (Faqs) {
        Faqs.forEach(faq => {
          questions.push(faq.question_text);
        });
        this.$Log("questions ", questions);
        return questions;
      }
    }
  }
};
</script>
<style>
.scroll {
  overflow: hidden;
}
.q-carousel__arrow .q-icon {
    font-size: 88px;
    /* color:green; */
}
</style>
<style scoped>
a:link,
a:visited {
  text-decoration: none;
  color: #d69234;
  cursor: pointer;
}
@media only screen and (max-width: 660px) {
  .videocard {
    min-width: 100%;
  }
}
.q-card__section,
.q-card__section--vert {
  padding: 4px;
}
@media only screen and (min-width: 730px) {
  .card-same-height {
    min-height: 468px;
  }
}

.custom-caption{
  text-align: center;
  padding: 12px;
  color: white;
  background-color: rgba(0, 0, 0, .5);
}


</style>
