import VueGtag from "vue-gtag";
export default async ({router, Vue }) => {
  Vue.use(VueGtag, {
    config: { id: "UA-183787005-1"},
    includes:[
      {id: 'UA-184032602-1'}
    ]
  },router);
}
