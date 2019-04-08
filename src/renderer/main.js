import Vue from 'vue';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-chalk/index.css';
import VueSocketio from 'vue-socket.io';
import { DataTables, DataTablesServer } from 'vue-data-tables';
import io from 'socket.io-client';
import axios from 'axios';
import { app } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies

import App from './App';
import router from './router';
import store from './store';
import Connection from './Connection';
import db from './datastore';


const moment = require('moment');
Vue.use(DataTables);
Vue.use(DataTablesServer);


// import * as d3 from 'd3';
Vue.use(require('vue-moment'), {
  moment,
});
window.jazzicon = require('jazzicon');
window.Web3Utils = require('web3-utils');
window.store = store;
window.EventBus = new Vue();
window.axios = axios;
window.d3 = require('d3/d3');
window.db = db;

const path = require('path');

const VueTruncate = require('vue-truncate-filter');
Vue.use(VueTruncate);

Vue.use(ElementUI, { locale });

window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
  console.log(errorMsg);
  return false;
};


const options = [
  {
    title: 'Trace on!',
    body: 'OriginTrail',
  },
  {
    title: 'Content-Image Notification',
    body: 'Short message plus a custom content image',
    icon: path.join(__dirname, 'icon.png'),
  },
];

function doNotify(evt) {
  if (evt.srcElement.id === 'basic') {
    // eslint-disable-next-line
    new Notification(options[0].title, options[0]);
  } else if (evt.srcElement.id === 'image') {
    // eslint-disable-next-line
    new Notification(options[1].title, options[1]);
  }
}


// document.addEventListener('DOMContentLoaded', () => {
//   // eslint-disable-next-line
//     new Notification(options[0].title, options[0]);
//   document.getElementById('basic').addEventListener('click', doNotify);
//   document.getElementById('image').addEventListener('click', doNotify);
// });

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

window.$ = require('../../bower_components/jquery/dist/jquery.js');
require('../../bower_components/lodash/dist/lodash.js');
require('../../bower_components/bootstrap/dist/js/bootstrap.js');
window.Alchemy = require('../../bower_components/alchemyjs/dist/alchemy');

window.LoggedIn = false;

/* eslint-disable-next-line */
router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !LoggedIn) {
    next('/login');
  } else {
    next();
  }
});


Vue.use(VueSocketio, 'http://127.0.0.1:3000');

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');


/* eslint-disable no-new */

