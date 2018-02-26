<template>
  <page-container title="账号管理">
    <el-form :model="userForm" label-width="100px" class="info-container" inline>
      <el-form-item label="用户账号">
        <el-input v-model="userForm.username"></el-input>
      </el-form-item>
      <el-form-item label="账号类型">
        <el-select v-model="userForm.category" placeholder="请选择机构状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="主账号" value="1"></el-option>
          <el-option label="子账号" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账号状态">
        <el-select v-model="userForm.status" placeholder="请选择机构状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="失效" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          placeholder="选择时间范围">
        </el-date-picker>
      </el-form-item>
      <el-row>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="getLists">筛选</el-button>
          <el-button type="primary" icon="el-icon-close" @click="reSet">重置</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="addMain">添加子账号</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <lists class="list"
            @pagination-click="pageChange"
            :tableEles="tableEles"
            :totalPage="totalPage"
            :data="tableData"
            :httpUrl="httpUrl"
            :pageUrl=　"pageUrl"
            :name="'orgName'">
    </lists>
  </page-container>
</template>
<script>
  
  import PageContainer from '../../components/Mp/PageContainer.vue';
  import lists from '../../components/Mp/TablePagination.vue';
  import { mapGetters } from 'vuex'
  import { format } from 'date-fns';
  import { UMS } from '@/common/config'
  export default {
    data() {
      return {
        httpUrl: "/user/updateState.do", //更改状态url
        pageUrl: "/pt/AccountInfo", //修改信息url
        userForm: {
          status: "",
          provinceId: "",
          cityId: "",
          countryId: "",
          streetId: "",
          pageNum: 1,
          username: "",
          type: 1,
          category: "",
          startTime: "",
          endTime: "",
          orgName: ""
        },
        time: [],
        tableEles: [
          {
            value: "orgName",
            name: "机构名称",
            ifLink: false
          }, {
            value: "category",
            name: "账号类型",
            ifLink: false
          }, {
            value: "username",
            name: "用户账号",
            ifLink: true
          }, {
            value: "name",
            name: "姓名",
            ifLink: false
          }, {
            value: "addUserName",
            name: "创建人",
            ifLink: false
          }, {
            value: "addTime",
            name: "创建时间",
            ifLink: false
          }, {
            value: "status",
            name: "账号状态",
            ifLink: false
          }
        ],
        totalPage: 1,
        data: [],
        tableData: []
      }
    },
    components: {
      lists,
      PageContainer,
    },
    created () {
      //拉取十条数据
      this.getLists(1)
    },
    methods: {
      pageChange(page) {
        this.userForm.pageNum = page
        this.getLists()
      },
      reSet() {
        //重置父组件search
        this.userForm = {
          status: "",
          provinceId: "",
          cityId: "",
          countryId: "",
          streetId: "",
          pageNum: 1,
          username: "",
          type: 1,
          category: "",
          startTime: "",
          endTime: "",
          orgName: ""
        };
        this.time = []
      },
      getLists () {
        // console.log(this.userForm)
        if(this.userForm.username.trim){
          this.userForm.username = this.userForm.username.trim()
        }

        this.userForm.startTime = ''
        this.userForm.endTime = ''
        if (this.time.length > 0 && this.time[0] && this.time[1]) {
          this.userForm.startTime = this.time[0].getTime()
          this.userForm.endTime = this.time[1].getTime()
        }
        this.$http.post(`${UMS}/user/getUserByParam.do`, this.userForm).then(res => {
          let data = res.data.data
          this.totalPage = data.totalNum
          this.tableData = data.users
          if (this.tableData && this.tableData.length && this.tableData.length > 0) {
            this.tableData.forEach(v => {
              v.status = (v.status === 1 ? "正常" : "失效")
              v.category = (v.category === 1 ? "主账号" : "子账号")
              v.addTime = format(v.addTime, 'YYYY-MM-DD HH:mm:SS')
            })
          } else {
            this.tableData = []
          }
        }).catch(e => alert(e))
      },
      addMain() {
        if (this.isOrg) {
          this.$router.push({ path: "/inst/addChildAccount" })
        } else {
          alert('您暂时没有该权限')
        }
      }
    },
    computed: {
      ...mapGetters(['isOrg'])
    }
  }
</script>