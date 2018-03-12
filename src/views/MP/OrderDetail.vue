<template>
    <page-container class="order-detail" title="订单详情">
        <div class="titleHead">
            <div class="detial-info">
                <el-row >
                    <div class="order-number">
                        订单号: {{orderId}}
                        <el-button class="control-bottom"  @click="$router.back()">返回</el-button>
                    </div>
                </el-row>
                <el-row class="top-button" v-if="type === 1">
                    <el-col :span="2" v-if="ifShow">
                        <el-button class="control-bottom" type="primary" @click="control">{{buttonContent}}</el-button>
                    </el-col>
                    <el-col :span="2" v-if="ifShowButton">
                        <el-button class="control-bottom" type="primary" @click="changeSerPerson">改派订单</el-button>
                    </el-col>
                </el-row>
                <el-row class="top-content clearfix">
                    <div class="display">
                        {{stateDisplay}}
                    </div>
                    <div class="scope">
                        <el-steps :active="state+1" finish-status="success" :align-center='true'>
                            <el-step title="创建订单"></el-step>
                            <el-step title="待接单"></el-step>
                            <el-step title="已接单"></el-step>
                            <el-step title="待分派"></el-step>
                            <el-step title="已取消"></el-step>
                            <el-step title="已完成"></el-step>
                        </el-steps>
                    </div>
                </el-row>
                <div class='item-info'>
                    <ul class="clearfix">
                        <li>
                            <h5>订单信息</h5>
                            <div class="content">
                                <div>订单号：{{orderId}}</div>
                                <div>下单时间：{{timeFormat(orderInfo.createTime, 'YYYY-MM-DD HH:mm:SS')}}</div>
                                <div>订单状态：{{orderInfo.state}}</div>
                                <div>养老机构：{{orderInfo.orgName}}</div>
                            </div>
                        </li>
                        <li>
                            <h5>老人信息</h5>
                            <div class="content">
                                <div>姓名：{{orderInfo.userName}}</div>
                                <div>服务地址：{{orderInfo.provinceName+
                                orderInfo.cityName+orderInfo.districtName +orderInfo.streetName
                                +orderInfo.community+orderInfo.detailedAddress}}
                                </div>
                                <div>手机：{{orderInfo.userMobile}}</div>
                                <div>固话：{{orderInfo.userPhone}}</div>
                            </div>
                        </li>
                        <li>
                            <h5>服务信息</h5>
                            <div class="content">
                                <div>姓名：{{orderInfo.workerName}}</div>
                                <div>电话：{{orderInfo.workerMobile}}</div>
                                <div>职位：{{orderInfo.workerPost}}</div>
                            </div>
                        </li>
                        <li class="last">
                            <h5>订单结算信息</h5>
                            <div class="content">
                                <div>开始时间：{{timeFormat(orderInfo.serviceTime, 'YYYY-MM-DD HH:mm:SS')
                                    }}</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <el-row class="sub-order">
                <el-table
                        :data="orderSummaryInfo"
                        style="width: 100%">
                    <el-table-column
                            prop="cateId"
                            label="品类编号"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="showCate"
                            label="服务品类"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="duration"
                            label="品类单位时长/分钟">
                    </el-table-column>
                    <el-table-column
                            prop="price"
                            label="单价">
                    </el-table-column>
                    <el-table-column
                            label="服务过程照片">
                        <template slot-scope="scope">
                            <img v-for="item in orderSummaryInfo[scope.$index].urlList" class="images" :key="item.id" :src="item.picUrl" alt="" />
                        </template>
                    </el-table-column>
                </el-table>
                <div class="totl">
                    <div>订单服务时长：{{totalDuration}}</div>
                    <div>订单总额：{{totalAmount}}</div>
                </div>
            </el-row>
            <el-row v-if="state === 5" class="serInfo clearfix">
                <div class="content">
                    <h5>服务记录</h5>
                    <div class='title'> 服务人员：{{orderInfo.workerName}}</div>
                </div>
                <ul class='serList clearfix'>
                    <li>打卡时间: {{
                        timeFormat(serviceRecord.signInTime, 'YYYY-MM-DD HH:mm:SS')
                        }}</li>
                    <li>打卡定位: {{serviceRecord.signInAddress}}</li>
                    <li>结束时间: {{
                        timeFormat(serviceRecord.signOutTime, 'YYYY-MM-DD HH:mm:SS')
                        }}</li>
                    <li>结束定位: {{serviceRecord.signOutAddress}}</li>
                </ul>
            </el-row>
            <el-row v-if="state === 5" class="appraise-info clearfix">
                <div class="left">
                    <h5>评价信息</h5>
                    <div class="stars">
                        <el-form :model="star">
                            <el-form-item label="服务满意度" label-width="134px">
                                <el-rate class="star-pos" v-model.number="star.commentScore" disabled></el-rate>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="right">
                    <div class="images">
                        <img v-for="item in urlList" :key="item.id" :src="item.picUrl"  width="40%"/>
                        <div>
                            <h3>评价</h3>
                            <el-input class='textarea'
                                type="textarea"
                                :autosize="{ minRows: 4, maxRows: 8}"
                                placeholder="老人对订单的评价"
                                v-model="textarea">
                            </el-input>
                        </div>
                        <div>
                            <h3>录音</h3>
                            <i class="el-icon-tickets"></i>
                            <audio :src="mp3List.picUrl" ref='audio' style='opacity: 0;'></audio>
                            <a class='btn' @click.prevent='play'>播放</a>
                            <a class='btn' :href='mp3List.picUrl' :download='mp3List.picUrl'>下载</a>
                        </div>
                    </div>
                </div>
            </el-row>
            <el-row v-if="state === 5" style='display: none;'>
                <div class="left visited-info">
                    <h5>回访记录</h5>
                    <div class='content'>
                        <el-row v-for="item in backVisitRecordList" :key="item.id">
                            <el-col :span="5">
                                <div>
                                    <h5>回访信息：</h5>
                                    <div>客服: {{item.operateUserName}}</div>
                                </div>
                                <div>
                                    <div>{{new Date(item.createTime).toLocaleString()}}</div>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <el-form class="visited-pos">
                                    <el-form-item>
                                        <el-input type="textarea" v-model="item.remark" :disabled="true"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-row>
            <div class="log">
                <h5>操作记录</h5>
                <el-row>
                    <el-table
                            :data="logList"
                    border>
                        <el-table-column
                                prop="createTimeShow"
                                label="操作时间">
                        </el-table-column>
                        <el-table-column
                                prop="createUserName"
                                label="操作人"
                                width="250">
                        </el-table-column>
                    </el-table>
                </el-row>
            </div>
        </div>
        <popup
            v-if='showDialog'
            :show='show'
            @pop-click='dialogClick'>
        </popup>
    </page-container>
</template>
<script>
    import popup from './OrderPopUp.vue';
    import PageContainer from '@/components/PageContainer.vue';
    import { format } from 'date-fns';
    import { MP } from '@/common/config'

    export default {
        data(){
            return{
                orderId: '',
                state: '',
                stateDisplay: '',
                buttonContent: '',
                ifShowButton: false,
                ifShow: true,
                orderInfo: {},
                orderSummaryInfo: [],
                logList: [],
                star: {
                    commentScore: 5
                },
                urlList: [],
                backVisitRecordList: [],
                show: false,
                showDialog: false,
                orderStateDict: ['待接单','已接单','待分派','已取消','已完成'],
                totalDuration: 0,
                totalAmount: 0,
                serviceRecord: {},
                type: window._dataInfo.type,
                timeFormat: format,
                source: '',
                textarea: '',
                mp3List: {}
            }
        },
        components: {
            popup,
            PageContainer
        },
        created(){
          this.orderId = this.$route.query.orderId
          this.state = parseInt(this.$route.query.state)
          this.stateDisplay = this.orderStateDict[this.state - 1]
          this.getTitle(this.state)
          this.source = this.$route.query.source
          let _this = this;
          this.getOrderInfo(()=>{
              _this.getOrderSummaryInfo();
              if(_this.state === 5){
                  _this.getServiceRecord();
                  _this.getBackVisitRecordList();
                  _this.getEvaluativeInfo();
              }
          })

          this.getLogList()
        },
        methods: {
            getTitle(state){
                switch(state){
                    case 1:
                        this.buttonContent = '取消订单';
                        //显示另一个按钮
                        this.ifShowButton = true;
                        this.show = true;
                        break;
                    case 2:
                        this.buttonContent = '取消订单';
                        this.show = true;
                        break;
                    case 3:
                        this.buttonContent = '取消订单';
                        //显示另一个按钮
                        this.ifShowButton = true;
                        this.show = true;
                        break;
                    case 4:
                        //隐藏按钮
                        this.ifShow = false;
                        break;
                    case 5:
                        this.buttonContent = '订单回访';
                        this.show = false;
                        break;
                }
            },
            control(){
                this.showDialog = true;
            },
            dialogClick(obj,type){
                if(!obj){
                    this.showDialog = false;
                    return false;
                }
                if(type){
                    if(!obj.num){
                        alert('请选择取消原因');
                        return false;
                    }
                    //取消订单
                    let _this = this;
                    this.$http.post(`${MP}/order/cancelOrder`, {
                        orderId: this.orderId,
                        cancelReasonId: obj.num,
                        cancelReasonText: obj.text,
                        source: 1
                    }).then(data=>_this.$router.back()).catch(e=>alert(e));

                }else{
                    this.$http.post(`${MP}/order/addBackVisit`,'orderId='+this.orderId
                        +'&score='+obj.scope
                        +'&remark='+obj.desc).then(data=>{
                            this.$router.go(0);
                        }).catch(e=>alert(e));
                }
                this.showDialog = false;
            },
            changeSerPerson(){
                this.$router.push({
                    path: '/integratedMana/oReassignMent',
                    query: {
                        orderId : this.orderId,
                        source: this.source
                    }
                });
            },
            getOrderInfo(fn){
                this.$http.get(`${MP}/order/info?orderId=`+this.orderId).then(res => {
                  let data = res.data.data
                  this.orderInfo = data;
                  if(fn) fn();
                }).catch(e=>alert(e));
            },
            getOrderSummaryInfo(){
                this.$http.get(`${MP}/order/orderSummaryInfo?orderId=`+this.orderId).then(res => {
                  let data = res.data.data
                  this.orderSummaryInfo = data.orderList
                  this.orderSummaryInfo.forEach(v => {
                      v.showCate = v.catePname + ">" + v.cateName
                  })
                  this.totalDuration = data.totalDuration
                  this.totalAmount = data.totalAmount
                }).catch(e=>alert(e))
            },
            getServiceRecord(){
                this.$http.get(`${MP}/order/serviceRecord?orderId=`+this.orderId
                    +'&workerId=' + this.orderInfo.workerId).then(res=>{
                    let data = res.data.data
                    this.serviceRecord = data
                }).catch(e=>alert(e))
            },
            getEvaluativeInfo(){
                this.$http.get(`${MP}/order/evaluativeInfo?orderId=` + this.orderId
                + '&workerId=' + this.orderInfo.workerId).then(res => {
                  let data = res.data.data
                  if(data){
                    this.star.commentScore = data.commentScore || 5
                    this.urlList = data.urlList.filter(item => {
                        return item.type === 1
                    })
                    let arr = data.urlList.filter(item => {
                        return item.type === 2
                    })
                    this.mp3List = arr[0]
                  }
                }).catch(e => alert(e))
            },
            getBackVisitRecordList(){
                this.$http.get(`${MP}/order/backVisitRecord?orderId=` + this.orderId
                    +'&workerId=' + this.orderInfo.workerId).then(res => {
                    let data = res.data.data
                    this.backVisitRecordList = data;
                    console.log(this.backVisitRecordList);

                }).catch(e=>alert(e));
            },
            getLogList(){
                this.$http.get(`${MP}/order/logList?orderId=` + this.orderId).then(res => {
                  let data = res.data.data
                  this.logList = data;
                  this.logList.forEach(v=>v.createTimeShow = format(v.createTime, 'YYYY-MM-DD HH:mm:SS'));
                }).catch(e=>alert(e));
            },
            play () {
                console.log(1)
                this.$refs.audio.play()
            }
        }
    }
</script>
<style lang="scss" scoped>
    .order-detail{
        font-family:"Microsoft YaHei", "微软雅黑","PingFang SC",
        "Helvetica Neue", Helvetica, "Hiragino Sans GB",
        Arial, sans-serif;
        color: #616D80;
        border: none !important;
        .titleHead{
            >div{
                padding-left: 10px;
            }
        }
        .detial-info{
            margin-top: -1px;
            padding: 0 64px 64px 32px;
            .order-number{
                margin-top: 32px;
                font-size: 24px;
                height: 51px;
                line-height: 51px;
            }
            .top-button{
                background-color: #fff;
                .control-bottom{
                    margin-top: 32px;
                }
            }
            .top-content{
                background-color: #fff;
                padding: 90px 0 90px 210px;
                border-bottom: 1px solid #EFEFEF;
                >div{
                    display: inline-block;
                }
                .display{
                    font-size: 28px;
                    color: #00A6FC;
                    height: 64px;
                    line-height: 64px;
                }
                .scope{
                    width: 50%;
                    margin-left: 118px;
                }
            }
            .item-info{
                background-color: #fff;
                padding: 69px 0px 42px 0px;
                ul{
                    background-color: #fff;
                    height: 100%;
                    display: flex;
                    li{
                        flex: 1;
                        margin-left: 50px;
                        padding-right: 50px;
                        border-right: 1px solid #EFEFEF;
                        font-size: 18px;
                        height: 262px;
                        h5{
                            margin-bottom: 34px;
                            font-size: 20px;
                            font-family:"Microsoft YaHei", "微软雅黑",
                            "Helvetica Neue", Helvetica, "PingFang SC",
                            "Hiragino Sans GB",  Arial, sans-serif;
                        }
                        .content{
                            >div{
                                /*height: 30px;*/
                                font-family:"Microsoft YaHei", "微软雅黑",
                                "Helvetica Neue", Helvetica, "PingFang SC",
                                "Hiragino Sans GB",  Arial, sans-serif;
                                margin-bottom: 20px;
                            }
                        }

                    }
                    .last{
                        border: none;
                    }
                }
            }

        }
        .sub-order{
            margin-bottom: 30px;
            position: relative;
            padding-bottom: 70px;
            .totl{
                position: absolute;
                bottom: 0px;
                right: 300px;
                font-size: 20px;
                >div{
                    margin-bottom: 10px;
                }
            }
            .images{
                width: 110px;
                height: 110px;
                margin-left: 26px;
                display: inline-block;
            }
        }
        .serInfo{
            border: 1px solid #B2BFD1;
            // padding-left: 58px;
            padding-bottom: 70px;
            >div{
                float: left;
            }
            .content{
                margin-right: 258px;
                h5{
                    font-size: 22px;
                    font-family:"Microsoft YaHei", "微软雅黑","Helvetica Neue",
                    Helvetica, "PingFang SC", "Hiragino Sans GB",  Arial,
                    sans-serif;
                    margin-top: 30px;
                    margin-bottom: 44px;
                }

                .title{
                    font-size: 20px;
                }
            }
            .serList{
                margin-top: 74px;
                font-size: 20px;
                >li{
                    float: left;
                    margin-left: 86px;
                    margin-bottom: 10px;
                }
            }
        }
        .appraise-info{
            border: 1px solid #B2BFD1;
            border-top: none;
            .left{
                h5{
                    margin: 30px 0 14px 0px;
                    font-size: 22px;
                }
                .stars{
                    .star-pos{
                        margin-top: 8px;
                    }
                }

            }
            .right{
                margin-top: 48px;
                .images{
                    width: 100%;
                    height: 216px;
                    display: flex;
                    >div{
                        width: 300px;
                        margin-left: 30px;
                        h3{
                            margin-bottom: 10px;
                        }
                        i{
                            margin-right: 20px;
                        }
                        .btn{
                            display: inline-block;
                            width: 50px;
                            height: 30px;
                            text-align: center;
                            line-height: 30px;
                            border-radius: 5px;
                            border: 1px solid #333;
                            color: #666;
                        }
                    }
                    img{
                        width: 100px;
                        margin-left: 10px;
                        display: inline-block;
                    }
                }
            }
        },
        .visited-info{
            border: 1px solid #B2BFD1;
            border-top: none;
            .left{
                h5{
                    margin: 30px 0 14px 0px;
                    font-size: 22px;
                }
                .start{

                }

            }
            .right{
                margin-top: 48px;
                .images{
                    widht: 218px;
                    height: 216px;
                    margin-left: 54px;
                    display: inline-block;
                }
            }

            .visited-pos{
                margin-top: 26px;
            }
        }
    }
</style>

