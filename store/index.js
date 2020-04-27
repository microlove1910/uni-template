import Vue from 'vue'
import Vuex from 'vuex'

import {
	loginUrl,
	xxTokenKey
} from '../config.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		user: uni.getStorageSync('user')
	},
	getters: {
		user(state) {
			return state.user;
		},
		hasLogin(state) {
			return state.hasLogin;
		}
	},
	mutations: {
		login(state, user) {
			state.user = user;
			state.hasLogin = true;
			uni.setStorageSync('user', user);
		},
		logout(state) {
			state.user = null;
			state.hasLogin = false;
			uni.removeStorageSync('user');
		}
	},
	actions: {
		doLogin: async function(username, password) {
			return await Vue.$api.doPost('/api/v1/login', {
				username,
				password
			}).then(res => {
				const data = res.data;
				commit('login', data.user);
				uni.setStorageSync(xxTokenKey, data.token);
				return data;
			})
		},
		doGetUser: async funciton() {
			return await Vue.$api.doGet('/api/v1/user').then(res => {
				const data = res.data;
				commit('login', data.user);
				return data;
			})
		},
		doLogout: async function() {
			return await Vue.$api.doPost('/api/v1/logout').then(res => {
				commit('logout');
				uni.removeStorageSync(xxTokenKey);
				uni.showToast({
					title: '退出成功',
					icon: 'none',
					duration: 1500,
					success: (res) => {
						uni.navigateTo({
							url: '/pages/index/index'
						});
					}
				});
				return res;
			});
		}
	}
});

export default store;
