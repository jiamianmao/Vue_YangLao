> 此项目是根据vue-admin为模板来构建的，包含了 Element UI & axios & iconfont & permission control & lint

这是vue-admin的使用教程，可以进行参考:
 - [手摸手，带你用 vue 撸后台 系列一(基础篇)](https://juejin.im/post/59097cd7a22b9d0065fb61d2)
 - [手摸手，带你用 vue 撸后台 系列二(登录权限篇)](https://juejin.im/post/591aa14f570c35006961acac)
 - [手摸手，带你用 vue 撸后台 系列三 (实战篇)](https://juejin.im/post/593121aa0ce4630057f70d35)
 - [手摸手，带你用vue撸后台 系列四(vueAdmin 一个极简的后台基础模板,专门针对本项目的文章,算作是一篇文档)](https://juejin.im/post/595b4d776fb9a06bbe7dba56)
 - [手摸手，带你封装一个vue component](https://segmentfault.com/a/1190000009090836)

## 目录结构
│  App.vue
│  CommonRules.js    // 通用规则
│  main.js
│  permission.js    // 权限控制
│  service.js       // 抽离出来的一些接口，方便进行这部分接口的统一配置
│
├─api
│      login.js
│      table.js
│
├─assets
│  ├─404_images
│  │      404.png
│  │      404_cloud.png
│  │
│  ├─login_images
│  │      bgc.png
│  │      findpasswd.png
│  │      loginbox.png
│  │      loginbutton.png
│  │      logo.png
│  │
│  ├─map
│  │      map_slidebar.png
│  │
│  └─order
│          bgc.png
│          doneOrder.png
│          history.png
│          logo-white.png
│          logo.png
│          newOrder.png
│
├─common
│      config.js      // 因为是接口在两个域名下，所以使用config文件形式配置baseURL，切换mode时，只需切换product的boolean值
│      iconfont.js
│
├─components       // 通用的基础组件
│  │  checkGroup.vue
│  │  dateBox.vue
│  │  editRole.vue
│  │  FormChunkLabel.vue
│  │  limitArea.vue
│  │  mapArea.vue
│  │  OrgChoose.vue
│  │  PageContainer.vue
│  │  ServiceArea.vue
│  │  table.vue
│  │  TablePagination.vue
│  │  TimeBox.vue
│  │
│  ├─Hamburger
│  │      index.vue
│  │
│  ├─Mp
│  │      PageContainer.vue
│  │      TablePagination.vue
│  │
│  ├─ScrollBar
│  │      index.vue
│  │
│  └─SvgIcon
│          index.vue
│
├─icons
│  │  index.js
│  │
│  └─svg
│          account.svg
│          example.svg
│          eye.svg
│          form.svg
│          inte.svg
│          password.svg
│          service.svg
│          table.svg
│          tree.svg
│          user.svg
│
├─router
│      index.js
│      _import_development.js
│      _import_production.js
│
├─store                  // 这里vuex主要关注的是 登录后会在window下创建一个_dataInfo存储用户信息（之前项目遗留），页面中有很多地方需要使用window._dataInfo来维护数据，另外该项目的登录态是由cookie来维护，所以退出时需要全部清除
│  │  getters.js
│  │  index.js
│  │
│  └─modules
│          app.js
│          user.js
│
├─styles
│      element-ui.scss
│      index.scss
│      mixin.scss
│      sidebar.scss
│      transition.scss
│      variables.scss
│
├─utils    // 公共js文件，把一些鉴权，校验抽离出来
│      auth.js
│      index.js
│      request.js
│      validate.js
│
└─views            // 项目中的所有页面
    │  404.vue
    │  AccountInfo.vue
    │  GovernmentInfo.vue
    │
    ├─CSC         // 原MP系统下的所有
    │  │  OrderManagement.vue
    │  │  OrderReassignment.vue
    │  │
    │  └─NewOrder
    │          NewOrder.vue
    │          popUp.vue
    │
    ├─government
    │      GovernmentAddSubAccount.vue
    │      GovernmentSubManaget.vue
    │      governSubArea.vue
    │
    ├─home       // 登录成功后的路由
    │      index.vue
    │
    ├─layout     // 项目的布局文件
    │  │  Layout.vue
    │  │
    │  └─components
    │      │  AppMain.vue
    │      │  index.js
    │      │  Navbar.vue
    │      │
    │      └─Sidebar
    │              index.vue
    │              SidebarItem.vue
    │
    ├─login
    │      index.vue
    │
    ├─MP       // 原MP系统下的所有
    │  │  Category.vue
    │  │  elderMap.vue
    │  │  green.png
    │  │  MapSlide.vue
    │  │  MapTitle.vue
    │  │  OrderDetail.vue
    │  │  OrderPopUp.vue
    │  │  organizationMap.vue
    │  │  red.png
    │  │  ServicerMap.vue
    │  │
    │  ├─CommoditiesManagement
    │  │      CommoditiesManagement.vue
    │  │      CommodityInfo.vue
    │  │      editPro.vue
    │  │
    │  ├─ElderlyManagement
    │  │      bankrollContral.vue
    │  │      elderlyArea.vue
    │  │      ElderlyManagement.vue
    │  │      emergencyContact.vue
    │  │      operateElderly.vue
    │  │
    │  ├─MpOrderManagement
    │  │      MpOrderManagement.vue
    │  │
    │  └─ServiceManagement
    │          green.png
    │          red.png
    │          ServiceManagement.vue
    │          WorkerAdd.vue
    │          WorkerList.vue
    │
    ├─organ
    │      AddChildAccount.vue
    │      OrganAccountM.vue
    │
    ├─platform      // 平台相关
    │  ├─functionManager
    │  │  │  functionManager.vue
    │  │  │
    │  │  └─poPup
    │  │          poPup.vue
    │  │
    │  ├─GovernmentManagement
    │  │      AddGovernment.vue
    │  │      editGovernmentInfo.vue
    │  │      GovernmentManagement.vue
    │  │
    │  ├─OrgAccountManagement
    │  │      AddOrgAccount.vue
    │  │      editOrgInfo.vue
    │  │      OrgAccountManagement.vue
    │  │
    │  ├─OrgManagement
    │  │      AddOrg.vue
    │  │      OrgInfo.vue
    │  │      OrgManagement.vue
    │  │
    │  └─roleManager
    │      │  roleManager.vue
    │      │
    │      ├─roleFunc
    │      │      roleFunc.vue
    │      │
    │      ├─roleInfo
    │      │      roleInfo.vue
    │      │
    │      └─rolePoPup
    │              rolePoPup.vue
    │
    ├─Statistic  // 统计中心
    │      excel.png
    │      full.png
    │      Statistic.vue
    │      Statistic1.vue
    │
    ├─table
    │      index.vue
    │
    └─tree
            index.vue

## 说明：
项目的前后端都至少经历三个人来维护，所以很多命名风格和代码风格不同，所以请认真阅读以下内容，避免踩坑

## 整体架构

之前项目是分成三个模块： 登录，CSC(部署在ums域名下),MP(部署在mp域名下)，通过domain + iframe 和 CORS 相结合来进行跨域访问的
后经重构为 三个模块统一成一个项目中，只通过CORS来进行跨域资源访问（后台把一些不支持CORS的接口增加了CORS）

原项目中使用了在全局作用域的window对象下创建 _dataInfo 和 func 来维护用户信息及菜单树的构建，现有项目也基本采用了此架构
只是略有区别，该项目是在登录后（login.vue）把返回的dataInfo放在window._dataInfo   登录成功后会进入主项目中，主项目是在 layout 中进行布局的，分为上左右三块
其中 Sidebar/SiderItem 里面会生成项目的菜单树。  layout 的样式控制在 styles 里。

本地开发的时候令src/config的product = false 
登录后，因为使用了接口代理(config/index)，所以本地不会被setCookie，需要另开窗口登录线上官网拿到cookie，手动种在本地上(CSESSIONID 和 CSESSIONNAME)。

## 常见问题:
接口302：
  通常是因为CORS会在正确发送请求前先发送一个预请求(option)，302是暂时重定向，说明接口未能正确响应该请求
接口400:
  Bad Request，通常是因为请求参数错误，服务器无法理解请求(在一些和address相关的接口中会出现不同接口对地区的字段名称定义不同：zoneId和areaId，所以常会造成400错误)
