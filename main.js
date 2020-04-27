import Vue from 'vue'
import App from './App'
import api from './util/api.js'
import {
	Constant
} from './config.js'

Vue.config.productionTip = false

Vue.prototype.$constant = Constant

Vue.prototype.$api = api



App.mpType = 'app'

const app = new Vue({
	...App
})



app.$mount()
