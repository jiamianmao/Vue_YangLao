<template>
  <el-menu class="navbar" mode="horizontal">
    <!--<breadcrumb></breadcrumb>-->
    <div class="box">
    </div>
    <div class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <span>欢迎登录: {{ token }}</span>
        <el-button class='logout' plain @click="logout">退出</el-button>
      </div>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'sidebar',
      'token'
    ])
  },
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    display: flex;
    width: 100vw;
    height: 55px;
    line-height: 55px;
    border-radius: 0px !important;
    background: #616D80;
    .box{
      width: 80%;
      height: 55px;
      margin-left: 2%;
      text-indent: -9999em;
      background: url('../../../assets/order/logo-white.png') no-repeat center left;
      background-size: 96px 23px;
    }
    .hamburger-container {
      line-height: 60px;
      height: 55px;
      float: left;
      padding: 0 10px;
    }
    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }
    .avatar-container {
      height: 55px;
      display: inline-block;
      position: absolute;
      right: 35px;
      color: #fff;
      font-size: 14px;
      .logout {
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
</style>

