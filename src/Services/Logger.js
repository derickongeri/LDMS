import Vue from 'vue'
const Log =  function(){
if(process.env.DEV){
    const args = Array.prototype.slice.call(arguments);
    console.log.apply(console, args);
}
}

Vue.prototype.$Log = Log
export {Log}