<template>
    <page-container title="角色管理">
        <el-form class="info-container" :model="searchForm" inline>
            <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
                <el-input v-model="searchForm.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色状态" :label-width="formLabelWidth" prop="status">
                <el-select v-model="searchForm.status" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="正常" value="1"></el-option>
                    <el-option label="失效" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色类型" :label-width="formLabelWidth" prop="status">
                <el-select v-model="searchForm.type" placeholder="请选择">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="平台" value="0"></el-option>
                    <el-option label="政府" value="2"></el-option>
                    <el-option label="机构" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-row>
                <el-col :offset="1" :span="8">
                    <el-form-item>
                        <el-button icon="el-icon-search" type="primary" @click="onSubmit">筛选
                        </el-button>
                        <el-button icon="el-icon-close" type="primary" @click="reSet">重置
                        </el-button>
                        <el-button icon="el-icon-plus" @click="newRole" type="primary">添加角色
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="tableData" stripe border class="list">
            <el-table-column
                    prop="id"
                    label="角色编码"
                    width="249">
            </el-table-column>
            <el-table-column prop="control" label="角色名称" width="249">
                <template slot-scope="scope">
                    <el-button
                            @click.native.prevent="showRoleInfo(scope.$index, tableData)"
                            type="text"
                            size="small">
                        {{tableData[scope.$index].name}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="角色状态"
                    width="249">
            </el-table-column>
            <el-table-column
                    prop="typeShow"
                    label="角色类型"
                    width="249">
            </el-table-column>
            <el-table-column prop="control" label="操作">
                <template slot-scope="scope">
                    <el-button
                            @click.native.prevent="stopRole(scope.$index, tableData)"
                            type="text"
                            size="small">
                        {{getAdverseStatus(tableData[scope.$index].status)}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-if="showDialog">
            <rolePoPup title="添加角色"
                       roleInfo=""
                       @pop-click="dialogClick">
            </rolePoPup>
        </div>
    </page-container>
</template>
<script>
  import PageContainer from '../../../components/PageContainer.vue';
  import rolePoPup from "./rolePoPup/rolePoPup.vue";
  import { UMS } from '@/common/config'

  export default {
    data() {
      return {
        tableData: [],
        roleList: [],
        systerms: [],
        rules: {},
        searchForm: {
          name: "",
          status: "",
          type: ""
        },
        formLabelWidth: "100px",
        showDialog: false,
        showList: false,
        typeMap: {
          '0': '平台',
          '1': '机构',
          '2': '政府'
        }
      }
    },
    components: {
      rolePoPup,
      PageContainer,
    },
    created() {
      this.getRoleList();
    },
    methods: {
      //获取角色信息列表
      getRoleList(fn) {
          if(this.searchForm.name.trim){
              this.searchForm.name = this.searchForm.name.trim();
          }
        this.$http.get(`${UMS}/role/doSearch.do?name=${
          this.searchForm.name
          }&status=${
          this.searchForm.status
          }&type=${this.searchForm.type}`)
        .then(res => {
          let data = res.data.data
          this.tableData = data.roles;
          this.tableData.forEach(v => v.status = (v.status === 1 ? "正常" : "失效"));
          this.tableData.forEach(v => v.typeShow = this.typeMap[v.type]);
          if (fn) fn();
        }).catch(e => console.log);
      },
      //新建角色
      newRole() {
        this.showDialog = true;
      },
      stopRole(index, tableData) {
        this.$http.post(`${UMS}/role/saveRole.do`, {
          id: tableData[index].id,
          name: tableData[index].name,
          type: tableData[index].type,
          status: tableData[index].status === "正常" ? 2 : 1
        }).then(data => {
          tableData[index].status = tableData[index].status === "正常" ? "失效" : "正常";
        }).catch(e => console.log);
      },
      //提交数据，搜索数据
      onSubmit() {
        this.getRoleList(() => {
          this.showList = true;
        });
      },
      //重置
      reSet() {
        this.searchForm = {
          name: "",
          status: "",
          type: ""
        };
      },
      //更改状态
      changeStatus(index, tableData) {
        this.getAdverseStatus(tableData[index].status)
      },
      //翻转状态
      getAdverseStatus(status) {
        //1-启用状态  2-停用状态
        if (!status) return;
        if (status.trim() === "正常") {
          return "停用";
        } else if (status.trim() === "失效") {
          return "启用";
        }
        return "";
      },
      //转换状态属性
      getDisplayStatue(status) {
        if (status === "1") return "正常";
        else if (status === "2") return "失效";
      },
      //对话框点击按钮回调
      dialogClick() {
        if (arguments.length === 2) {
          let formData = arguments[0];
          if (formData.name === "") {
            alert("请填写角色名称");
            return;
          }
          if (formData.state === "") {
            alert("请选择角色状态");
            return;
          }
          if (formData.type === "") {
            alert("请选择角色类型");
            return;
          }
          //发送请求 未进入该代码块则表示点击了取消按钮
          if (formData.hasOwnProperty('typeShow')) delete formData.typeShow;
          this.$http.post(`${UMS}/role/saveRole.do`, formData).then(data => {
            alert("操作成功");
            this.getRoleList();
          }).catch(e => console.log);
        }
        //关闭弹出框
        this.showDialog = false;
      },
      //
      showRoleInfo(index, tableData) {
        this.$router.push({ path: "/pt/roleInfo", query: { id: tableData[index].id } });
      }
    },
  }
</script>
