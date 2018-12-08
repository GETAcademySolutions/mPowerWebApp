// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import moment from 'moment'

Vue.use(BootstrapVue);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

Vue.filter('secondsToTime', function(secs) {
    if (secs) {
        // Convert seconds into hh:mm:ss
        var hours = Math.floor(secs / (60 * 60));

        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);
    
        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);
        
        let m =  moment({hour: hours, minute: minutes, seconds: seconds})
        return m.format('HH:mm:ss')
    }
})

Vue.filter('formatTime', function(value) {
    if (value) {
        // return moment(String(value)).format('hh:mm')
        return moment.utc(value).format('HH:mm')
    }
})
