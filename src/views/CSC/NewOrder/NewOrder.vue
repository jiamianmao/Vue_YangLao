<template>
    <pageContainer title='创建新订单' class="new-order">
        <div class="myform">
            <el-form ref="form" :model="orderForm" label-width="120px" labelPosition="left">
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="请选择老人">
                            <el-select
                                    v-model="userNum"
                                    filterable
                                    remote
                                    placeholder="请输入老人姓名"
                                    :remote-method="remoteMethod"
                                    :disabled="!ifNew"
                                    @change="changeAdressArr">
                                <el-option
                                        v-for="(item,index) in userInfos"
                                        :key="index"
                                        :label="item._userShow"
                                        :value="index">
                                </el-option>
                                <!--:loading="loading"-->
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        总额度: {{amount}}元 当前剩余：{{balance}}元
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="请选择服务地址">
                            <el-select
                                    v-model="addressNum"
                                    placeholder="请选择服务地址"
                                    :disabled="!ifNew">
                                <el-option :value="0" label="无"></el-option>
                                <el-option
                                        v-for="(item,index) in serAddress"
                                        :key="index"
                                        :label="item.showAddress"
                                        :value="index">
                                </el-option>
                            </el-select>
                            <el-button type="text" @click="newAddress">添加地址</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="categories">
                    <el-col :span="7">
                        <el-form-item label="请选择服务项目">
                            <template v-for="n in groupNum">
                                <check-group :data= "groupData[n-1]"
                                             :ifNew= "ifNew"
                                             :num = "n-1"
                                             @checked="checked"
                                             :displayed="!(n === groupNum)"
                                             @group-selected = "groupSelect">
                                </check-group>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <div class="button-group">
                            <el-button class="button" type="primary" @click="addCheckBoxGroup">+</el-button>
                            <el-button class="button" type="primary" @click="reduceCheckBoxGroup" v-if="groupNum > 1">-</el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-row class="commodity-info">
                    <div>
                        服务时长合计: {{totleTime}}分钟
                    </div>
                    <div>
                        订单总额   : {{totlePrice}}元
                    </div>
                </el-row>
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="请选择服务人员">
                            <el-select
                                    v-model="serId"
                                    placeholder="请选择服务人员"
                                    :disabled="!ifNew">
                                <el-option
                                        v-for="item in serPeople"
                                        :key="item.id"
                                        :label="item._userShowInfo"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="dateList.length > 0 ">
                    <date-box
                            :dateList="dateList"
                            @date-select="getSerTime">
                    </date-box>
                </el-row>
                <el-row v-if="dateList.length > 0">
                    <time-box
                            :curTime="curTime"
                            :costTime="this.totleTime"
                            :useTime="usedTime"
                            @choose-time="chooseSerTime">
                    </time-box>
                </el-row>
                <div class="ser-time">
                    <div>选择的服务时间为:{{showTime}}</div>
                </div>
                <el-row>
                    <el-form-item label="请填写备注信息">
                        <el-input type="textarea" v-model="orderForm.remark"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <el-button @click="submit">提交订单</el-button>
            <el-button type="primary" @click="submitNext">提交录入下一条</el-button>
        </div>
        <add-address v-if="showDialog"
                     @pop-click="dialogClick">
        </add-address>
    </pageContainer>
</template>
<script>
    import checkGroup from '@/components/checkGroup.vue';
    import dateBox from '@/components/dateBox.vue';
    import timeBox from '@/components/TimeBox.vue';
    import addAddress from './popUp.vue';
    import PageContainer from '@/components/PageContainer.vue';
    import { MP } from '@/common/config'

    export default {
        data(){
            return{
                loading: true,
                orderForm: {
                    orgId: window._dataInfo.orgId, //window上获取
                    orgName: window._dataInfo.orgName,//window上获取
                    provinceId: '',
                    provinceName: '',
                    cityId: '',
                    cityName: '',
                    districtId: '',
                    districtName: '',
                    streetId: '',
                    streetName:'',
                    detailedAddress: '',
                    community: '',
                    userId: '',
                    userName: '',
                    userMobile: '',
                    workerId: '',
                    workerName: '',
                    workerPost: '',
                    workerMobile: '',
                    serviceTime: '',
                    remark: '',
                    source: 1,
                    duration: 0,
                    productList: [],
                },//表单提交的数据
               //老人选择部分用参数
                amount: '', //总额度
                balance: '',//余额
                serAddress: [],//地址数组
                addressNum: "",//选中的地址在地址数组中的位置
                userInfos: [],//老人的全部信息来自后台
                userNum: "",//选中的老人在老人全部信息数组中的位置
                ifNew: true,//是否是新增订单，为否为改派订单
                groupData:[],//所有品类数组
                categoryList: [],//所选品类数组
                groupNum: 1,//大品类个数
                ifAddGroup: false, //不能增加
                lastcateP: "",//最后一个选择的品类号
                groupTime: [],//每个品类所消耗时间
                groupPrice: [],//每个品类价格
                totleTime: 0,//总时间
                totlePrice: 0,//总价格
                serPeople: [],//服务人员列表
                workerPostDict: "",//职位字典
                serId : "", //服务人员Id
                dateList: [],//两周日期
                curTime: '', //当前选中的某一天
                usedTime: [],//阿姨被占用时间
                showDialog: false, //弹框控制器
                showTime: '' //显示选中的时间
            }
        },
        components: {
            checkGroup,
            dateBox,
            timeBox,
            addAddress,
            PageContainer
        },
        created(){
            //获取所有品类信息
            this.getProducts();
            //获取职位字典
            this.getWorkerPostDict();
            //获取所有服务人员信息
            this.getAllSerPeople();
        },
        methods: {
            makeSubmitStruct(){
                try{
                    let orderForm = this.orderForm;
                    let userInfos = this.userInfos;
                    let _this = this;
                    let workerInfo = this.serPeople.filter(v=>v.id === _this.serId)[0];
                    //构造服务地址
                    let adressItem = this.serAddress[this.addressNum];
                    console.log(adressItem);
                    orderForm.provinceId = adressItem.provinceId;
                    orderForm.provinceName = adressItem.provinceName;
                    orderForm.cityId = adressItem.cityId;
                    orderForm.cityName = adressItem.cityName;
                    orderForm.districtId = adressItem.zoneId;
                    orderForm.districtName = adressItem.zoneName;
                    orderForm.streetId = adressItem.streetId;
                    orderForm.streetName = adressItem.streetName;
                    orderForm.detailedAddress = adressItem.detailedAddress;
                    orderForm.community = adressItem.community;
                    //获取老人信息
                    orderForm.userId = userInfos[this.userNum].id;
                    orderForm.userName = userInfos[this.userNum].name;
                    orderForm.userMobile = userInfos[this.userNum].mobile;
                    orderForm.userPhone = userInfos[this.userNum].phone;
                    //获取服务人员信息
                    orderForm.workerId = workerInfo.id;
                    orderForm.workerName = workerInfo.name;
                    orderForm.workerPost = workerInfo.post;
                    orderForm.workerMobile = workerInfo.mobile;
                    //获取服务时间
                    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~')

                    orderForm.duration = this.totleTime;
                    orderForm.productList = this.categoryList;
                    return true;
                }catch(e){
                    alert('请将表单数据填写完整');
                    return false;
                }
            },
            submit(){
                console.log('orderForm')
                console.log(this.orderForm)
                if(!this.orderForm.serviceTime){
                    alert('请选择服务日期');
                    return false;
                }
                if( this.totlePrice > this.balance){
                    alert('余额不足，无法提交订单！');
                    return false;
                }
                if(!this.makeSubmitStruct()) return false;
                let _this = this;
                this.$http.post(`${MP}/order/createOrder`, this.orderForm).then(data => {
                   //跳转到列表页
                    _this.$router.push({
                        path: '/serviceSystem/order'
                    });
                }).catch(e => alert(e));
            },
            submitNext(){
                if(this.totlePrice > this.balance){
                    alert('余额不足，无法提交订单！');
                    return false;
                }
                if(!this.makeSubmitStruct()) return false;
                this.$http.post(`${MP}/order/createOrder`, this.orderForm).then(data => {
                    //跳转到列表页
                    this.$router.go(0);
                }).catch(e => alert(e));
            },
            getProducts(){
                this.$http.get(`${MP}/manage/category/loadByOrgId?orgId=` + this.orderForm.orgId).then(res => {
                    let data = res.data.data
                    this.groupData = [];
                    this.groupData.push(data.list);
                    console.log(data.list);
                }).catch(e => console.log);
            },
            remoteMethod(name){
                //判断是否是中文
                if(!this.isChn(name)){
                    return false;
                }
                this.$http.post(`${MP}/order/user/info`, {
                    name,
                    orgId: this.orderForm.orgId
                }).then(res => {
                    let data = res.data.data
                    this.userInfos = data.list;
                    let tempUserinfo = this.userInfos;
                    for(let i = 0 ; i < this.userInfos.length; i++){
                        tempUserinfo[i].sex = (~~tempUserinfo[i].sex === 1 ? "男":"女");
                        let temp = tempUserinfo[i].residentialAddress;
                        this.userInfos[i]._userShow =tempUserinfo[i].name +"   "+ tempUserinfo[i].sex
                            +"   "+temp.provinceName+temp.cityName
                            +temp.zoneName+temp.streetName+temp.community+temp.detailedAddress;
                    }
                    this.loading = false;

                }).catch(e => console.log);

            },
            isChn(str){
                let reg= /^[\u4E00-\u9FA5]+$/;
                if (!reg.test(str)) {
                    //不全是中文
                    return false;
                } else {
                    return true;
                }
            },
            checked(obj,n){
                let temp = {
                    id: '',
                    cateId: '',
                    cateName: '',
                    catePid: '',
                    catePname: '',
                    price: '',
                    serviceDuration: ''
                }
                let x = []
                obj.productList.forEach(item => {
                    let newObj = {}
                    for (let k in temp) {
                        newObj[k] = item[k]
                    }
                    x.push(newObj)
                })
                this.categoryList = x
                this.groupTime[n] = obj.time;
                this.groupPrice[n] = obj.price;
                this.totleTime = this.groupTime.reduce((a, b)=>a + b, 0);
                this.totlePrice = this.groupPrice.reduce((a, b)=>a + b, 0);
            },
            groupSelect(cateP,num){
                console.log('groupSelect')
                //是否可以增加group true为可以
                this.ifAddGroup = true;
                //为上一次选中的catePid
                this.lastcateP = cateP;
                //每一次触发select事件，表示最后一个选择框被重新选择，
                //则此时删除掉最后一组数据重新计算总时间和总钱数
                this.groupTime[num] = 0;
                this.groupPrice[num] = 0;
                this.totleTime = this.groupTime.reduce((a, b)=>a + b, 0);
                this.totlePrice = this.groupPrice.reduce((a, b)=>a + b, 0);;
            },
            addCheckBoxGroup(){
                if(!this.ifAddGroup) return false;
                this.ifAddGroup = false;

                this.groupNum ++;
                //增加数量不可大于数据长度
                if(this.groupNum > this.groupData[0].length){
                    this.groupNum = this.groupData[0].length;
                }

                //增加后筛选数组
                let _this = this;
                let newItem = this.groupData[this.groupData.length-1].filter(v=>v.catePid !== _this.lastcateP);
                this.groupData.push(newItem);
            },
            reduceCheckBoxGroup(){
                this.groupNum-- ;
                if(this.categoryList.length > this.groupNum){
                    //删除数组最后一项
                    this.categoryList.pop();
                    //
                    this.groupTime.pop();

                    this.groupPrice.pop();
                }
                //重新计算时间
                this.totleTime = this.groupTime.reduce((a, b)=>a + b, 0);
                this.totlePrice = this.groupPrice.reduce((a, b)=>a + b, 0);
            },
            changeAdressArr(){
                //userNum 为数组中元素所在位置，地址信息包含在该元素中
                this.serAddress = this.userInfos[this.userNum].serviceAddress;
                //获取地址后增加地址显示变量
                this.serAddress.forEach(v=>{
                    v.showAddress = v.provinceName + v.cityName
                        +v.zoneName+v.streetName+v.community+v.detailedAddress;
                });
                //默认选中第一条地址信息
                this.addressNum = 0;
            },
            async getAllSerPeople(){
                try{
                    let _this = this;
                    let res = await this.$http.get(`${MP}/worker/getworkerByOrg?orgId=` + this.orderForm.orgId);
                    this.serPeople = res.data.data.list;
                    this.serPeople.forEach(v => v._userShowInfo = v.name + " " + _this.workerPostDict.get(v.post));
                }catch(e){
                    alert(e);
                }
            },
            async getWorkerPostDict(){
                try{
                    let _this = this;
                    this.workerPostDict = new Map();
                    let res = await this.$http.get(`${MP}/worker/postDict`);
                    res.data.data.list.forEach(v => _this.workerPostDict.set(v.id,v.text));
                }catch(e){
                    alert(e);
                }
            },
            getDateList(id){
                this.$http.get(`${MP}/worker/futureTwoWeekDate?workerId=`+id
                    +'&duration='+this.totleTime).then(res => {
                    this.dateList = res.data.data
                    console.log(this.dateList);
                }).catch(e => console.log);
            },
            getSerTime(time){
                this.curTime = time;
                this.$http.get(`${MP}/worker/holdingTime?workerId=` + this.serId+"&date="+time).then(res => {
                    let data = res.data.data
                    this.usedTime = data;
                    this.usedTime = [];
                    Array.prototype.push.apply(this.usedTime,data);
                }).catch(e => console.log);
            },
            chooseSerTime(startTime, endTime, showTime){
                console.log('触发chooseSerTime')
                console.log(startTime)
                this.orderForm.serviceTime = startTime;
                this.showTime = showTime;
                console.log(this.orderForm.serviceTime)
            },
            newAddress(){
                this.showDialog = true;
            },
            dialogClick(areaData){
                console.log(areaData)
                console.log(this.userInfos)
                if(areaData){
                    let item = this.userInfos[this.userNum];
                    if(this.userInfos.length === 0 ){
                        alert('请选择老人');
                        this.showDialog = false;
                        return false;
                    }
                    this.$http.post(`${MP}/order/user/addAddress`, {
                        userId: item.id,
                        address: areaData
                    }).then(data => {
                        console.log('添加成功');
                        this.updateServerAddress(item.id);
                    }).catch(e => console.log);
                }
                this.showDialog = false;
            },
            updateServerAddress(id){
                this.$http.get(`${MP}/manage/user/addressByUserId?id=` + id).then(res => {
                    let data = res.data.data
                    //userNum 为数组中元素所在位置，地址信息包含在该元素中
                    this.userInfos[this.userNum].serviceAddress = data.list;
                    this.changeAdressArr();
                }).catch(e => console.log);
            }
        },
        watch:{
            'userNum':function(){
                if(this.userInfos.length && this.userInfos.length>0){
                    this.amount = this.userInfos[this.userNum].amount;
                    this.balance = this.userInfos[this.userNum].balance;
                }
            },
            'serId': function(){
                //获取时间数组
                let workerInfo = this.serPeople.filter(v=>v.id === this.serId)[0];
                this.getDateList(workerInfo.id);
            }
        }
    }
</script>
<style lang="scss">
    .new-order{
        .title{
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
        }
        .myform{
            padding-top: 10px;
            margin-top: -1px;
            padding-left: 30px;
            font-size: 18px;
            font-family: "Microsoft YaHei", "微软雅黑","Helvetica Neue",
            Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
            .categories{
                position: relative;
                .button-group{
                    /*position: absolute;*/
                    /*top: 10px;*/
                    /*right: 10px;*/
                }
            }
            .commodity-info{
                >div{
                    padding-left: 120px;
                    margin: 5px 0px;
                }
            }
            .ser-time{
                margin: 20px 0;
            }

        }
    }
</style>
