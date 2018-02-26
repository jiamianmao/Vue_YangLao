<template>
    <page-container title="机构管理">
        <el-form :model="userForm" label-width="100px" class="info-container">
            <el-row>
                <cityArea ref="area" title="服务区域" @select-change="selectChange" curNum="0"></cityArea>
                <el-col :span="6">
                    <el-form-item label="机构名称">
                        <el-input v-model="userForm.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="机构状态">
                        <el-select v-model="userForm.status" placeholder="请选择机构状态">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="失效" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label=" ">
                    <el-button type="primary" icon="el-icon-search" @click="getLists">筛选</el-button>
                    <el-button type="primary" icon="el-icon-close" @click="reSet">重置</el-button>
                    <el-button type="primary" icon="el-icon-more">
                        <a class="export-btn-link" download="test"
                           :href="`http://ums.17link.cc/org/exportOrgByParam.do?${getQuery(userForm)}`">
                            导出
                        </a>
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="addOrg">添加机构</el-button>
                </el-form-item>
            </el-row>
        </el-form>
        <lists class="list"
               @pagination-click="pageChange"
               :tableEles="tableEles"
               :totalPage="totalPage"
               :data="data"
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
  import { UMS } from '@/common/config'

  export default {
    data() {
      return {
        httpUrl: "/org/updateOrgState.do",
        pageUrl: "/pt/OrgInfo",
        userForm: {
          name: "",
          status: "",
          provinceId: "",
          cityId: "",
          countryId: "",
          streetId: "",
          pageNum: 1
        },
        tableEles: [
          {
            value: "name",
            name: "机构名称",
            ifLink: true
          }, {
            value: "represent",
            name: "法人代表",
            ifLink: false
          }, {
            value: "phone",
            name: "法人电话",
            ifLink: false
          }, {
            value: "level",
            name: "机构等级",
            ifLink: false
          }, {
            value: "status",
            name: "机构状态",
            ifLink: false
          }
        ],
        totalPage: 1,
        data: [],
        query: ''
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
      getQuery(data) {
        var dataStr = '';
        for (var key in data) {
          dataStr += key + '=' + data[key] + '&';
        }
        dataStr = dataStr && dataStr.slice(0, -1);
        return dataStr;
      },
      // 从子组件拿到选择的区域
      selectChange(areaData) {
        this.userForm.provinceId = areaData.provinceId;
        this.userForm.cityId = areaData.cityId;
        this.userForm.countryId = areaData.areaId;
        this.userForm.streetId = areaData.streetId;
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
          name: "",
          status: "",
          provinceId: "",
          cityId: "",
          countryId: "",
          streetId: "",
          pageNum: 1
        };
      },
      getLists() {
        // 这层判断多此一举，直接v-model.trim即可
        if(this.userForm.name.trim) this.userForm.name = this.userForm.name.trim();
        this.$http.post(`${UMS}/org/getOrgByParam.do?`, this.userForm).then(res => {
          let data = res.data.data
          this.totalPage = data.totalNum;
          this.data = data.list;
          this.data.forEach(v => v.status = (v.status == 1 ? "正常" : "失效"));
        }).catch(e => console.log);
      },
      addOrg() {
        this.$router.push({ path: '/pt/AddOrg' });
      }
    }
  }
</script>
