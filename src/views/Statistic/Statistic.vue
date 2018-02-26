<template>
<div class="info-container">
    <header class="tab-row" @click='toggleStatistic'>
        <span class="tab active">统计中心</span>
        <span class='tab'>老人需求统计</span>
    </header>
    <div>
        <el-form class='infos' :model="userForm" inline label-width="120px" label-position="left" v-if='type !== 1'>
            <el-row class="m-l">
                <limitArea ref="area" @select-change="selectChange" :num='5' v-if='type === 2'></limitArea>
                <cityArea ref="area" title="服务区域" @select-change="selectChange" curNum="0" v-if='type === 0'></cityArea>
            </el-row>
            <el-row>
                <el-form-item label="服务机构">
                    {{orgName}}
                    <el-button class="button" type="primary" @click="chooseOrg">选择服务机构</el-button>
                </el-form-item>
                <el-button class="button" type="primary" @click="reSet">重置</el-button>
            </el-row>
        </el-form>
        <div class="infos">
            <div class="show-info clearfix">
                <h5>{{time}}</h5>
                <ul class="clearfix">
                    <li class="left">
                        <div class="title">
                            历史累计订单
                        </div>
                        <div class="order">
                            {{info.cumulativeOrderCount}}单
                        </div>
                        <div class="cash">
                            {{info.cumulativeAmount}}元
                        </div>
                    </li>
                    <li class="middle">
                        <div class="title">
                            新订单
                        </div>
                        <div class="order">
                            {{info.todayNewOrderCount}}单
                        </div>
                        <div class="cash">
                            {{info.todayNewOrderAmount}}元
                        </div>
                    </li>
                    <li class="right">
                        <div class="title">
                            已完成订单
                        </div>
                        <div class="order">
                            {{info.todayCompletedOrderCount}}单
                        </div>
                        <div class="cash">
                            {{info.todayCompletedOrderAmount}}元
                        </div>
                    </li>
                </ul>
            </div>
            <div class="list">
                <el-table :data="tableData" stripe border class="list">
                    <el-table-column prop="orgCount" label="在册机构" width="400" align="center">
                    </el-table-column>
                    <el-table-column prop="userCount" label="在册老人" align="center" width="400">
                    </el-table-column>
                    <el-table-column prop="workerCount" label="在册服务人员" align="center">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <org-choose v-if="showOrg" @pop-click="setOrgInfo" :areaData="userForm">
        </org-choose>
    </div>

</div>
</template>
<script>
import limitArea from '@/components/limitArea.vue';
import orgChoose from '@/components/OrgChoose.vue';
import tables from '@/components/table.vue';
import cityArea from '@/components/ServiceArea.vue';
import { MP } from '@/common/config'
export default {
    data() {
        return {
            value: 1,
            orgName: '',
            userForm: {
                orgId: '',
                provinceId: window._dataInfo.provinceId,
                cityId: window._dataInfo.cityId,
                areaId: window._dataInfo.countryId,
                streetId: window._dataInfo.streetId,
            },
            time: '', //时间
            info: {
                date: '', //时间
                todayNewOrderCount: '', //今日新订单数
                todayNewOrderAmount: '', //今日新订单金额
                todayCompletedOrderCount: '', //今日已完成订单数
                todayCompletedOrderAmount: '', //今日已完成订单数
                cumulativeOrderCount: '', //累计订单数
                cumulativeAmount: '', //累计金额
                workerCount: '', //在册服务人员数
                userCount: '', //在册用户（老人）数
                orgCount: '' //在册机构数
            },
            tableData: [],
            showOrg: false,
            totleNum: 0,
            type: window._dataInfo.type
        }
    },
    created() {
        this.getLists()
    },
    components: {
        limitArea,
        orgChoose,
        tables,
        cityArea
    },
    methods: {
        toggleStatistic(e) {
            if (e.target.innerHTML === '老人需求统计') {
                this.$router.push('/integratedMana/statistical1')
            }
        },
        reSet() {
            //清空区域数据
            if (this.type === 0) {
                this.$refs.area.reSet();
            }
            this.orgName = '';
            this.userForm.orgId = '';
        },
        selectChange(areaData) {
            let serviceArea = this.userForm;
            serviceArea.provinceId = areaData.provinceId;
            serviceArea.cityId = areaData.cityId;
            serviceArea.areaId = areaData.areaId;
            serviceArea.streetId = areaData.streetId;
            //获取数据
            this.getLists();
        },
        //选择机构弹框
        chooseOrg() {
            this.showOrg = true;
        },
        //获取选中机构信息
        setOrgInfo(org) {
            if (org) {
                this.userForm.orgId = org.id;
                this.orgName = org.name;
                //获取数据
                this.getLists();
            }
            this.showOrg = false;
        },
        async getLists() {
            let obj = {
                orgId: this.userForm.orgId,
                provinceId: this.userForm.provinceId,
                cityId: this.userForm.cityId,
                countryId: this.userForm.areaId,
                streetId: this.userForm.streetId,
            }
            try {
                let res = await this.$http.post(`${MP}/data/statisticsData`, obj);
                let data = res.data.data
                this.info = data.list;
                this.time = data.date;
                this.tableData = [{
                    workerCount: this.info.workerCount,
                    userCount: this.info.userCount,
                    orgCount: this.info.orgCount,
                }];
            } catch (e) {
                console.log(e);
            }
        }
    }

}
</script>

<style lang="scss" scoped>
    .info-container {
        font-family: PingFangSC-Medium, "PingFang SC", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", "Helvetica Neue", Helvetica, "Hiragino Sans GB", Arial, sans-serif;
        padding-top: 15px;
        position: relative;
    }

    .tab-row {
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
    }

    .tab.active {
        border-bottom: 1px solid #fff;
    }

    .infos {
        margin-top: 10px;
        border: 1px solid #d9d3f8;
        background-color: #fbfbfb;
        padding-top: 10px;
        padding-left: 38px;
        padding-bottom: 50px;
        .show-info {
            h5 {
                font-size: 22px;
                font-family: PingFangSC-Medium;
                color: #616D80;
                border-left: 2px solid #D8D8D8;
                padding-left: 14px;
                margin-bottom: 75px;
            }
            ul {
                margin-bottom: 50px;
                li {
                    float: left;
                    width: 384px;
                    height: 245px;
                    margin-left: 20px;
                    background-size: cover;
                    .title {
                        margin-top: 34px;
                        margin-left: 50px;
                        font-family: PingFangSC-Medium;
                        font-size: 26px;
                        color: #616D80;
                    }
                    .order {
                        margin-top: 46px;
                        font-family: Dosis-Medium;
                        font-size: 30px;
                        color: #5D656F;
                        margin-left: 47px;
                    }
                    .cash {
                        margin-top: 65px;
                        font-family: PingFangSC-Medium;
                        font-size: 30px;
                        color: #B2BFD1;
                        margin-left: 44px;
                    }
                }
                li.left {
                    background-image: url("../../assets/order/history.png");
                }
                li.middle {
                    .title {
                        margin-top: 31px;
                        margin-left: 66px;
                    }
                    .order {
                        margin-left: 64px;
                    }
                    .cash {
                        margin-left: 66px;
                    }
                    background-image: url("../../assets/order/newOrder.png");
                }
                li.right {
                    background-image: url("../../assets/order/doneOrder.png");
                }
            }
        }
    }
</style>