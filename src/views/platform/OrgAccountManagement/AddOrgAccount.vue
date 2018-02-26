<template>
    <page-container title="添加机构账号" show-back-btn>
        <el-form :model="userForm" ref="userForm" label-position="left"
                 label-width="100px" class="info-container" :rules="rules">
            <el-row>
                <el-col :span="20">
                    <el-form-item label="服务区域">
                        <cityArea prop="desc"
                                  ref="area"
                                  @select-change="selectChange"
                                  v-if="ifShow">
                        </cityArea>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="7">
                    <el-form-item v-if="ifShow" label="机构名称：" prop="orgName">
                        {{userForm.orgName}}
                        <el-button @click="chooseOrg">选择服务机构</el-button>
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="userForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="username">
                        <el-input v-model.number="userForm.username"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item>
                <el-button type="primary" @click="save(false)">保存</el-button>
                <el-button type="plain" @click="save(true)">保存下一条</el-button>
            </el-form-item>
        </el-form>
        <orgChoose v-if="showDialog"
                   @pop-click="dialogClick"
                   :areaData="addressList">
        </orgChoose>
    </page-container>
</template>
<script>
  import PageContainer from '../../../components/PageContainer.vue';
  import cityArea from '../../../components/ServiceArea.vue';
  import orgChoose from '../../../components/OrgChoose.vue';
  import { ERR_OK, UMS } from '../../../common/config.js'

  export default {
    data() {
      const validatePhone = async (rule, value, cb) => {
        if (/^1[1-9]\d{9}$/.test(value)) {
          try {
            await this.$http.get(`${UMS}/user/getUserByUserName.do?username=${this.userForm.username}`);
            cb();
          } catch (e) {
            setTimeout(() => {
              cb(new Error(e.message));
            }, 3000);
          }
        } else {
          cb(new Error('请输入有效的手机号码'));
        }
      };

      return {
        userForm: {
          name: "",
          username: "",
          type: window._dataInfo.type,
          orgName: '',
          orgId: '',
          addUserId: window._dataInfo.id, //创建人id
          addUserName: window._dataInfo.name//创建人姓名
        },
        ifShow: true,
        rules: {
          name: [
            { required: true, message: '用户姓名不能为空' }
          ],
          orgName: [
            { required: true, message: '机构姓名不能为空' }
          ],
          username: [
            { type: 'number', required: true, message: '请输入电话号码', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' }
          ],
        },
        showDialog: false,
        id: window._dataInfo.id, //账号id
        addressList: [],
      }
    },
    components: {
      cityArea,
      orgChoose,
      PageContainer,
    },
    created() {
      if (this.$route.query.id && this.$route.query.name) {
        this.userForm.orgId = this.$route.query.id;
        this.userForm.orgName = this.$route.query.name;
        this.ifShow = false;
      }
    },
    methods: {
      selectChange(area) {
        this.addressList = area;
      },
      save(isContinue) {
        this.$refs.userForm.validate(async valid => {
          if (valid) {
            const res = await this.$http.post(`${UMS}/user/addUser.do`, this.userForm);
            if (res.data.errCode === ERR_OK) {
              let { id } = res.data.data
              if (isContinue) {
                this.$refs.userForm.resetFields();
              } else {
                this.$router.push({
                  path: '/pt/AccountInfo',
                  query: { id }
                })
              }
            } else {
              alert(res.data.errMessage)
            }
          }
        })
      },
      chooseOrg() {
        this.showDialog = true;
      },
      dialogClick(org) {
        if (org && org.id && org.name) {
          this.userForm.orgName = org.name;
          this.userForm.orgId = org.id;
        }
        this.showDialog = false;
      }
    }
  }
</script>
