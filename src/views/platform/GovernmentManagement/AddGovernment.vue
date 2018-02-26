<template>
    <page-container title="添加政府账号" show-back-btn>
        <el-form class="info-container"
                 ref="userForm"
                 :model="userForm"
                 label-position="left"
                 label-width="100px"
                 :rules="rules">
            <el-form-item label="行政区域" prop="provinceId">
                <cityArea prop="desc" ref="area" @select-change="selectChange" v-if="ifShow"></cityArea>
            </el-form-item>
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
            <el-form-item>
                <el-button type="primary" @click="save(false)">保存</el-button>
                <el-button type="plain" @click="save(true)">保存下一条</el-button>
            </el-form-item>
        </el-form>
    </page-container>
</template>
<script>
  import PageContainer from '../../../components/PageContainer.vue';
  import cityArea from '../../../components/ServiceArea.vue';
  import ElFormItem from '../../../../node_modules/element-ui/packages/form/src/form-item.vue';
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
          type: window._dataInfo.type,
          orgName: window._dataInfo.orgName,
          orgId: window._dataInfo.orgId,
          addUserId: window._dataInfo.id,       //创建人id
          addUserName: window._dataInfo.name //创建人姓名
        },
        ifShow: true,
        rules: {
          name: [
            { required: true, message: '用户姓名不能为空' }
          ],
          username: [
            { type: 'number', required: true, message: '请输入电话号码', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur' }
          ],
          provinceId: { required: true, message: '请选择行政区划' }
        },
      }
    },
    components: {
      ElFormItem,
      cityArea,
      PageContainer,
    },
    methods: {
      selectChange(areaData) {
        this.userForm.provinceId = areaData.provinceId;
        this.userForm.provinceName = areaData.provinceName;
        this.userForm.cityId = areaData.cityId;
        this.userForm.cityName = areaData.cityName;
        this.userForm.countryId = areaData.areaId;
        this.userForm.countryName = areaData.areaName;
        this.userForm.streetId = areaData.streetId;
        this.userForm.streetName = areaData.streetName;
      },
      /**
       * @param isContinue 是否继续录下一条
       */
      save(isContinue) {
        this.$refs.userForm.validate(async valid => {
          if (valid) {
            this.$http.post(`${UMS}/user/saveUser.do`, this.userForm).then(res => {
              let data = res.data
              if (data.errCode === 0) {
                let { id } = data.data
                if (isContinue) {
                  this.$refs.userForm.resetFields();
                } else {
                  this.$router.push({
                    path: '/pt/GovernmentInfo',
                    query: { id }
                  })
                }
              } else {
                alert(data.errMessage)
              }
            })
          }
        })
      }
    }
  }
</script>
