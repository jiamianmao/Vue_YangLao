import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { umsService } from '../../service';
import Cookies from 'js-cookie'
import storage from 'good-storage'
import router from 'vue-router'
import axios from 'axios'
import { ERR_OK } from '../../common/config.js'


const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    list: [],
    roleObj: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_Provinces: (state, list) => {
      state.list = list
    },
    SET_ROLELIST: (state, obj) => {
      state.roleObj = obj
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      // 为了不影响整体架构，先安vue-admin思路实现
      return new Promise((resolve, reject) => {
        setToken(userInfo.name)
        commit('SET_TOKEN', userInfo.name)
        resolve()
      }).catch(err => {
        reject(err)
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        let value = storage.get('Admin-Token')
        if (value) {
          resolve()
        } else {
          reject()
        }
        // getInfo(state.token).then(response => {
        //   const data = response.data
        //   commit('SET_ROLES', data.role)
        //   commit('SET_NAME', data.name)
        //   commit('SET_AVATAR', data.avatar)
        //   resolve(response)
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    async initProvince({ commit }) {
      const { list } = await umsService.getProvinces();
      commit('SET_Provinces', list)
    }
  }
}

export default user
