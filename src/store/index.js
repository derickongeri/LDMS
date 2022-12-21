import Vue from 'vue'
import Vuex from 'vuex'

import Shapefiles from './shapefiles'
import Geotiffs from './geotiffs'
import RasterTypes from './RasterTypes'
import auth from './auth'
import Users from './users'
import Results from './queuedResults'
import ApiSettings  from './ApiSettings'
import Carousel from './carousel'
import Faqs from './Faq'

Vue.use(Vuex)

const Store = new Vuex.Store({
  modules: {
    Shapefiles,
    Geotiffs,
    RasterTypes,
    auth,
    Users,
    Results,
    ApiSettings,
    Carousel,
    Faqs
  },
})
export { Store }

export default function (/* { ssrContext } */) {

  return Store
}
