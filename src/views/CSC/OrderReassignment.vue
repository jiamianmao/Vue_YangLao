<template>
    <page-container title="订单改派" if-show>
        <div class="order-ress">
            <el-form ref="form" :model="orderForm" label-width="120px" labelPosition="left">
                <el-row>
                    <el-col :span="7">
                        老人姓名: {{info.userName}}
                    </el-col>
                    <el-col :span="12">
                        总额度: {{info.amount}}元 当前剩余：{{info.balance}}元
                    </el-col>
                </el-row>
                    <el-row class="address-info m-pos">
                    <el-col :span="7">
                        请选择服务地址 : {{info.provinceName + info.cityName + info.districtName+
                    info.streetName + info.detailedAddress + info.community + info.detailedAddress}}
                    </el-col>
                </el-row>
                <el-row class="categories m-pos">
                    <el-col :span="7">
                        服务品类：
                        <div v-for="item in info.parentCates" :key="item.id">
                            <h5>
                                大品类：
                                <el-tag type="gray">{{" "+item.cate.name+" "}}</el-tag>
                            </h5>
                            <div>
                                小品类：
                                <el-tag v-for="pro in item.products"
                                        :key="pro.id"
                                        type="success">
                                    {{pro.cateName}}
                                </el-tag>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row class="totle m-pos">
                    <div>
                        服务时长合计: {{info.duration}}分钟
                    </div>
                    <div>
                        订单总额   : {{info.price}}元
                    </div>
                </el-row>
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="请选择服务人员">
                            <el-select
                                    v-model="serId"
                                    placeholder="请选择服务人员">
                                <el-option
                                        v-for="item in serPeople"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <date-box
                            :dateList="dateList"
                            @date-select="getSerTime">
                    </date-box>
                </el-row>
                <el-row>
                    <time-box
                            :curTime="curTime"
                            :costTime="this.totleTime"
                            :useTime="usedTime"
                            @choose-time="chooseSerTime">
                    </time-box>
                    <div class="serTime m-pos">
                        <div>选择的服务时间为:{{showTime}}</div>
                    </div>
                </el-row>
                <el-row>
                    <el-form-item label="请填写备注信息">
                        <el-input type="textarea" v-model="orderForm.remark"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <el-button @click="submit">改派</el-button>
        </div>
        <add-address v-if="showDialog"
          @pop-click="dialogClick">
        </add-address>
    </page-container>
</template>
<script>

    import checkGroup from '@/components/checkGroup.vue';
    import dateBox from '@/components/dateBox.vue';
    import timeBox from '@/components/TimeBox.vue';
    import PageContainer from '@/components/PageContainer.vue';
    import { MP } from '@/common/config'

    export default {
        data(){
            return{
                orgId: window._dataInfo.orgId,
                orgName: window._dataInfo.orgName,
                loading: true,
                orderId: '', //订单号
                orderForm: {
                    orderId: '',
                    workerId: '',
                    workerName: '',
                    workerMobile: '',
                    serviceTime: '',
                    remark: '',
                    source: 1
                },//表单提交的数据
                info:{},
                amount: '',
                balance: '',
                totleTime: 0,//总时间
                totlePrice: 0,//总价格
                serPeople: [],//服务人员列表
                workerPostDict: "",//职位字典
                serId : "", //服务人员Id
                dateList: [],//两周日期
                curTime: '', //当前选中的某一天
                usedTime: [],//阿姨被占用时间
                showDialog: false, //弹框控制器
                showTime: '', //显示选中的时间
                source: '',
            }
        },
        components: {
            checkGroup,
            dateBox,
            timeBox,
            PageContainer
        },
        created(){
            try{
                this.orderId = this.$route.query.orderId;
                this.source = this.$route.query.source;
                //获取订单信息
                this.getOrderInfo();
                //获取所有服务人员信息
                this.getAllSerPeople();
                //获取职位字典
                this.getWorkerPostDict();
            }catch(e){
                console.log(e);
            }
        },
        methods: {
            async getOrderInfo(){
                try{
                    let res = await this.$http.get(`${MP}/order/distribute/info?orderId=` + this.orderId);
                    let data = res.data.data
                    this.info = data;
                    this.totleTime = this.info.duration;
                    this.totlePrice = this.info.price;
                    this.serId = this.info.workerId;
                    //获取时间数组
                    this.getDateList(this.serId);
                }catch(e){
                    console.log(e);
                }

            },
            submit(){
                if(this.info.price > this.info.balance){
                    alert('余额不足，无法提交订单！');
                    return false;
                }
                if(!this.orderForm.serviceTime){
                    alert('请选择服务开始时间');
                    return false;
                }
                //
                let _this = this;
                let workerInfo = this.serPeople.filter(v=>v.id === _this.serId)[0];
                this.orderForm.orderId = this.orderId;
                this.orderForm.workerId = workerInfo.id;
                this.orderForm.workerName = workerInfo.name;
                this.orderForm.workerMobile = workerInfo.mobile;
                this.$http.post(`${MP}/order/distributeOrder`, this.orderForm).then(data => {
                    //跳转到列表页
                    this.$router.go(-1);
                }).catch(e => alert(e));
            },
            getProducts(){
                this.$http.get(`${MP}/manage/category/loadByOrgId`).then(res => {
                    this.groupData = [];
                    this.groupData.push(res.data.data.list);
                }).catch(e => console.log);
            },
            async getAllSerPeople(){
                try{
                    let _this = this;
                    let res = await this.$http.get(`${MP}/worker/getworkerByOrg?orgId=`+this.orgId);
                    let data = res.data.data
                    this.serPeople = data.list;
                    if(!this.serPeople.length) return false;
                    this.serPeople.forEach(v=>v._userShowInfo = v.name + " " + _this.workerPostDict.get(v.post));
                }catch(e){
                    alert(e);
                }
            },
            async getWorkerPostDict(){
                try{
                    this.workerPostDict = new Map();
                    let _this = this;
                    let res  = await this.$http.get(`${MP}/worker/postDict`);
                    let data = res.data.data
                    if(data.post && data.post.forEach)
                        data.post.forEach(v=>_this.workerPostDict.set(v.id,v.text));
                }catch(e){
                    console.log(e);
                }
            },
            getDateList(id){
                this.$http.get(`${MP}/worker/futureTwoWeekDate?workerId=`+id
                    +'&duration='+this.totleTime).then(res => {
                    let data = res.data.data
                    this.dateList = data;
                }).catch(e => console.log);
            },
            getSerTime(time){
                this.curTime = time;
                this.$http.get(`${MP}/worker/holdingTime?workerId=`+this.serId+"&date="+time).then(res => {
                  let data = res.data.data
                  this.usedTime = data;
                  this.usedTime = [];
                  Array.prototype.push.apply(this.usedTime,data);
                }).catch(e => console.log);
            },

            chooseSerTime(startTime,endTime,showTime){
                this.orderForm.serviceTime = startTime;
                this.showTime = showTime;
            },
        },
        watch:{
            'serId':function(){
                this.getDateList(this.serId);
            }
        }
    }
</script>
<style lang="scss">
    .order-ress{
        font-family: "PingFang SC", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1",
        "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", Arial, sans-serif;
        font-size: 14px;
        padding-left: 20px;
        .address-info{

        }
        .categories .m-pos{
            h5{
                margin-left: 20px;
            }

        }
        .serTime{

        }
        .m-pos{
            margin: 20px 0px;
        }
    }
</style>
