import {
	baseUrl,
	Code,
	xxTokenKey
} from '../config.js'

/**
 * 网络请求的封装API
 */
class Api {

	/**
	 * 获得 header 信息
	 */
	getHeader() {
		return {
			'Content-Type': 'application/json;charset=utf-8',
			xxTokenKey: uni.getStorageSync(xxTokenKey)
		}
	}

	/**
	 * 响应拦截处理
	 * @param {Object} resp 返回的数据
	 * @param {Object} resolve Promise 的 resolve 
	 * @param {Object} reject Promise 的 reject
	 */
	doResponseIntercept(resp, resolve, reject) {
		if (resp.statusCode === 200) {
			const data = resp.data;
			if (data.code === 200) {
				resolve(data);
			} else if (data.code === Code.UNLOGIN) {
				uni.showModal({
					title: '系统提示',
					content: '您尚未登录，是否立即登录',
					showCancel: true,
					cancelText: '取消',
					confirmText: '登录',
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/index/index'
							})
						}
					}
				})
			} else {
				uni.showToast({
					title: data.msg,
					icon: 'none',
					duration: 2000,
				})
			}
		} else {
			console.error('其他异常', resp)
			reject(resp)
		}
	}

	/**
	 * 封装的真实请求
	 * @param {string} url 请求的地址
	 * @param {Object} params 要发送的数据
	 * @param {string} method 请求的方法   
	 */
	doRequest(url, params, method = 'get') {
		const header = this.getHeader();
		const _this = this;
		if (!url.startsWith("https://") && !url.startsWith('http://')){
			url = baseUrl + url;
		}
		return new Promise((resolve, reject) => {
			uni.request({
				url: url,
				method: method,
				data: params,
				header: header,
				success: (res) => {
					_this.doResponseIntercept(res, resolve, reject)
				},
				fail: (err) => {
					uni.showToast({
						title: '请稍后再试',
						icon: 'none',
						duration: 2000,
					})
				}
			})
		})
	}

	doGet(url, params = []) {
		return this.doRequest(url, params, 'get')
	}

	doPost(url, params = []) {
		return this.doRequest(url, params, 'post')
	}

	doDelete(url, params = []) {
		return this.doRequest(url, params, 'delete')
	}

	doPut(url, params = []) {
		return this.doRequest(url, params, 'put')
	}

	doUploadFile(url, filePath, params) {
		const _this = this;
		if (!url.startsWith("https://") && !url.startsWith('http://')){
			url = baseUrl + url;
		}
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: url,
				filePath: filePath,
				name: 'file',
				formData: params,
				success: res => {
					_this.doResponseIntercept(res, resolve, reject)
				},
				fail: err => {
					uni.showToast({
						title: '请稍后再试',
						icon: 'none',
						duration: 2000,
					})
				}
			})
		})
	}

}

export default new Api();
