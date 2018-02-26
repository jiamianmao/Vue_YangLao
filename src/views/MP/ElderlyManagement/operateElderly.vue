<template>
    <PageContainer class="add-oper" :title='title'>
        <!--<div class="head clearfix">
            <h5 class="fl" v-if="id">老人详情</h5>
            <h5 class="fl" v-else>添加老人</h5>
            <div></div>
        </div>-->
        <div class="my-form">
            <el-row>
                <el-button class="back-btn" icon="el-icon-arrow-left" type="plain" @click="$router.back()">返回</el-button>
                <!--<el-button  type="primary" @click="editInfo" class="button">编辑</el-button>-->
            </el-row>
            <!--<el-row >-->
            <!--</el-row>-->
            <el-form :model="userForm" label-position="left"
                     label-width="150px"
                     class="demo-ruleForm"
                     :rules="rules"
                     ref="userForm">
                <form-chunk-label title="老人基本信息">
                    <el-button v-if="id && type !== 2"
                               icon="el-icon-edit"
                               type="primary"
                               size="small"
                               @click="editInfo">
                        修改
                    </el-button>
                </form-chunk-label>
                <div class="oper-base-info">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-if=" type === 0" v-model="userForm.name" :disabled="controlState" ></el-input>
                                <el-input v-else v-model="userForm.name" :disabled="!!id"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="老人性别" prop="sex">
                                <el-select v-if=" type === 0" v-model="userForm.sex" placeholder="请选择机构状态" :disabled="controlState">
                                    <el-option label="男" value="1"></el-option>
                                    <el-option label="女" value="2"></el-option>
                                </el-select>
                                <el-select v-else v-model="userForm.sex" placeholder="请选择机构状态" :disabled="!!id">
                                    <el-option label="男" value="1"></el-option>
                                    <el-option label="女" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="民族" prop="nation">
                                <el-select v-model="userForm.nation" placeholder="请选择民族" :disabled="controlState">
                                    <el-option
                                            v-for="item in enums.nation"
                                            :key="item.code"
                                            :label="item.text"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="政治面貌" prop="politicalStatus">
                                <el-select v-model="userForm.politicalStatus" placeholder="请选择" :disabled="controlState">
                                    <el-option
                                            v-for="(item,index) in politicalOutlook"
                                            :key="index"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="身份证号" prop="iDNumber">
                                <el-input
                                        v-model="userForm.iDNumber"
                                        :disabled="controlState"
                                        @blur="getBirthday"
                                        v-if=" type === 0"></el-input>
                                <el-input
                                        v-model="userForm.iDNumber"
                                        :disabled="!!id"
                                        @blur="getBirthday"
                                        v-else></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="出生日期" prop="birthday">
                                <el-input v-model="userForm.birthday" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="年龄" prop="age">
                                <el-input v-model="userForm.age" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="社保号码" prop="securityNo">
                                <el-input v-if=" type === 0" v-model="userForm.securityNo" :disabled="controlState"></el-input>
                                <el-input v-else v-model="userForm.securityNo" :disabled="!!id"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="手     机" prop="mobile">
                                <el-input v-model.number="userForm.mobile" :disabled="controlState"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="固定电话" prop="phone">
                                <el-input v-model="userForm.phone" :disabled="controlState"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="居住地址" prop="liveArea" class="must ml">
                        <e-area
                                check= "true"
                                :ifEdit= "controlState"
                                :data="residentialAddress"
                                @select-change="residentSelect">
                        </e-area>
                    </el-form-item>
                    <el-row>
                        <el-form-item label="服务地址" prop="serArea"  v-for=" n in addressNum" :key= "n" class="must ml">
                            <e-area check="true"
                                    :ifEdit = "controlState"
                                    :curNum = "n-1"
                                    :data="userForm.serviceAddress[n-1]"
                                    @select-change="serviceSelect">
                            </e-area>
                        </el-form-item>
                        <div v-if="!controlState">
                            <el-button type="primary" @click="addArea" class="control">+</el-button>
                            <el-button type="primary"
                                       @click="cutArea"
                                       class="control"
                                       v-if="addressNum > 1">-</el-button>
                        </div>

                    </el-row>
                    <el-row>
                        <el-form-item label="紧急联系人信息" v-for="n in emergencyContactNum" :key="n">
                            <e-info :ifEdit = "controlState"
                                    :curNum = "n-1"
                                    :info="emergencyContact[n-1]"
                                    @value-change="getEmergencyContact">
                            </e-info>
                        </el-form-item>
                        <template v-if="!controlState">
                            <el-button type="primary" @click="addEmergency" class="control">+</el-button>
                            <el-button type="primary"
                                       @click="cutEmergency"
                                       class="control"
                                       v-if="emergencyContactNum > 1">-</el-button>
                        </template>
                    </el-row>
                    <!--<el-row>-->
                        <!--<el-col :span="6">-->
                            <!--<el-form-item label="备注" prop="remark" class="must ml">-->
                                <!--<el-input type="textarea" v-model="userForm.remark" :disabled="controlState"></el-input>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                    <!--</el-row>-->
                    <!--<el-row>-->
                        <!--<el-col :span="6">-->
                            <!--<el-form-item label="附       件" prop="attachmentUrl" class="must ml">-->
                                <!--<el-upload-->
                                        <!--class="upload-demo"-->
                                        <!--action="http://upload.17link.cc/upload.do"-->
                                        <!--:on-success="handleAvatarSuccess"-->
                                        <!--:before-upload="beforeAvatarUpload"-->
                                        <!--:multiple="false"-->
                                        <!--:data="{file:'经营许可证'}"-->
                                        <!--v-if="!id">-->
                                    <!--<el-button size="small" type="primary">点击上传</el-button>-->
                                    <!--<div slot="tip" class="el-upload__tip">文件不超过2M</div>-->
                                <!--</el-upload>-->
                                <!--<a download="test" v-else class="download"-->
                                   <!--:href=userForm.attachmentUrl>-->
                                    <!--下载查看文件-->
                                <!--</a>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                    <!--</el-row>-->
                    <template v-if="!id">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="政府补助" prop="amount" class="must ml">
                                    <el-input v-model="userForm.amount"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="补助时间（开始-结束）" class="must ml">
                                    <el-date-picker
                                            v-model="time"
                                            type="datetimerange"
                                            placeholder="选择时间范围">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </template>
                </div>
                <form-chunk-label title="老人数据采集（非必填）">
                </form-chunk-label>
                <div class="oper-other-info">
                    <el-row>
                        <el-form-item label="宗教信仰" prop="religion">
                            <el-radio-group v-model="userForm.religion"
                                            :disabled="controlState">
                                <el-radio v-for="item in enums.religion"
                                          :key="item.code"
                                          :label="item.code">{{item.text}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="退休前工作" prop="occupation">
                            <el-radio-group v-model="userForm.occupation"
                                            :disabled="controlState">
                                <el-radio v-for="item in enums.occupation"
                                          :key="item.code"
                                          :label="item.code">{{item.text}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="收入来源" prop="incomeSource">
                            <el-checkbox-group v-model="userForm.incomeSource">
                                <el-checkbox v-for="item in enums.incomeSource"
                                             :key="item.code"
                                             :label="item.code"
                                             :disabled="controlState">{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="收入类别" prop="incomeLevel">
                            <el-radio-group v-model="userForm.incomeLevel"
                                            :disabled="controlState">
                                <el-radio v-for="item in enums.incomeLevel"
                                          :key="item.code"
                                          :label="item.code">{{item.text}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="自理能力" prop="selfCareLevel">
                            <el-checkbox-group v-model="userForm.selfCareLevel">
                                <el-checkbox v-for="item in enums.selfCareLevel"
                                             :key="item.code"
                                             :label="item.code"
                                             :disabled="controlState">{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="残疾类型（可多选）" prop="disabilityType" v-if="ifShowDisability">
                            <el-checkbox-group v-model="userForm.disabilityType">
                                <el-checkbox v-for="item in enums.disabilityType"
                                             :key="item.code"
                                             :label="item.code"
                                             :disabled="controlState">{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="残疾证等级" prop="disabilityLevel" v-if="ifShowDisability">
                            <el-radio-group v-model="userForm.disabilityLevel"
                                            :disabled="controlState">
                                <el-radio v-for="item in enums.disabilityLevel"
                                          :key="item.code"
                                          :label="item.code">{{item.text}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="是否独居" prop="liveAloneLevel">
                            <el-radio-group v-model="userForm.liveAloneLevel"
                                            :disabled="controlState">
                                <el-radio v-for="item in enums.liveAloneLevel"
                                          :key="item.code"
                                          :label="item.code">{{item.text}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="医疗类别" prop="medicalType">
                            <el-checkbox-group v-model="userForm.medicalType">
                                <el-checkbox v-for="item in enums.medicalType"
                                             :key="item.code"
                                             :label="item.code"
                                             :disabled="controlState">{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="目前照料方式（多选）" prop="takeCareType">
                            <el-checkbox-group v-model="userForm.takeCareType">
                                <el-checkbox v-for="item in enums.takeCareType"
                                             :key="item.code"
                                             :label="item.code"
                                             :disabled="controlState">{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="服务需求（可多选）" prop="serviceDemand">
                            <el-checkbox-group v-model="userForm.serviceDemand">
                                <el-checkbox v-for="item in enums.serviceDemand"
                                             :key="item.code"
                                             :label="item.code"
                                             :disabled="controlState">{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="减员原因" prop="downsizeReason">
                            <el-radio-group v-model="userForm.downsizeReason"
                                            :disabled="controlState">
                                <el-radio v-for="item in enums.downsizeReason"
                                          :key="item.code"
                                          :label="item.code">{{item.text}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-row>
                </div>
                <div class="userpic">
                    <el-upload :disabled="controlState"
                            class="avatar-uploader"
                            action="http://upload.17link.cc/upload.do"
                            :show-file-list="false"
                            :with-credentials='true'
                            :on-success="userpichandleAvatarSuccess"
                            :before-upload="userpicbeforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
            </el-form>
            <el-row v-if="!id">
                <el-button type="primary" @click="save('userForm')">保存</el-button>
                <el-button type="primary" @click="next">保存下一条</el-button>
            </el-row>
            <el-row v-else-if="!controlState">
                <el-button type="primary" @click="confirmInfo('userForm')">确认</el-button>
            </el-row>
        </div>
        <!--账户额度-->
        <div v-if="controlState" class="account">
            <form-chunk-label title="账户额度">
                <el-button type="primary" @click="recharge" class="button" v-if="type === 1">充值</el-button>
            </form-chunk-label>

            <tables :tableEles="tableEles"
                    :data='subsidyAmount'
            class="table">
            </tables>
        </div>
        <!--所属机构-->
        <div v-if="controlState" class="org">
            <form-chunk-label title="所属机构"> </form-chunk-label>
            <el-table :data="orgData" stripe border class="list" align="center">
                <el-table-column
                        prop="orgName"
                        label="机构名称">
                </el-table-column>
            </el-table>
        </div>
        <!--弹窗-->
        <popup :userId="this.id"
               @pop-click="dialogClick"
               v-if="showDialog">
        </popup>
    </PageContainer>
</template>
<script>
    import PageContainer from '@/components/PageContainer.vue'; 
    import eArea from './elderlyArea.vue';
    import eInfo from './emergencyContact.vue';
    import tables from '@/components/table.vue';
    import popup from './bankrollContral.vue';
    import { required, isMobile } from '../../../CommonRules';
    import { format } from 'date-fns';
    import FormChunkLabel from '@/components/FormChunkLabel.vue';
    import { MP } from '@/common/config'

    export default {
        data(){
            const validate = (rule, value, cb) => {
                if (/^\d{1,20}(\.\d{1,2})?$/.test(parseFloat(value))) {
                    cb();
                } else {
                    cb(new Error('请填入正确的金额'));
                }
            };
            return {
                userForm: {
                    managerId: window._dataInfo.id,
                    managerName: window._dataInfo.name,
                    name: "",
                    sex: "1",
                    userHeadPic: '',//
                    orgId: window._dataInfo.orgId,
                    orgName: window._dataInfo.orgName,
                    politicalStatus: "",
                    iDNumber: "",
                    birthday: "",
                    age: '',
                    securityNo: "",
                    mobile: "",
                    phone: "",
                    residentialAddress: {
                        "cityId": '',
                        "cityName":"",
                        "community":"",
                        "detailedAddress":"",
                        "provinceId": '',
                        "provinceName":"",
                        "streetId": '',
                        "streetName":"",
                        "zoneId": '',
                        "zoneName":""
                    },//居住地址
                    serviceAddress: [], //服务地址
                    emergencyContact: [], //紧急联系人
                    subsidyAmount: {
                        "end": '',
                        "orgName":"",
                        "residualAmount": '',
                        "start": '',
                        "totalAmont": '',
                        "type": ''
                    }, //政府补助
                    remark: "",
                    attachmentUrl: "",
                    amount: "",
                    allowanceStartDate: "",
                    allowanceEndDate: "",
                    religion: '' ,//信仰（单选）
                    occupation: '', //退休前工作（单选）
                    incomeSource: [],//收入来源（可多选）
                    incomeLevel: '',//收入类别（单选）
                    selfCareLevel: [],//自理能力（可多选）
                    liveAloneLevel: '',//是否独居（单选）
                    medicalType: [],//医疗类别（可多选）
                    takeCareType: [],//目前照料方式（可多选）
                    serviceDemand: [],//服务需求（可多选）
                    downsizeReason: '',//减员原因（单选，非必填）
                    disabilityType: [],//残疾类型（可多选）
                    disabilityLevel: '',//残疾证等级（单选）
                    nation: ""//民族
                },
                addressNum: 1,
                time: [],
                ifEdit: true,
                emergencyContactNum: 1,
                emergencyContact: [],
                residentialAddress:{
                    "cityId": '',
                    "cityName":"",
                    "community":"",
                    "detailedAddress":"",
                    "provinceId": '',
                    "provinceName":"",
                    "streetId": '',
                    "streetName":"",
                    "zoneId": '',
                    "zoneName":""
                },
                rules: {
                    name: required('姓名'),
                    sex: required('性别'),
                    politicalStatus: required('政治面貌'),
                    iDNumber: { type: 'string',length: 18, required: true, message: '请输入正确的身份证账号', trigger: 'blur' },
                    birthday: required('出生日期'),
                    age: required('年龄'),
                    securityNo: {
                        type: 'string',max:20,required: true, message: '请输入正确的社保账号', trigger: 'blur'
                    },
                    mobile: {
                        type: 'number', length: 11,required: true, message: '请输入正确的手机号码', trigger: 'blur'
                    },
                    phone: { type: 'string',max: 15, required: true, message: '请填入正确的座机号', trigger: 'blur' },
                    amount: [
                        { required: true, message: '请输入政府补助金', trigger: 'blur' },
                        { validator: validate, trigger: 'blur' }
                    ],
                    nation: required('民族')
                },
                tableEles: [
                    {
                        name: "类型",
                        value: "type",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "养老机构",
                        value: "orgName",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "使用开始时间",
                        value: "start",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "使用结束时间",
                        value: "end",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "总金额",
                        value: "totalAmont",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "剩余金额",
                        value: "residualAmount",
                        ifControl: false,
                        eventName: ""
                    }
                ],
                subsidyAmount: [],
                showDialog: false,
                orgData: [],
                type: window._dataInfo.type, //0平台1机构2政府
                imageUrl: '',//头像路径,
                enums:{
                    religion: [] ,//信仰（单选）
                    occupation: [], //退休前工作（单选）
                    incomeSource: [],//收入来源（可多选）
                    incomeLevel: [],//收入类别（单选）
                    selfCareLevel: [],//自理能力（可多选）
                    liveAloneLevel: [],//是否独居（单选）
                    medicalType: [],//医疗类别（可多选）
                    takeCareType: [],//目前照料方式（可多选）
                    serviceDemand: [],//服务需求（可多选）
                    downsizeReason: [],//减员原因（单选，非必填）
                    disabilityType: [],//残疾类型（可多选）
                    disabilityLevel: [],//残疾证等级（单选）
                    nation: []//民族
                },
                politicalOutlook:[
                    '中共党员',
                    '中共预备党员',
                    '共青团员',
                    '民革会员',
                    '民盟盟员',
                    '民建会员',
                    '民进会员',
                    '农工党党员',
                    '致公党党员',
                    '九三学社社员',
                    '台盟盟员',
                    '无党派民主人士',
                    '群众'
                ],
                serviceTime : '',
                id: ''
            }
        },
        components: {
            eArea,
            eInfo,
            tables,
            popup,
            FormChunkLabel,
            PageContainer
        },
        created(){
          this.id = this.$route.query.id;
          this.getEnums();
          if(this.id){
              this.getElderlyInfo();
          }
        },
        computed:{
            controlState: function(){
                if(this.id && this.ifEdit){
                    return true;
                }
                return false;
            },
            ifShowDisability: function(){
                if(this.userForm.selfCareLevel.indexOf(4) !== -1)
                    return true;
                return false;
            },
            title () {
              if (this.id) {
                return '老人详情'
              } else {
                return '添加老人'
              }
            }
        },
        methods: {
            //拉取后台字典项
            async getEnums(){
                try{
                    let res = await this.$http.get(`${MP}/manage/user/enums`)
                    let enums = res.data.data
                    this.enums = enums;
                    this.serviceTime = enums.time;
                }catch(e){
                    alert(e);
                }
            },
            //如果为显示信息 则拉取某一老人信息
            getElderlyInfo(){
                this.$http.post(`${MP}/manage/user/detail`,'id=' + this.id)
                    .then(res => {
                        let data = res.data.data
                        this.userForm = data;
                        this.emergencyContact = data.emergencyContact;
                        this.emergencyContactNum = this.emergencyContact.length;
                        this.residentialAddress = data.residentialAddress;
                        this.addressNum = data.serviceAddress.length;
                        //构造账户信息
                        this.subsidyAmount = [];
                        this.subsidyAmount.push(this.userForm.subsidyAmount);
                        this.subsidyAmount.forEach(v=>{
                            v.type = (v.type === 1? "政府":"其他");
                            v.start = format(v.start, 'YYYY-MM-DD HH:mm:SS');
                            v.end = format(v.end, 'YYYY-MM-DD HH:mm:SS');
                        });
                        this.imageUrl = this.userForm.userHeadPic;
                        this.userForm.mobile = this.userForm.mobile * 1;
                        //构造机构信息
                        this.orgData = [];
                        this.orgData.push({
                            orgName : this.userForm.orgName
                        });
                        this.userForm.religion = parseInt(this.userForm.religion);
                        this.userForm.occupation = parseInt(this.userForm.occupation);
                        this.userForm.incomeLevel = parseInt(this.userForm.incomeLevel);
                        this.userForm.liveAloneLevel = parseInt(this.userForm.liveAloneLevel);
                        this.userForm.downsizeReason = parseInt(this.userForm.downsizeReason);
                        this.userForm.disabilityLevel = parseInt(this.userForm.disabilityLevel);
                        this.getBirthday();
                    })
                    .catch(e=>console.log);
            },
            getEmergencyContact(info,num){
                this.userForm.emergencyContact[num] = info;
            },
            editInfo(){
                this.ifEdit = false;
            },
            confirmInfo(){
                let _this = this;
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        _this.userForm.id = _this.id;
                        let tempObj = this.userForm.subsidyAmount;
                        tempObj.end = new Date(tempObj.end).getTime();
                        tempObj.start = new Date(tempObj.start).getTime();
                        tempObj.type = tempObj.type === '政府'?1:2;

                        _this.userForm.userHeadPic = _this.imageUrl;

                        if(!_this.checkArgus()){
                            return false;
                        }

                        _this.$http.post(`${MP}/manage/user/update`,_this.userForm)
                            .then(data=>{
                                alert('更新成功');
                                _this.$router.back();
                            })
                            .catch(e=>alert(e))
                    } else {
                        alert("请按照规定格式填写信息");
                        return false;
                    }
                });
            },
            goback(){
                this.$router.back();
            },
            getBirthday(){
              if(this.userForm.iDNumber.length === 18){
                  let year = this.userForm.iDNumber.substring(6,10);
                  let month = this.userForm.iDNumber.substring(10,12);
                  let day = this.userForm.iDNumber.substring(12,14);
                  this.userForm.birthday = year+'年'+month+'月'+day+'日' ;
                  //计算年龄
                  this.userForm.age = this.getAge(this.serviceTime,year*1,month*1,day*1);

              }
            },
            checkArgus(){
//                if(!this.userForm.userHeadPic){
//                    alert('请上传头像');
//                    return false;
//                }

                if(this.userForm.residentialAddress.length <= 0){
                    alert('请选择居住地址');
                    return false;
                }

                if(this.userForm.serviceAddress.length <= 0){
                    alert('请选择服务地址');
                    return false;
                }

//                if(this.userForm.emergencyContact.length <= 0){
//                    alert('请填写紧急联系人');
//                    return false;
//                }

                return true;
            },
            save(){
                let _this = this;
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        if(_this.time.length > 0){
                            _this.userForm.allowanceStartDate = _this.time[0].getTime();
                            _this.userForm.allowanceEndDate = _this.time[1].getTime();
                        }else{
                            alert('请选择政府补助时间范围');
                            return false;
                        }

                        _this.userForm.userHeadPic = _this.imageUrl;
                        if(!_this.checkArgus()){
                            return false;
                        }

                        _this.$http.post(`${MP}/manage/user/add`,_this.userForm)
                            .then(data=>{
                                alert('添加成功');
                                _this.$router.back();
                            })
                            .catch(e=>alert(e))
                    } else {
                        alert("请按照规定格式填写信息");
                        return false;
                    }
                });
            },
            next(){
                let _this = this;
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        if(this.time.length > 0){
                            this.userForm.allowanceStartDate = this.time[0].getTime();
                            this.userForm.allowanceEndDate = this.time[1].getTime();
                        }else{
                            alert('请选择政府补助时间范围');
                            return false;
                        }

                        this.userForm.userHeadPic = this.imageUrl;

                        if(!this.checkArgus){
                            return false;
                        }



                        _this.$http.post(`${MP}/manage/user/add`,_this.userForm)
                            .then(data=>{
                                //跳到添加账号
                                _this.$router.go(0);
                            })
                            .catch(e=>alert(e))
                    } else {
                        alert("请按照规定格式填写信息");
                        return false;
                    }
                });
            },
            addArea(){
                this.addressNum +=1;
                this.userForm.serviceAddress.push({
                    "cityId":"",
                    "cityName":"",
                    "community":"",
                    "detailedAddress":"",
                    "provinceId":"",
                    "provinceName":"",
                    "streetId":"",
                    "streetName":"",
                    "zoneId":"",
                    "zoneName":""
                });
            },
            cutArea(){
                this.addressNum -=1;
                if(this.addressNum < 1 ) this.addressNum = 1;
                this.userForm.serviceAddress.pop();
            },
            addEmergency(){
                this.emergencyContactNum +=1;
                this.userForm.emergencyContact.push({
                    "mobile":"",
                    "name":"",
                    "phone":"",
                    "relation":""
                });
            },
            cutEmergency(){
                this.emergencyContactNum -=1;
                if(this.emergencyContactNum < 1 ) this.emergencyContactNum = 1;
                this.userForm.emergencyContact.pop();
            },
            residentSelect(area){
                console.log(area);
                this.userForm.residentialAddress = area;
            },
            serviceSelect(area,num){
                this.userForm.serviceAddress[num] = area;
            },
            // handleAvatarSuccess(res) {
            //     this.userForm.attachmentUrl = res.data.url;
            // },
            // beforeAvatarUpload(file) {
            //     const isLt2M = file.size / 1024 / 1024 < 10;
            //     if (!isLt2M) {
            //         this.$message.error('上传文件不能超过10m!');
            //     }
            //     return isLt2M;
            // },
            userpichandleAvatarSuccess(res){
                if (!res.data) {
                    alert(res.errMessage)
                    return
                }
                this.imageUrl = res.data.url;
                console.log('--------------------');
                console.log(this.imageUrl);
                console.log('--------------------');
            },
            userpicbeforeAvatarUpload(file){
                const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 1
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
                    return false
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 1MB!');
                    return false
                }
                return true
            },
            recharge(){
                this.showDialog = true;
            },
            dialogClick(data){
                if(data){
                    if(data.type === 2){
                        if(data.amount > this.subsidyAmount[0].residualAmount){
                            alert('余额不足，无法进行该操作');
                            return false;
                        }
                    }
                    this.$http.post(`${MP}/manage/user/recharge`,data)
                        .then(data=>{
                        alert('操作成功');
                        this.$router.go(0);
                    }).catch(e=>{
                        console.log(e);
                    });
                }
                this.showDialog = false;
            },
            getAge(serTime,birYear,birMonth,birDay){
                let nowYear = new Date(serTime).getFullYear();
                let nowMonth = new Date(serTime).getMonth()+1;
                let nowDay = new Date(serTime).getDate();
                let age = nowYear - birYear;
                    if (nowMonth <= birMonth) {
                        if (nowMonth === birMonth) {
                            //同月
                            if (nowDay < birDay) {
                                age--;
                            }
                        } else {
                            //当前月份 大于 生日月份
                            age--;
                        }
                    }
                    return age;
            }
        },
        watch:{

        }
    }
</script>
<style lang="scss" scoped>
    .add-oper {
        .head{
            background-color: #fff;
            h5{
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
            div{
                width: calc(100%-150px);
                height: 42px;
                background-color: #fff;
                border-bottom: 1px solid #CAD3DF;
            }
        }

        .my-form{
            // background-color: #FBFBFB;
            padding-bottom: 50px;
            // border: 1px solid #CAD3DF;
            border-top: none;

            .oper-other-info , .oper-base-info{
                padding-left: 31px;
                padding-top: 10px;
            }

            .back-btn{
                margin: 28px 0 28px 42px;
                color: #616d80;
            }

            .area{
                position: relative;
                .area-button{
                    position: absolute;
                    top: 0px;
                    right: 0;
                    width: 26%;
                }
            }
            .stars{
                padding-top: 8px;
            }
            .m-l{
                margin-left: 20px;
            }
            .el-form{
                .el-form-item{
                    .el-form-item__label::before{
                        content: '*';
                        color: #ff4949;
                        margin-right: 4px;
                        margin-left: 10px;
                    }
                }
            }
            .userpic{
                position: absolute;
                right: 174px;
                top: 236px;
                border: 1px solid #8c939d;
                .avatar-uploader .el-upload {
                    border: 1px dashed #d9d9d9;
                    border-radius: 6px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }
                .avatar-uploader .el-upload:hover {
                    border-color: #20a0ff;
                }
                .avatar-uploader-icon {
                    font-size: 28px;
                    color: #8c939d;
                    width: 178px;
                    height: 178px;
                    line-height: 178px;
                    text-align: center;
                }
                .avatar {
                    width: 178px;
                    height: 178px;
                    display: block;
                }
            }
        }
        .account{
            .table{
                width: 78.5%;
                margin: 0 auto;
            }
        }
        .org{

        }
        .download{
            width: 100%;
            color: black;
            cursor: pointer;
        }

        .ml{
          margin-left: -10px;
        }
    }
</style>
