<template>
    <page-container title="账号详情" show-back-btn>
        <chunk-label title="基本信息">
            <el-button type="plain" size="small" icon="el-icon-edit" @click="edit">修改</el-button>
        </chunk-label>
        <el-row>
            <el-form class="info-container" label-width="100px" label-position="left">
                <el-col :span="12">
                    <el-form-item label="所属机构">
                        <span>{{userInfo.orgName}}</span>
                    </el-form-item>
                    <el-form-item label="账号类型">
                        <span>{{userInfo.category}}</span>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <span>{{userInfo.name}}</span>
                    </el-form-item>
                    <el-form-item label="账号">
                        <span>{{userInfo.username}}</span>
                    </el-form-item>
                    <el-form-item label="账号状态">
                        <span>{{userInfo.statusShow}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="创建人">
                        <span>{{userInfo.addUserName}}</span>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <span>{{userInfo.addTime | formatDate}}</span>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <chunk-label title="角色">
            <el-button type="plain" icon="el-icon-edit" size="small" @click="editRole">修改</el-button>
        </chunk-label>
        <el-table class="table"
                  :data="ownFuncs"
                  border>
            <el-table-column prop="name" align="center">
            </el-table-column>
        </el-table>
        <editRole v-if="showDialog"
                  @pop-click="dialogClick"
                  :ownFuncs="ownFuncs"
                  :allFuncs="allFuncs">
        </editRole>
        <editOrgInfo :userInfo="userInfo"
                     @pop-click="conformEdit"
                     v-if="showEditInfoDialog">
        </editOrgInfo>
    </page-container>
</template>


<script>
  import ChunkLabel from '@/components/FormChunkLabel.vue';
  import PageContainer from '@/components/PageContainer.vue';
  import editRole from '@/components/editRole.vue';
  import editOrgInfo from '@/views/platform/OrgAccountManagement/editOrgInfo.vue';
  import { UMS } from '@/common/config'

  export default {
    data() {
      return {
        tableData: [],
        userInfo: {
          orgName: "",
          category: "",
          name: "",
          username: "",
          status: "",
          addUserName: "",
          addTime: "",
          type: window._dataInfo.type
        },
        showDialog: false,
        showEditInfoDialog: false,
        ownFuncs: [],
        allFuncs: [],
        userId: "",
        source: '',
        tempObj:{}
      }
    },
    components: {
      editRole,
      editOrgInfo,
      PageContainer,
      ChunkLabel,
    },
    created() {
      this.userId = this.$route.query.id;
      this.getUserInfo(this.getAllRoles);
    },
    methods: {
      edit() {
        this.showEditInfoDialog = true;
      },
      dialogClick(...arr) {
        if (arr.length > 0) {
          let roleIds = arr[0]
          this.$http.post(`${UMS}/userRole/addUserRole.do`, {
            userId: this.userId,
            roleIds: roleIds
          }).then(data => {
            this.$router.go(0)
          }).catch(e => console.log)
        }
        this.showDialog = false
      },
      editRole() {
        this.showDialog = true
      },
      getUserInfo(fn) {
        this.$http.get(`${UMS}/user/getUserAndRolesById.do?id=${this.userId}`).then(res => {
          let data = res.data.data
          this.userInfo = data.user
          this.userInfo.addTime = new Date(this.userInfo.addTime)
          this.userInfo.statusShow = (this.userInfo.status === 1 ? "正常" : "失效")
          this.userInfo.category = (this.userInfo.category === 1 ? "主账号" : "子账号")
          this.ownFuncs = data.roles || []
          if (fn) fn()
        }).catch(e => console.log)
      },
      getAllRoles() {
        console.log('type', this.userInfo.type)
        this.$http.get(`${UMS}/role/getRoleByType.do?type=${this.userInfo.type}`).then(res => {
          this.allFuncs = res.data.data.roles
        }).catch(e => console.log);
      },
      conformEdit(...arr) {
        if (arr.length > 0) {
          let data = arr[0];
          this.$http.get(`${UMS}/user/updateUser.do?id=` + data.id + '&status='
            + data.status + '&name=' + data.name).then(data => {
            this.$router.go(0);
          }).catch(e => console.log);
        }
        this.showEditInfoDialog = false;
      }
    }
  }
</script>
