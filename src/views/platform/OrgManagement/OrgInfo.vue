<template>
    <page-container title="机构信息" show-back-btn>
        <chunk-label title="基本信息">
            <el-button type="plain" icon="el-icon-edit" size="small" @click="editInfo" class="button">编辑</el-button>
        </chunk-label>
        <el-form :model="userForm" label-position="left"
                 label-width="110px"
                 class="info-container"
                 :rules="rules"
                 ref="form">
            <el-row class="area">
                <template v-for="n in addressNum">
                    <cityArea
                            :ifEdit="ifEdit"
                            title="服务区域"
                            :serviceArea="userForm.serviceAreas[n-1]"
                            prop="desc"
                            ref="area"
                            @select-change="selectChange"
                            :curNum="n"
                            check="true">
                    </cityArea>
                </template>
                <div class="area-button" v-if="!ifEdit">
                    <el-button type="primary" @click="addArea">＋</el-button>
                    <el-button type="primary" @click="cutArea" v-if="addressNum > 1">－</el-button>
                </div>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="机构名称" prop="name">
                        <el-input v-model="userForm.name" :disabled="ifEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="机构性质" prop="type">
                        <el-input v-model="userForm.type" :disabled="ifEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="机构地址" prop="address">
                        <el-input v-model="userForm.address" :disabled="ifEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="经营许可证" prop="picUrl">
                        <el-upload
                                action="http://upload.17link.cc/upload.do"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload"
                                :multiple="false"
                                :data="{file:'经营许可证'}"
                                v-if="!ifEdit">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">文件不超过10M</div>
                        </el-upload>
                        <span class="download" v-else-if="!userForm.picUrl">未上传经营许可证</span>
                        <a download="test" v-else class="download"
                           :href=userForm.picUrl>
                            下载查看文件
                        </a>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="经营范围" prop="ranges">
                        <el-input v-model="userForm.ranges" :disabled="ifEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="注册资金" prop="capital">
                        <el-input v-model.number="userForm.capital" :disabled="ifEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="法人代表" prop="represent">
                        <el-input v-model="userForm.represent" :disabled="ifEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="userForm.phone" :disabled="ifEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="职工总数" prop="workerCount">
                        <el-input v-model.number="userForm.workerCount" :disabled="ifEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="业务范围" prop="business">
                        <el-input v-model="userForm.business" :disabled="ifEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="注册登记部门" prop="regDepartment">
                        <el-input v-model="userForm.regDepartment" :disabled="ifEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="注册登记时间" prop="regTime">
                        <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="userForm.regTime"
                                style="width: 100%;"
                                :disabled="ifEdit">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="机构联系人" prop="contacts">
                        <el-input v-model="userForm.contacts" :disabled="ifEdit"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="职务" prop="post" label-width="70px" class="m-l">
                        <el-input v-model="userForm.post" :disabled="ifEdit"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="联系电话" prop="contactsPhone" label-width="80px" class="m-l">
                        <el-input v-model="userForm.contactsPhone" :disabled="ifEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="企业基本状况" prop="basicCondition">
                        <el-input type="textarea"
                                  v-model="userForm.basicCondition"
                                  :disabled="ifEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="机构等级" prop="level">
                        <el-rate v-model="userForm.level"
                                 :disabled="ifEdit"
                                 class="stars"></el-rate>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-row v-if="!ifEdit">
            <el-button type="primary" @click="save">保存</el-button>
        </el-row>
    </page-container>
</template>
<script>

  import PageContainer from '../../../components/PageContainer.vue';
  import ChunkLabel from '../../../components/FormChunkLabel.vue';
  import cityArea from '../../../components/ServiceArea.vue';
  import { UMS } from '@/common/config'

  export default {
    data() {
      return {
        userForm: {
          name: "",
          address: "",
          type: "",
          picUrl: "",
          ranges: "",
          capital: "",
          represent: "",
          phone: "",
          workerCount: "",
          business: "",
          regDepartment: "",
          regTime: "",
          contacts: "",
          post: "",
          contactsPhone: "",
          basicCondition: "",
          level: 0,
          serviceAreas: []
        },
        addressNum: 0,
        curNum: 0,
        addressList: [],
        fileList: [
        ],
        rules: {
          name: [
            { required: true, message: '机构名称不能够为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '机构性质不能够为空', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '机构地址不能够为空', trigger: 'blur' }
          ],
          ranges: [
            { required: true, message: '经营范围不能够为空', trigger: 'blur' }
          ],
          capital: [
            { type: 'number', required: true, message: '注册资金不能够为空且为数字', trigger: 'blur' },
          ],
          represent: [
            { required: true, message: '法人代表不能够为空', trigger: 'blur' }
          ],
          phone: [
            { type: 'number',length: 11,required: true, message: '联系电话不能够为空', trigger: 'blur' }
          ],
          workerCount: [
            {type: 'number', required: true, message: '职工总数不能够为空且为数字', trigger: 'blur' },
          ],
          business: [
            { required: true, message: '业务范围不能够为空', trigger: 'blur' }
          ],
          regDepartment: [
            { required: true, message: '注册登记部门不能够为空', trigger: 'blur' }
          ],
          regTime: [
            { type: 'date', required: true, message: '注册时间不能够为空', trigger: 'blur' }
          ],
          contacts: [
            { required: true, message: '机构联系人不能够为空', trigger: 'blur' }
          ],
          post: [
            { required: true, message: '职务不能够为空', trigger: 'blur' }
          ],
          contactsPhone: [
            { required: true, message: '联系电话不能够为空', trigger: 'blur' }
          ],
          basicCondition: [
            { required: true, message: '企业基本状况不能够为空', trigger: 'blur' }
          ],
          level: [
            { required: true, message: '机构等级不能够为空', trigger: 'blur' }
          ],
          picUrl: [
            { required: true, message: '经营许可证不能够为空', trigger: 'blur' }
          ]
        },
        ifEdit: true,
        areas: [],
        id: ""
      }
    },
    components: {
      cityArea,
      PageContainer,
      ChunkLabel,
    },
    created() {
      //根据id获取机构信息
      this.id = this.$route.query.id;
      this.getInfo(this.id);
    },
    methods: {
      selectChange(areaData, n) {
        let num = n - 1;
        if (num < 0) num = 0;
        this.addressList[num] = areaData;
      },
      checkData(){
        let data = this.userForm;
        if( data.name.trim() === '' || data.address.trim() === '' ||
            data.type.trim() === '' || data.ranges.trim() === '' ||
            data.capital === '' || data.phone === '' ||
            data.workerCount === '' || data.business.trim() === '' ||
            data.regDepartment.trim() === '' || data.regTime === '' ||
            data.contacts.trim() === '' || data.post.trim() === '' ||
            data.contactsPhone === '' || data.basicCondition.trim() === '' ||
            data.level === ''){
            alert('请按照规则填写数据');
            return false;
        }
        return true;
      },
      save() {
       if(this.addressList.length > 0){
           let temp = [];
           for (let i = 0; i < this.addressList.length; i++) {
              if (this.addressList[i])
                  temp.push(this.addressList[i]);
           }
          this.userForm.serviceAreas = temp;
       }

       if(!this.checkData()) return false;

       this.$http.post(`${UMS}/org/updateOrg.do`, this.userForm)
        .then(data => {
          alert('修改成功');
          //跳到添加账号
          this.$router.push({ path: "/pt/orgMana" });
        })
        .catch(e => console.log)
      },
      addArea() {
        this.addressNum += 1;
        this.addressList.length = this.addressNum;
      },
      cutArea() {
        this.addressNum -= 1;
        if (this.addressNum < 0) this.addressNum = 0;
        this.addressList.length = this.addressNum;
      },
      editInfo() {
        this.ifEdit = false;
        //如果点击编辑之后地址数量为零，则默认增加一个地址栏
        if (this.addressNum === 0) this.addressNum = 1;
      },
      getInfo(id) {
        this.$http.get(`${UMS}/org/getOrgById.do?id=` + id).then(res => {
            let data = res.data.data
          this.userForm = data.org;
          //获取服务地址数量
          this.addressNum = data.org.serviceAreas.length;
          this.addressList = data.org.serviceAreas;
        }).catch(e => console.log);
      },
      handleAvatarSuccess(res) {
          if(arguments[2].length > 1){
              arguments[2].shift();
          }
          this.userForm.picUrl = res.data.url;
        this.userForm.picUrl = res.data.url;
      },
      beforeAvatarUpload(file) {
          const isLtM = file.size / 1024 / 1024 < 10;
          if (!isLtM) {
              this.$message.error('上传头像图片大小不能超过 10MB!');
          }
          return isLtM;
      }
    },
    watch: {}
  }
</script>
<style lang="scss">
    .info-container {
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

        .my-form {
            background-color: #FBFBFB;
            padding-bottom: 50px;
            border: 1px solid #CAD3DF;
            border-top: none;
            padding-left: 31px;
            h4 {
                font-size: 22px;
                color: #616d80;
            }
            .button {
                margin: 10px 0;
            }
            .area {
                position: relative;
                .area-button {
                    position: absolute;
                    top: 0px;
                    right: 0;
                    width: 15%;
                }
            }
            .stars {
                padding-top: 8px;
            }
            .m-l {
                margin-left: 20px;
            }

            .download {
                width: 100%;
                cursor: pointer;
            }
        }

        ul.el-upload-list{
            li{
                height: 24px;
            }
        }
    }
</style>
