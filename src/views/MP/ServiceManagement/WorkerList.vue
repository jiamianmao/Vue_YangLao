<template>
    <div class='page-container'>
        <header class="tab-row">
            <span class="tab" @click='server'>服务人员详情</span>
            <span class="tab active">服务人员订单</span>
        </header>
        <div class="page-content">
            <el-button class="back-btn" icon='el-icon-arrow-left' type='plain' @click='$router.back()'>返回</el-button>
        </div>
        <tables class="list"
          @pagination-click="pageChange"
          @link-to = "linkto"
          :tableEles="tableEles"
          :totalPage="totalPage"
          :data="data">
        </tables>
    </div>
</template>

<script>
  import Tables from '@/components/table.vue'
  import { MP } from '@/common/config'
  export default {
    data() {
      return {
        data: [],
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
                value: "showState",
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
        orderStateDict: [],
        pageNum: 1,
        totalPage: 0
      }
    },
    created () {
      this.workerId = Number(this.$route.params.id)
      this._getOrderStateDict()
    },
    methods: {
      server () {
        this.$router.replace(`/integratedMana/worker/${this.workerId}`)
      },
      pageChange(page){
          this.pageNum = page
          this._getOrderList()
      },
      linkto (data) {
        let state
        this.orderStateDict.filter(item => {
            if (item.text === data.showState) {
                state = item.id
            }
        })
        this.$router.push({path: '/integratedMana/oDetail',query:{
            orderId: data.id,
            state,
            source: 'oManagerment'
        }})
      },
      _getOrderStateDict(){
        this.$http.get(`${MP}/order/orderStateDict`).then(res=>{
          let data = res.data.data
          this.orderStateDict = data.state
          this._getOrderList()
        }).catch(e=>console.log)
      },
      _getOrderList () {
        this.$http.get(`${MP}/order/subOrderByWorkerIdList?workerId=${this.workerId}&pageNum=${this.pageNum}&pageSize=10`).then(res => {
          let data = res.data.data
          this.totalPage = (data.count / 10 | 0) + (data.count % 10 ? 1 : 0)
          data.orderList.forEach(v => {
            v.createTime = new Date(v.createTime).toLocaleString()
            v.showState = v.state
            this.data.push(v)
          })
        }).catch(e => {
          console.log(e)
        })
      }
    },
    components: {
      Tables
    }
  }
</script>
<style lang="scss">
    .page-container{
        padding-top: 15px;
        position: relative;
    }

    .tab-row{
        border-bottom: 1px solid #d1dbe5;
    }
    .tab {
        bottom: -1px;
        position: relative;
        padding: 0 30px;
        border: 1px solid #d1dbe5;
        border-radius: 4px 4px 0 0;
        display: inline-block;
        line-height: 40px;
        font-size: 18px;
        color: #616d80;
        cursor: pointer;
        &.active{
            border-bottom-color: #fff;
        }
    }

    .page-content{
        border: 1px solid #d1dbe5;
        border-top: 0;
    }

    .back-btn{
        margin: 28px 0 28px 42px;
        color: #616d80;
    }
</style>
