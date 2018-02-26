<template>
  <scroll-bar class='container'>
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse" background-color="#0091DC" text-color="#fff">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Hamburger from '@/components/Hamburger'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar, Hamburger },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    }
  },
  data () {
    return {
      path: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss" scoped>
  .container{
    background: rgb(0, 145, 220);
  }
</style>
