<template>
    <page-container title="机构账号管理">
        <el-form :model="userForm" label-width="100px" class="info-container" inline>
            <el-form-item label="机构名称">
                <el-input v-model="userForm.orgName"></el-input>
            </el-form-item>
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
            <el-form-item label="机构状态">
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
                <el-form-item label-width="100px" label=" ">
                    <el-button type="primary" icon="el-icon-search" @click="getLists">筛选</el-button>
                    <el-button type="primary" icon="el-icon-close" @click="reSet">重置</el-button>
                    <el-button type="primary" icon="el-icon-plus" class="button" @click="addMain">添加机构主账号</el-button>
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
  import PageContainer from '@/components/PageContainer.vue';
  import lists from '@/components/TablePagination.vue';
  import { format } from 'date-fns';
  import { UMS } from '@/common/config'

  export default {
    data() {
      return {
        httpUrl: `${UMS}/user/updateState.do`, //更改状态url
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
        tableData: [],
        totalPage: 1,
        data: []
      }
    },
    components: {
      lists,
      PageContainer,
    },
    created() {
      //拉取十条数据
      this.getLists();
    },
    methods: {
      pageChange(page) {
        this.userForm.pageNum = page;
        this.getLists();
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
        this.time = [];
      },
      getLists() {
        if(this.userForm.orgName.trim){
            this.userForm.orgName = this.userForm.orgName.trim();
        }
        if(this.userForm.username.trim){
            this.userForm.username = this.userForm.username.trim();
        }

        this.userForm.startTime = '';
        this.userForm.endTime = '';

        if (this.time.length > 0 && this.time[0] && this.time[1] ) {
          this.userForm.startTime = this.time[0].getTime();
          this.userForm.endTime = this.time[1].getTime();
        }

        this.$http.post(`${UMS}/user/getUserByParam.do`, this.userForm).then(res => {
          let data = res.data.data
          this.totalPage = data.totalNum;
          this.tableData = data.users;
          this.tableData.forEach(v => {
            v.status = (v.status === 1 ? "正常" : "失效");
            v.addTime = format(v.addTime, 'YYYY-MM-DD HH:mm:SS');
            v.category = (v.category === 1 ? '主账号' : '子账号');
          });
        }).catch(e => console.log(e));
      },
      addMain() {
        this.$router.push({ path: "/pt/AddOrgAccount" });
      }
    }
  }
</script>
<style lang="scss">
    .orgaccount-m {
        .search {
            .head {
                background-color: #fff;
                h5 {
                    padding: 0px 38px 0px 38px;
                    height: 42px;
                    line-height: 42px;
                    font-size: 22px;
                    color: #616d80;
                    border: 1px solid #CAD3DF;
                    border-bottom: none;
                    text-align: center;
                    background-color: #FBFBFB;
                    border-radius: 5px 5px 0 0;
                }
                div {
                    width: calc(100% - 150px);
                    height: 42px;
                    background-color: #fff;
                    border-bottom: 1px solid #CAD3DF;
                }
            }
            .search-table {
                background-color: #FBFBFB;
                border: 1px solid #CAD3DF;
                border-top: none;
                .button {
                    margin-left: 38px;
                    margin-bottom: 10px;
                }

            }
        }
        .list {
            margin-top: 32px;
        }
    }
</style>
