<template>
    <pageContainer title='订单管理' class="order-m">
        <div class="search">
            <!--
            <div class="head clearfix">
                <h5 class="fl">订单管理</h5>
                <div></div>
            </div> -->
            <div class="search-table">
                <el-form :model="userForm" label-width="100px" class="demo-ruleForm form" label-position="left">
                    <el-row>
                            <el-row class="area">
                            <cityArea ref="area"
                            :title="'服务区域'"
                            @select-change="selectChange"
                            :curNum="0"
                            v-if="type === 0"></cityArea>
                            <limitArea  @select-change="selectChange" v-if="type === 2 "></limitArea>
                            </el-row>
                    </el-row>
                    <el-row v-if="type !== 1">
                        <el-col :span="6" >
                            <el-form-item label="服务机构">
                            {{orgName}}
                            <el-button class="button" type="primary" @click="chooseOrg">选择服务机构</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5">
                            <el-form-item label="订单号" prop="email">
                                <el-input v-model="userForm.orderId"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="老人姓名" prop="email">
                                <el-input v-model="userForm.userName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="服务人员姓名" prop="email">
                                <el-input v-model="userForm.workerName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <el-form-item label="订单状态" label-width="100px">
                                <el-select v-model="userForm.stateId" placeholder="请选择订单状态">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="(item, value) in orderStateDict"
                                               :key="item"
                                               :label="value"
                                               :value="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="服务品类">
                                <el-select v-model="userForm.catePid" placeholder="请选择一级品类">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="item in categories"
                                               :key="item.catePid"
                                               :label="item.cateName"
                                               :value="item.catePid"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="" label-width="0">
                                <el-select v-model="userForm.cateId" placeholder="请选择二级品类">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="item in secondCategories"
                                               :key="item.cateId"
                                               :label="item.cateName"
                                               :value="item.cateId"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="下单时间">
                                <el-date-picker
                                        v-model="orderTime"
                                        type="datetimerange"
                                        start-placeholder="选择时间范围">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="服务开始时间">
                                <el-date-picker
                                        v-model="serverTime"
                                        type="datetimerange"
                                        start-placeholder="选择时间范围">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item>
                            <el-button type="primary" @click="getLists">筛选</el-button>
                            <el-button type="primary" @click="reSet">重置</el-button>
                            <el-button type="primary" @click='toOut'>导出
                                <!--<a download="test"
                                   class="download"
                                   :href="`http://mp.17link.cc/order/orderExport?${getParams(getQuery(this.userForm))}`">导出</a>-->
                            </el-button>
                        </el-form-item>
                    </el-row>
                </el-form>
            </div>
        </div>
        <tables class="list"
               @pagination-click="pageChange"
               @link-to = "linkto"
               :tableEles="tableEles"
               :totalPage="totalPage"
               :data="data">
        </tables>
        <orgChoose v-if="showOrg"
                    @pop-click="setOrgInfo"
                    :areaData="serviceArea">
        </orgChoose>
    </pageContainer>
</template>
<script>

    import tables from '@/components/table.vue';
    import cityArea from '@/components/ServiceArea.vue';
    import limitArea from '@/components/limitArea.vue';
    import orgChoose from '@/components/OrgChoose.vue';
    import PageContainer from '@/components/Mp/PageContainer.vue';
    import { MP } from '@/common/config'

    export default {
        data(){
            return{
                httpUrl :"/org/updateOrgState.do",
                pageUrl :"/page/OrgInfo",
                userForm: {
                    orgId: window._dataInfo.orgId,
                    orderId: "",
                    userName: "",
                    workerName: "",
                    createStartTime: "",
                    createEndTime: "",
                    serviceStartTime: "",
                    serviceEndTime: "",
                    catePid: "",
                    cateId: "",
                    stateId: "",
                    pageSize: 10,
                    pageNum: 1,
                    provinceId: '',
                    cityId: '',
                    districtId: '',
                    streetId: '',
                    stateId: ''
                },
                tableEles: [
                    {
                        name: "养老机构",
                        value: "orgName",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "省",
                        value: "provinceName",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "市",
                        value: "cityName",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "区",
                        value: "districtName",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "街道",
                        value: "streetName",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "订单号",
                        value: "id",
                        ifControl: false,
                        eventName: "link-to"
                    },{
                        name: "订单状态",
                        value: "state",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "服务大类",
                        value: "catePname",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "服务品类",
                        value: "cateName",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "下单时间",
                        value: "createTime",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "老人姓名",
                        value: "userName",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "服务人员姓名",
                        value: "workerName",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "服务人员手机",
                        value: "workerMobile",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "服务开始时间",
                        value: "serviceTime",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "预定服务时长/h",
                        value: "duration",
                        ifControl: false,
                        eventName: ""
                    },{
                        name: "订单总额",
                        value: "price",
                        ifControl: false,
                        eventName: ""
                    }
                ],
                totalPage: 0,
                data: [],
                orgName: '',
                orderTime: [],
                serverTime: [],
                orderStateDict: {},
                categories: [],
                secondCategories: [],
                type: window._dataInfo.type,//0平台1机构2政府
                showOrg: false,
                serviceArea:{
                    provinceId: '',
                    cityId : '',
                    districtId: '',
                    streetId : ''
                },
            }
        },
        components: {
            tables,
            limitArea,
            cityArea,
            orgChoose,
            PageContainer
        },
        created(){
            //获取订单状态字典
            this.getOrderStateDict();
            //获取品类数据
            this.getCategory();
            //拉取列表数据
            this.getLists();
        },
        methods: {
            getOrderStateDict(){
                this.$http.get(`${MP}/order/orderStateDict`).then(res=>{
                    let data = res.data.data
                    // this.orderStateDict = data.state
                    // 这是搞什么呢？
                    this.stateArr = data.state
                    this.stateArr.forEach(v=>{
                        this.orderStateDict[v.text] = v.id
                    });
                }).catch(e=>console.log);
            },
            stateDictArrToMap(arr){
                if(arr && arr.length){
                    let temp = new Map();
                    for(let i = 0 ; i < arr.length; i++){
                        temp.set(arr[i].id,arr[i].text);
                    }
                    return temp;
                }
                return false;
            },
            getCategory(){
                this.$http.get(`${MP}/manage/category/query`).then(res=>{
                    let data = res.data.data
                    this.categories = data.list;
                }).catch(e=>console.log);
            },
            linkto(data){
                //跳订单详情
                this.$router.push({path: '/integratedMana/oDetail',query:{
                    orderId: data.id,
                    state: this.orderStateDict[data.state],
                    orderStateDict: this.orderStateDict
                }});
            },
            pageChange(page){
                this.userForm.pageNum = page;
                this.getLists();
            },
            reSet(){
                this.userForm = {
                    orgId: window._dataInfo.orgId,
                    orderId: "",
                    userName: "",
                    workerName: "",
                    createStartTime: "",
                    createEndTime: "",
                    serviceStartTime: "",
                    serviceEndTime: "",
                    catePid: "",
                    cateId: "",
                    stateId: "",
                    pageSize: 10,
                    pageNum: 1,
                    provinceId: '',
                    cityId: '',
                    districtId: '',
                    streetId: '',
                    stateId: ''
                }
                this.orgName = ''
                this.orderTime = []
                this.serverTime = []
                if (this.type !== 2) {
                    this.$refs.area && this.$refs.area.reSet()
                }
            },
            getLists(){
                if(this.orderTime.length > 0){
                    this.userForm.createStartTime =  this.orderTime[0].getTime();
                    this.userForm.createEndTime = this.orderTime[1].getTime();
                }

                if(this.serverTime.length > 0){
                    this.userForm.serviceStartTime = this.serverTime[0].getTime();
                    this.userForm.serviceEndTime = this.serverTime[1].getTime();
                }

                this.$http.post(`${MP}/order/subOrderList`,this.userForm).then(res=>{
                    let data = res.data.data
                    this.totalPage = data.count
                    data.orderList.forEach(v=>{
                        //转换时间
                        v.createTime = new Date(v.createTime).toLocaleString();
                        //转换状态
                        v.showState = this.orderStateDict[v.state]
                    });
                    this.data = data.orderList
                }).catch(e=>console.log);
            },
            chooseOrg(){
                this.showOrg = true;
            },
            selectChange(areaData){
                // console.log(areaData)
                let userForm = this.userForm;
                for(let k in this.serviceArea){
                    this.serviceArea[k] = areaData[k];
                }
                userForm.provinceId = areaData.provinceId;
                userForm.cityId = areaData.cityId;
                userForm.districtId = areaData.areaId;
                userForm.streetId = areaData.streetId;
                // let userForm = this.userForm;
                // userForm.serviceArea.provinceId = areaData.provinceId;
                // userForm.serviceArea.cityId = areaData.cityId;
                // userForm.serviceArea.districtId = areaData.areaId;
                // userForm.serviceArea.streetId = areaData.streetId;
            },
            //获取选中机构信息
            setOrgInfo(org){
                if(org){
                    this.userForm.orgId = org.id;
                    // 不需要orgName
                    this.orgName = org.name
                }
                this.showOrg = false;
            },
            getQuery(data) {
                var dataStr = ''
                for (var key in data) {
                    if (typeof data[key] === 'object') dataStr += this.getQuery(data[key]);
                    else {
                        dataStr += key + '=' + data[key] + '&'
                    }
                }
                return dataStr;
            },
            getParams(data) {
                return data.slice(0, -1);
            },
            toOut () {
                if (this.type !== 1 && !this.orgName) {
                    alert('请选择一个机构')
                    return
                }
                let url = `${MP}/order/orderExport?${this.getParams(this.getQuery(this.userForm))}`
                window.location.href = url
            }
        },
        watch:{
            "userForm.catePid" : function(){
                let _this = this;
                let arr = this.categories.filter(v=>v.catePid === _this.userForm.catePid)
                this.secondCategories = arr.length > 0 && arr[0].cate;
            }
        }
    }
</script>
<style lang="scss">
    .order-m{
        .search{
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
            }
            .search-table{
                padding-left: 38px;
                padding-top: 10px;
                margin-top: -1px;
                .button{
                    margin-left: 31px;
                    margin-bottom: 10px;
                }
            }
        }
        .list{
            margin-top: 32px;
        }
    }
</style>
