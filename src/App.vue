<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import storage from 'good-storage'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { MP } from '@/common/config'
export default {
  name: 'app',
  created () {
    if (!window._dataInfo) {
      storage.get('_dataInfo') && (window._dataInfo = JSON.parse(storage.get('_dataInfo')))
    }
    this._getPost()
  },
  methods: {
    _getPost () {
      if (window._dataInfo) {
        this.initProvince()
        this.$http.get(`${MP}/worker/postDict`).then(res => {
          this.SET_POST(res.data.data.list)
        }).catch(e => {
          console.log('触发退出')
          this.$store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
    },
    _getRoleManage () {
      if (this.initRoleManage) {
        return
      }
    },
    ...mapActions([
      'initProvince'
    ]),
    ...mapMutations([
      'SET_POST'
    ])
  },
  computed: {
    ...mapGetters(['token'])
  },
  watch: {
    $route (newVal) {
      this._getRoleManage()
    }
  }
}
</script>
