<template>
    <pageContainer title='菜单权限' class="app-container">
        <!--<el-tabs v-model="activeName2" type="card" class="tabs">-->
        <!--<el-tab-pane label="菜单权限" name="first">-->
        <!---->
        <!--</el-tab-pane>-->
        <!--</el-tabs>-->
        <el-row class="info-container">
            <el-button type="primary" icon="el-icon-plus" @click="openPop">添加菜单权限</el-button>
        </el-row>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column
                    prop="id"
                    label="菜单编码"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="菜单名称"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="level"
                    label="菜单级别"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="mask"
                    label="菜单掩码"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="value"
                    label="权限对应值"
                    width="180">
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="edit(scope.$index, tableData)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-if="showDialog">
            <popup @pop-click="dialogClick" :form="form">
            </popup>
        </div>
    </pageContainer>
</template>

<script>
  import PageContainer from '../../../components/PageContainer.vue';
  import popup from './poPup/poPup.vue';
  import { UMS } from '@/common/config'

  export default {
    data() {
      return {
        activeName2: 'first',
        showDialog: "",
        tableData: [],
        functionId: "",
        form: ""
      };
    },
    components: {
      popup,
      PageContainer
    },
    created() {
      this.getData();
    },
    methods: {
      dialogClick(...arg) {
        if (arg.length > 0) {
          let formData = arguments[0];
          if (formData.name.trim() === "") {
            alert("菜单名称不能为空");
            return false;
          }
          if (formData.mask.trim() === "") {
            alert("菜单掩码不能为空");
            return;
          }
          if (formData.value.trim() === "") {
            alert("权限对应值不能为空");
            return;
          }

          if (formData.pid === 0) {
            formData.level = 1;
          } else {
            formData.level = 2;
          }
          //发送请求 未进入该代码块则表示点击了取消按钮
          if (formData.hasOwnProperty('pName')) delete formData.pName;
          this.$http.post(`${UMS}/func/saveFunc.do`, formData).then(data => {
            this.getData();
          }).catch(e => console.log);
        }
        //关闭弹出框
        this.showDialog = false;
      },
      openPop() {
        this.form = "";
        this.showDialog = true;
      },
      edit(index, tableData) {
        this.form = tableData[index];
        this.showDialog = true;
      },
      getData() {
        this.$http.get(`${UMS}/func/funcList.do`).then(res => {
          let data = res.data.data
          this.tableData = data.funcs;
        }).catch(e => console.log);
      }
    }
  }
</script>
