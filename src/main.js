import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {BootstrapVue, BootstrapVueIcons} from "bootstrap-vue";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import {createPinia, PiniaVuePlugin} from "pinia";
import VueCookies from 'vue-cookies'

Vue.config.productionTip = false

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.use(PiniaVuePlugin);
Vue.use(VueCookies);

const pinia = createPinia();

new Vue({
  pinia,
  router,
  render: h => h(App)
}).$mount('#app')
