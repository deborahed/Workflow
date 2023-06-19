/*
 * @Date: 2022-08-04 16:29:35
 * @LastEditors: StavinLi
 * @LastEditTime: 2022-09-21 14:13:59
 * @FilePath: /Workflow/src/plugins/axios.js
 */
"use strict";
import axios from "axios";
import {
    Message,
    Loading
} from 'element-ui'; //引入elm组件
let needLoadingRequestCount = 0,
    loading;


function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}

function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        setTimeout(function () {
            endLoading()
        }, 200)
    }
}

function startLoading() {
    loading = Loading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.2)',
        spinner: 'my-el-custom-spinner'
    })
}

function endLoading() {
    loading.close()
}

let config = {
    // baseURL: process.env.baseURL || process.env.apiUrl || ""
    timeout: 10 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
};
const _axios = axios.create(config);

// 添加请求拦截器
_axios.interceptors.request.use(config => { // 在发送请求之前做些什么
    if (config.loading !== false) {
        showFullScreenLoading()
    }
    return config;
}, err => { // 对请求错误做些什么
    return Promise.reject(err);
});

// 添加响应拦截器
_axios.interceptors.response.use(res => { // 对响应数据做点什么
    tryHideFullScreenLoading()
    if (res.data.code && res.data.code != 200) {
        Message.error(res.data.msg);
        return;
    }
    return res.data;
}, err => { // 对响应错误做点什么
    tryHideFullScreenLoading()
    if (err.response.data.code && err.response.data.code != 200) {
        Message.error(err.response.data.msg);
    }
    return Promise.reject(err);
});

export default _axios;