import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

export const constantRouterMap = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: _import('login/index'), hidden: true, meta: {} },
  { path: '/404', component: _import('404'), hidden: true , meta: {}},

  {
    path: '/home',
    component: Layout,
    hidden: true,
    children: [{
      path: 'home',
      component: _import('home/index')
    }]
  },

  {
    path: '/pt',
    component: Layout,
    redirect: '/pt/orgMana',
    name: 'pt',
    meta: { title: '账号管理(平台)', icon: 'account' },
    children: [
      {
        path: 'orgMana',
        name: 'orgMana',
        component: _import('platform/OrgManagement/OrgManagement'),
        meta: { title: '机构管理' }
      },
      {
        path: 'AddOrg',
        name: 'AddOrg',
        component: _import('platform/OrgManagement/AddOrg')
      },
      {
        path: 'OrgInfo',
        name: 'OrgInfo',
        component: _import('platform/OrgManagement/OrgInfo')
      },
      {
        path: 'orgAccountMana',
        name: 'orgAccountMana',
        component: _import('platform/OrgAccountManagement/OrgAccountManagement'),
        meta: { title: '机构账号管理' }
      },
      {
        path: 'AddOrgAccount',
        name: 'AddOrgAccount',
        component: _import('platform/OrgAccountManagement/AddOrgAccount')
      },
      {
        path: 'AccountInfo',
        component: _import('AccountInfo')
      },
      {
        path: 'govAccountMana',
        name: 'govAccountMana',
        component: _import('platform/GovernmentManagement/GovernmentManagement'),
        meta: { title: '政府账号管理' }
      },
      {
        path: 'AddGovernment',
        name: 'AddGovernment',
        component: _import('platform/GovernmentManagement/AddGovernment')
      },
      {
        path: 'GovernmentInfo',
        component: _import('GovernmentInfo')
      },
      {
        path: 'roleManager',
        name: 'roleManager',
        component: _import('platform/roleManager/roleManager'),
        meta: { title: '角色管理' }
      },
      {
        path: 'roleInfo',
        name: 'roleInfo',
        component: _import('platform/roleManager/roleInfo/roleInfo'),
        meta: { title: '角色管理' }
      },
      {
        path: 'rightsMana',
        name: 'rightsMana',
        component: _import('platform/functionManager/functionManager'),
        meta: { title: '权限管理' }
      }
    ]
  },

  {
    path: '/inst',
    component: Layout,
    redirect: '/inst/account',
    name: 'inst',
    meta: { title: '账号管理(机构)', icon: 'account' },
    children: [
      {
        path: 'account',
        name: 'account',
        component: _import('organ/OrganAccountM'),
        meta: { title: '账号管理' }
      },
      {
        path: 'addChildAccount',
        name: 'addChildAccount',
        component: _import('organ/AddChildAccount')
      },
      {
        path: 'AccountInfo',
        component: _import('AccountInfo')
      }
    ]
  },

  {
    path: '/gov',
    component: Layout,
    redirect: '/gov/governmentSubM',
    name: 'gov',
    meta: { title: '账号管理(政府)', icon: 'account' },
    children: [
      {
        path: 'governmentSubM',
        name: 'governmentSubM',
        component: _import('government/GovernmentSubManaget'),
        meta: { title: '账号管理' }
      },
      {
        path: 'GovernmentInfo',
        component: _import('GovernmentInfo')
      },
      {
        path: 'addGoverSubAccount',
        name: 'addGoverSubAccount',
        component: _import('government/GovernmentAddSubAccount')
      }
    ]
  },

  {
    path: '/integratedMana',
    component: Layout,
    redirect: '/integratedMana/product',
    name: 'integratedMana',
    meta: { title: '综合管理系统', icon: 'inte' },
    children: [
      {
        path: 'product',
        name: 'product',
        component: _import('MP/CommoditiesManagement/CommoditiesManagement'),
        meta: { title: '商品管理' }
      },
      {
        path: 'CommodityInfo',
        name: 'CommodityInfo',
        component: _import('MP/CommoditiesManagement/CommodityInfo')
      },
      {
        path: 'category',
        name: 'category',
        component: _import('MP/Category'),
        meta: { title: '品类管理' }
      },
      {
        name: 'MpOrderManagement',
        path: 'order',
        component: _import('MP/MpOrderManagement/MpOrderManagement'),
        meta: { title: '订单管理' }
      },
      {
        path: 'old',
        name: 'old',
        component: _import('MP/ElderlyManagement/ElderlyManagement'),
        meta: { title: '老人管理' }
      },
      {
        path: 'operateElderly',
        name: 'operateElderly',
        component: _import('MP/ElderlyManagement/operateElderly')
      },
      {
        path: 'servicePersonal',
        name: 'servicePersonal',
        component: _import('MP/ServiceManagement/ServiceManagement'),
        meta: { title: '服务人员管理' }
      },
      {
        name: 'WorkerAdd',
        path: 'worker/:id/edit',
        component: _import('MP/ServiceManagement/WorkerAdd')
      },
      {
        path: 'worker/:id/orderList',
        component: _import('MP/ServiceManagement/WorkerList')
      },
      {
        path: 'worker/:id',
        component: _import('MP/ServiceManagement/WorkerAdd')
      },
      {
        path: 'oDetail',
        component: _import('MP/OrderDetail')
      },
      {
        path: 'oReassignMent',
        component: _import('CSC/OrderReassignment')
      },
      {
        path: 'statistical',
        name: 'statistical',
        component: _import('Statistic/Statistic'),
        meta: { title: '统计中心' }
      },
      {
        path: 'statistical1',
        name: 'statistical1',
        component: _import('Statistic/Statistic1'),
        meta: { title: '统计中心' }
      },
      {
        path: 'elderlyCareMap',
        name: 'elderlyCareMap',
        component: _import('MP/elderMap'),
        meta: { title: '老人关爱地图' }
      },
      {
        path: 'instMap',
        name: 'instMap',
        component: _import('MP/organizationMap'),
        meta: { title: '机构地图'}
      },
      {
        path: 'servicerMap',
        name: 'servicerMap',
        component: _import('MP/ServicerMap'),
        meta: {
          title: '服务人员地图'
        }
      }
    ]
  },

  {
    path: '/serviceSystem',
    component: Layout,
    redirect: '/serviceSystem/order',
    name: 'serviceSystem',
    meta: { title: '客服系统', icon: 'service' },
    children: [
      {
        path: 'order',
        component: _import('CSC/OrderManagement'),
        meta: { title: '订单管理' }
      },
      {
        path: 'newOrder',
        name: 'newOrder',
        component: _import('CSC/NewOrder/NewOrder'),
        meta: { title: '创建新订单' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true, type: [0, 1, 2] }
]

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
