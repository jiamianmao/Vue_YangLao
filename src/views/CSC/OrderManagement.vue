<template>
    <pageContainer title='订单管理' class="order-m">
        <div class="search">
            <div class="search-table">
                <el-row>
                    <el-col :span="6">
                        <el-button class="button" type="primary" @click="newOrder">创建新的订单</el-button>
                    </el-col>
                </el-row>
                <el-form :model="userForm" label-width="100px" class="demo-ruleForm form" label-position="left">
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
                                    <el-option v-for="item in stateArr"
                                               :key="item.id"
                                               :label="item.text"
                                               :value="item.id"></el-option>
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
                        <el-col :span="8">
                            <el-form-item label="下单时间">
                                <el-date-picker
                                        v-model="orderTime"
                                        type="datetimerange"
                                        placeholder="选择时间范围">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="服务开始时间">
                                <el-date-picker
                                        v-model="serverTime"
                                        type="datetimerange"
                                        placeholder="选择时间范围">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item>
                            <el-button type="primary" @click="getLists">筛选</el-button>
                            <el-button type="primary" @click="reSet">重置</el-button>
                            <el-button type="primary">
                                <a download="test"
                                   class="download"
                                   :href="`http://mp.17link.cc/order/orderExport?${getParams(getQuery(this.userForm))}`">导出</a>
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
    </pageContainer>
</template>
<script>
    import { MP } from '@/common/config'
    import tables from '../../components/table.vue';
    import { format } from 'date-fns';
    import PageContainer from '@/components/PageContainer.vue';

    export default {
        data(){
            return{
                httpUrl :"/org/updateOrgState.do",
                pageUrl :"/page/OrgInfo",
                userForm: {
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
                    pageNum: 1
                },
                tableEles: [
                    {
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
                        value: "durationShow",
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
                orderTime: [],
                serverTime: [],
                orderStateDict: [],
                categories: [],
                secondCategories: [],
                stateArr: [],
            }
        },
        components: {
            tables,
            PageContainer
        },
        created(){
            this.orderStateDict = new Map();
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
                    this.stateArr = data.state;
                    this.stateArr.forEach(v=>{
                        this.orderStateDict.set(v.text,v.id);
                    });
                }).catch(e=>console.log);
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
                    state: this.orderStateDict.get(data.state),
                    source: 'oManagerment'
                }});
            },
            pageChange(page){
                this.userForm.pageNum = page;
                this.getLists();
            },
            reSet(){
                this.userForm = {
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
                    pageNum: 1
                };
                this.orderTime = [];
                this.serverTime = [];
            },
            getLists(){
                this.userForm.createStartTime =  '';
                this.userForm.createEndTime = '';
                this.userForm.serviceStartTime =  '';
                this.userForm.serviceEndTime = '';

                if(this.orderTime.length > 0 && this.orderTime[0] && this.orderTime[1]){
                    this.userForm.createStartTime =  this.orderTime[0].getTime();
                    this.userForm.createEndTime = this.orderTime[1].getTime();
                }

                if(this.serverTime.length > 0 && this.serverTime[0] && this.serverTime[1]){
                    this.userForm.serviceStartTime = this.serverTime[0].getTime();
                    this.userForm.serviceEndTime = this.serverTime[1].getTime();
                }

                this.$http.post(`${MP}/order/parentOrderList`, this.userForm).then(res=>{
                    let data = res.data.data
                    this.totalPage = data.data.count;
                    this.data = data.data.orderList;
                    this.data.forEach(v=>{
                        v.createTime = format(v.createTime, 'YYYY-MM-DD HH:mm:SS');
                        v.serviceTime = format(v.serviceTime, 'YYYY-MM-DD HH:mm:SS');
                        if(v.duration && v.duration != 0) v.durationShow = v.duration/60;
                    });
                }).catch(e=>console.log);
            },
            newOrder(){
                this.$router.push({path: '/serviceSystem/newOrder'});
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
            }
        },
        watch:{
            "userForm.catePid" : function(){
                let _this = this;
                let cateArr = this.categories.filter(v=>v.catePid === _this.userForm.catePid);
                if(cateArr.length && cateArr.length > 0)
                    this.secondCategories = cateArr[0].cate;
                else
                    this.secondCategories = [];
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
                padding-top: 10px;
                margin-top: -1px;
                padding-left: 32px;
                .button{
                    margin-left: 31px;
                    margin-bottom: 10px;
                }
            }
        }
        .list{
            margin-top: 32px;
        }
        .download{
            width: 100%;
            color: #fff;
        }
    }
</style>
