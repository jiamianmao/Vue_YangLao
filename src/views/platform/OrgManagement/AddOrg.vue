<template>
    <page-container title="添加机构" show-back-btn>
        <el-form :model="userForm" label-position="left"
                 label-width="110px"
                 class="info-container"
                     :rules="rules"
                 ref="userForm"
                 inline>
                <el-row>
                    <template v-for="n in addressNum">
                        <cityArea prop="serviceAreas"
                                  title="服务区域"
                                  ref="area"
                                  @select-change="selectChange"
                                  :curNum="n"
                                  :check="true">
                        </cityArea>
                    </template>
                <el-button type="primary" size="small" @click="addArea">＋</el-button>
                <el-button type="plain" size="small" @click="cutArea" v-if="addressNum>1">－</el-button>
                </el-row>
                        <el-form-item label="机构名称" prop="name">
                            <el-input v-model="userForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="机构性质" prop="type">
                            <el-input v-model="userForm.type"></el-input>
                        </el-form-item>
                        <el-form-item label="机构地址" prop="address">
                            <el-input v-model="userForm.address"></el-input>
                        </el-form-item>
                        <el-form-item label="经营范围" prop="ranges">
                            <el-input v-model="userForm.ranges"></el-input>
                        </el-form-item>
                        <el-form-item label="注册资金" prop="capital">
                            <el-input v-model.number="userForm.capital"></el-input>
                        </el-form-item>
                        <el-form-item label="法人代表" prop="represent">
                            <el-input v-model="userForm.represent"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="phone">
                            <el-input v-model="userForm.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="职工总数" prop="workerCount">
                            <el-input v-model.number="userForm.workerCount"></el-input>
                        </el-form-item>
                        <el-form-item label="业务范围" prop="business">
                            <el-input v-model="userForm.business"></el-input>
                        </el-form-item>
                        <el-form-item label="注册登记部门" prop="regDepartment">
                            <el-input v-model="userForm.regDepartment"></el-input>
                        </el-form-item>
                        <el-form-item label="注册登记时间" prop="regTime">
                            <el-date-picker
                                    type="date"
                                    placeholder="选择日期"
                                    v-model="userForm.regTime"
                                    style="width: 100%;">
                            </el-date-picker>
                        </el-form-item>
                <el-form-item label="机构联系人" class="must">
                    <el-form-item prop="contacts">
                        <el-input v-model="userForm.contacts" placeholder="姓名"></el-input>
                    </el-form-item>
                    <el-form-item prop="post">
                        <el-input v-model="userForm.post" placeholder="职务"></el-input>
                    </el-form-item>
                    <el-form-item prop="contactsPhone">
                        <el-input v-model="userForm.contactsPhone" placeholder="联系电话"></el-input>
                    </el-form-item>
                </el-form-item>
            <!-- style="height: 110px;"-->
                <el-row class="must">
                    <el-form-item label="经营许可证" prop="pic_url">
                        <el-upload action="http://upload.17link.cc/upload.do"
                               :on-success="handleAvatarSuccess"
                               :before-upload="beforeAvatarUpload"
                               :multiple="false">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">文件不超过10M</div>
                        </el-upload>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="企业基本状况" prop="basicCondition">
                    <el-input type="textarea"
                              v-model="userForm.basicCondition"
                              :autosize="{minRows:2,maxRows:6}"
                              resize="none"
                              placeholder="请填写企业基本概况"></el-input>
                        </el-form-item>
                </el-row>
                <el-row>
                        <el-form-item label="机构等级" class="must">
                            <el-rate v-model="userForm.level"></el-rate>
                        </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label=" ">
                        <el-button type="primary" @click="save('form')">保存</el-button>
                        <el-button type="plain" @click="next">保存下一条</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
    </page-container>
</template>
<script>
  import PageContainer from '../../../components/PageContainer.vue';
  import cityArea from '../../../components/ServiceArea.vue';
  import { UMS } from '@/common/config'

    export default {
        data(){
            const validate = async (rule, value, cb) => {
                if (value > 0) {
                    cb();
                } else {
                    cb(new Error('请输入大于零的数字'));
                }
            };
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
                    serviceAreas:[]
                },
                fileData:{
                    type: ""
                },
                addressNum: 1,
                curNum: 0,
                addressList:[],
                rules:{
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
                        {validator: validate,trigger: 'blur'}
                    ],
                    represent: [
                        { required: true, message: '法人代表不能够为空', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '联系电话不能够为空', trigger: 'blur' }
                    ],
                    workerCount: [
                        {type: 'number', required: true, message: '职工总数不能够为空且为数字', trigger: 'blur' },
                        {validator: validate,trigger: 'blur'}
                    ],
                    business: [
                        { required: true, message: '业务范围不能够为空', trigger: 'blur' }
                    ],
                    regDepartment: [
                        { required: true, message: '注册登记部门不能够为空', trigger: 'blur' }
                    ],
                    regTime: [
                        { type: 'date',required: true, message: '注册时间不能够为空', trigger: 'blur' }
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
                    fileList:[
                        { required: true, message: '经营许可证不能够为空', trigger: 'blur' }
                    ],
                    serviceAreas:[
                        { required: true, message: '服务区域不能为空', trigger: 'blur' }
                    ]
                },
            }
        },
        components: {
          cityArea,
          PageContainer,
        },
        methods: {
            selectChange(areaData,n){
                let num = n-1;
                if(num < 0) num = 0;
                this.addressList[num] = areaData;
            },
            save(){
                let _this = this;
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        _this.userForm.serviceAreas = [];

                        for(let i = 0 ; i < _this.addressList.length ; i++){
                            if(_this.addressList[i])
                                _this.userForm.serviceAreas.push(_this.addressList[i]);
                        }

                        _this.$http.post(`${UMS}/org/addOrg.do`, _this.userForm)
                            .then(res=>{
                                this.$router.push({
                                    path: "/pt/AddOrgAccount",
                                    query:{
                                        id: res.data.data.orgId
                                    }
                                });
                            })
                            .catch(e=>console.log)
                    }
                });
            },
            next(){
                let _this = this;
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        _this.userForm.serviceAreas = [];

                        for(let i = 0 ; i < _this.addressList.length ; i++){
                            if(_this.addressList[i])
                                _this.userForm.serviceAreas.push(_this.addressList[i]);
                        }
                        _this.$http.post(`${UMS}/org/addOrg.do`,_this.userForm)
                            .then(data=>{
                                //跳到添加账号
                                _this.$router.go(0);
                            })
                            .catch(e=>console.log)
                    }
                });
            },
            addArea(){
                this.addressNum +=1;
                this.addressList.length = this.addressNum;
            },
            cutArea(){
                this.addressNum -=1;
                if(this.addressNum < 0 ) this.addressNum = 0;
                this.addressList.length = this.addressNum;
            },
            handleAvatarSuccess(res) {
                if(arguments[2].length > 1){
                    arguments[2].shift();
                }
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
    }
</script>
<style lang="scss">
    .must{
        .el-form-item__label::before{
            content: '*';
            color: #ff4949;
            margin-right: 4px;
            margin-left: 10px;
        }
    }
    .info-container{
        ul.el-upload-list{
            li{
                height: 24px;
            }
        }

    }

</style>
