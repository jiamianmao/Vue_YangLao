<template>
    <page-container title="政府账号管理">
        <el-form :model="userForm" label-position="left" label-width="100px" class="info-container" inline>
            <el-row>
                <cityArea ref="area" class="area" title="行政区域" @select-change="selectChange"></cityArea>
                <el-form-item label="用户账号" prop="username">
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
            </el-row>
            <el-row>
                <el-form-item label="创建时间">
                    <el-date-picker
                            v-model="time"
                            type="datetimerange"
                            placeholder="选择时间范围">
                    </el-date-picker>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label=" ">
                    <el-button type="primary" icon="el-icon-search" @click="getLists">筛选</el-button>
                    <el-button type="primary" icon="el-icon-close" @click="reSet">重置</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="addGover">添加政府主账号</el-button>
                </el-form-item>
            </el-row>
        </el-form>
        <lists class="list"
               @pagination-click="pageChange"
               :tableEles="tableEles"
               :totalPage="totalNum"
               :data="tableData"
               :httpUrl="httpUrl"
               :pageUrl=　"pageUrl"
               :name="'name'">
        </lists>
    </page-container>
</template>
<script>

  import PageContainer from '@/components/PageContainer.vue';
  import lists from '@/components/TablePagination.vue';
  import cityArea from '@/components/ServiceArea.vue';
  import { format } from 'date-fns';
  import { UMS } from '@/common/config'

  export default {
    data() {
      return {
        httpUrl: "/user/updateState.do",
        pageUrl: "/pt/GovernmentInfo",
        userForm: {
          status: "",
          provinceId: "",
          cityId: "",
          countryId: "",
          streetId: "",
          pageNum: 1,
          username: "",
          type: 2,
          category: "",
          startTime: "",
          endTime: "",
          orgName: ""
        },
        tableEles: [
          {
            value: "provinceName",
            name: "省",
            ifLink: false
          }, {
            value: "cityName",
            name: "市",
            ifLink: false
          }, {
            value: "countryName",
            name: "区",
            ifLink: false
          }, {
            value: "streetName",
            name: "街道",
            ifLink: false
          }, {
            value: "category",
            name: "账号类型",
            ifLink: false
          }, {
            value: "username",
            name: "账号",
            ifLink: true
          }, {
            value: "name",
            name: "姓名",
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
        totalNum: 0,
        time: [],
        tableData: []
      }
    },
    components: {
      lists,
      cityArea,
      PageContainer,
    },
    created() {
      this.getLists();
    },
    methods: {
      selectChange(area) {
        this.userForm.provinceId = area.provinceId;
        this.userForm.cityId = area.cityId;
        this.userForm.countryId = area.areaId;
        this.userForm.streetId = area.streetId;
      },
      pageChange(page) {
        this.userForm.pageNum = page;
        this.getLists();
      },
      reSet() {
        //重置子组件
        this.$refs.area.reSet();
        //重置父组件search
        this.userForm = {
          status: "",
          provinceId: "",
          cityId: "",
          countryId: "",
          streetId: "",
          pageNum: 1,
          username: "",
          type: 2,
          category: "",
          startTime: "",
          endTime: "",
          orgName: ""
        };
        this.time = [];
      },
      getLists() {
        this.userForm.startTime = '';
        this.userForm.endTime = '';

        if (this.time.length > 0 && this.time[0] && this.time[1]) {
          this.userForm.startTime = this.time[0].getTime();
          this.userForm.endTime = this.time[1].getTime();
        }

        if(this.userForm.username.trim){
            this.userForm.username = this.userForm.username.trim();
        }

        this.$http.post(`${UMS}/user/getUserByParam.do?`, this.userForm).then(res => {
          let data = res.data.data
          this.totalNum = data.totalNum;
          this.tableData = data.users;
          this.tableData.forEach(v => {
            v.status = (v.status === 1 ? "正常" : "失效");
            v.category = (v.category === 1 ? "主账号" : "子账号");
            v.addTime = format(v.addTime, 'YYYY-MM-DD HH:mm:SS');
          });
        }).catch(e => console.log);
      },
      addGover() {
        this.$router.push({ path: "/pt/AddGovernment" });
      }
    }
  }
</script>
