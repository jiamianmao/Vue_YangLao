<template>
    <page-container title="添加子账号" show-back-btn>
        <el-form :model="userForm" label-position="left" ref="form"
                 label-width="100px" class="info-container" :rules="rules">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="userForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="username">
                        <el-input v-model.number="userForm.username"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label=" ">
                <el-button type="primary" @click="save(false)">保存</el-button>
                <el-button type="primary" @click="save(true)">保存下一条</el-button>
            </el-form-item>
        </el-form>
    </page-container>
</template>
<script>
  import PageContainer from '@/components/PageContainer.vue';
  import { UMS } from '@/common/config'

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
          type: "",
          orgName: window._dataInfo.orgName,
          orgId: window._dataInfo.orgId,
          addUserId: window._dataInfo.id,       //创建人id
          addUserName: window._dataInfo.name //创建人姓名
        },
        id: '', //账号id
        ifShow: true,
        rules: {
          name: [
            { required: true, message: '用户姓名不能为空' }
          ],
          username: [
            { type: 'number', required: true, message: '请输入电话号码', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' }
          ],
        },
        showDialog: false
      }
    },
    components: {
      PageContainer,
    },
    methods: {
      save(isContinue) {
        this.$refs.form.validate(async valid => {
          if (valid) {
            this.$http.post(`${UMS}/user/addUser.do`, this.userForm).then(res => {
              if (res.data.errCode === 0) {
                let { id } = res.data.data
                if (isContinue) {
                  this.$refs.form.resetFields();
                } else {
                  this.$router.push({
                    path: '/inst/AccountInfo',
                    query: { id }
                  })
                }
              } else {
                alert(res.data.errMessage)
              }
            })
          }
        })
      }
    }
  }
</script>
