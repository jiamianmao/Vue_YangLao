<template>
    <page-container title="角色详情" show-back-btn>
        <chunk-label title="基本信息">
            <el-button type="plain" size="small" icon="el-icon-edit" @click="editRoleInfo">修改</el-button>
        </chunk-label>
        <el-row>
            <el-form class="info-container" label-width="100px" label-position="left">
                <el-col :span="12">
                    <el-form-item label="角色编码">
                        <span>{{roleInfo.id}}</span>
                    </el-form-item>
                    <el-form-item label="角色名称">
                        <span>{{roleInfo.name}}</span>
                    </el-form-item>
                    <el-form-item label="角色状态">
                        <span>{{roleInfo.state == 1 ? "正常" : roleInfo.state ? "失效" : "正常"}}</span>
                    </el-form-item>
                    <el-form-item label="角色类型">
                        <span>{{roleInfo.typeShow}}</span>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <chunk-label title="菜单权限">
            <el-button type="plain" icon="el-icon-setting" size="small" @click="editRolefunc">配置</el-button>
        </chunk-label>
        <el-table
                class="table"
                :data="funList"
                border
                style="width: 80%">
            <el-table-column
                    prop="pName"
                    label="系统名称"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="mask"
                    label="菜单编码"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="level"
                    label="菜单级别"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="菜单名称"
                    align="center">
            </el-table-column>
        </el-table>
        <rolePoPup title="修改角色"
                   :roleInfo="roleInfo"
                   @pop-click="dialogClick"
                   v-if="showDialog">
        </rolePoPup>
        <rolefunc v-if="showFuncDialog"
                  :ownFuncs="funcIdArr"
                  :roleId="roleInfo.id"
                  :all="allFunc"
                  @pop-click="funcClick">
        </rolefunc>
    </page-container>
</template>


<script>
  import ChunkLabel from '../../../../components/FormChunkLabel.vue';
  import PageContainer from '../../../../components/PageContainer.vue';
  import rolePoPup from "../rolePoPup/rolePoPup.vue"
  import rolefunc from "../roleFunc/roleFunc.vue"
  import { UMS } from '@/common/config'

  export default {
    data() {
      return {
        roleInfo: {
          id: "",
          name: "",
          status: "",
          type: "",
          typeShow: '',
        },
        typeMap: {
          '0': '平台',
          '1': '机构',
          '2': '政府'
        },
        funList: [],
        funcIdArr: [],
        showDialog: false,
        showFuncDialog: false,
        allFunc: []
      }
    },
    components: {
      rolePoPup,
      rolefunc,
      PageContainer,
      ChunkLabel,
    },
    created() {
      this.roleInfo.id = this.$route.query.id;
      this.getData();
      this.getAllFunc();

    },
    methods: {
      goBack() {
        this.$router.back();
      },

      editRoleInfo() {
        this.showDialog = true;
      },

      editRolefunc() {
        this.showFuncDialog = true;
      },

      dialogClick(...arr) {
        if (arr.length === 2) {
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

          if (formData.hasOwnProperty('typeShow')) delete formData.typeShow;
          //发送请求 未进入该代码块则表示点击了取消按钮
          this.$http.post(`${UMS}/role/saveRole.do`, formData).then(data => {
            alert("操作成功");
          }).catch(e => console.log);
        }
        //关闭弹出框
        this.showDialog = false;
      },

      funcClick(...arr) {
        if (arr.length > 0) {
          let funs = arr[0];
          let id = arr[1];
          this.$http.post(`${UMS}/roleFunc/updateFuncByRoleId.do`, {
            roleId: id,
            funcIds: funs
          }).then(data => {
            this.getData();
          }).catch(e => console.log);
        }
        this.showFuncDialog = false;
      },
      getAllFunc() {
        this.$http.get(`${UMS}/func/getAllFunc.do`).then(res => {
          this.allFunc = res.data.data.funcs;
          console.log(this.allFunc);
        }).catch(e => console.log);
      },
      getData() {
        this.$http.post(`${UMS}/role/getRoleByRoleId.do`, 'id=' + this.roleInfo.id).then(res => {
          let data = res.data.data
          this.roleInfo = data.role;
          this.funList = data.funcs;
          this.roleInfo.typeShow = this.typeMap[this.roleInfo.type];
          this.funcIdArr = [];
          this.funList.forEach(v => {
            this.funcIdArr.push(v.id);
          });
        }).catch(e => console.log);
      }
    }
  }
</script>
