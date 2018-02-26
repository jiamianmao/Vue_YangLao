<template>
  <div class="menu-wrapper">
    <template v-for="item in uumsMenus" v-if="item.children">
      <el-submenu :index="item.title" :key="item.title">
        <template slot="title">
          <svg-icon :icon-class="hasIcon(item.title)"></svg-icon>
          <span v-if="item.title">{{item.title}}</span>
        </template>

        <template v-for="child in item.children">
          <sidebar-item v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.id"></sidebar-item>
          <router-link v-else :to="child.value" :key="child.id">
            <el-menu-item :index="child.value">
              <span v-if="child.name">{{child.name}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>

    </template>
  </div>
</template>

<script>
import Storage from 'good-storage'
import { UMS } from '@/common/config'
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    }
  },
  data () {
    return {
      uumsMenus: []
    }
  },
  created () {
    this.id = window._dataInfo.id
    this.dict = {
      '1': 1,
      '200': 3,
      '198': 4
    }
    // this._getId()
    this._getMenu()
  },
  methods: {
    // _getId () {
    //   this.$http.get(`${UMS}/role/doSearch.do?name=&status=&type=`).then(res => {
    //     let data = res.data
    //     if (data.errCode === 0) {
    //       data.data.role.filter(item => {
    //         return item.name === 
    //       })
    //     }
    //   })
    // },
    _getMenu () {
      this.$http.get(`${UMS}/role/getRoleByRoleId.do?id=${this.dict[this.id]}`).then(res => {
        let data = res.data
        if (data.errCode === 0) {
          let func = data.data.funcs
          this._handlerMenu(func)
          Storage.set('menus', JSON.stringify(func))
        }
      })
    },
    _handlerMenu (data) {
      let menus = []
      let sonMenus = []
      if (data) {
        var parents = data.filter(function (v) {
          return v.pid === 0;
        });
        for (var i = 0; i < parents.length; i++) {
          sonMenus = data.filter(function (v) {
            return v.pid === parents[i].id;
          });
          menus.push({
            title: parents[i].name,
            children: sonMenus
          })
        }
        this.uumsMenus = menus
        if (menus.length === 0) {
          alert('没有配置权限菜单,请联系管理员')
        }
      } else {
        alert('没有配置权限菜单,请联系管理员')
      }
    },
    hasIcon (title) {
      let iconClass = 'inte'
      if (/客服/.test(title)) {
        iconClass = 'service'
      } else if (/账号/.test(title)) {
        iconClass = 'account'
      }
      return iconClass
    }
  }
}
</script>
