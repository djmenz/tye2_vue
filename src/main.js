import Vue from 'vue';
import VueSimpleAlert from 'vue-simple-alert';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

localStorage.setItem('token', '');

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

Vue.use(VueSimpleAlert);
