<template>
<div class="info-container">
    <header class="tab-row" @click='toggleStatistic'>
        <span class="tab">统计中心</span>
        <span class='tab active'>老人需求统计</span>
    </header>

    <main class='page-content'>

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
            <div class="btn_box">
                <el-row>
                    <el-button type="primary" id='excel' @click='toggleType(0)'>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-Excel"></use>
                        </svg>EXCEL表单展示
                    </el-button>
                    <el-button id='echart' @click='toggleType(1)'>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-tubiao"></use>
                        </svg>图标展示
                    </el-button>
                    <div class="wrapper" v-show='excel'>
                        <img class='full_icon' @click='toFull(0)' src="./full.png">
                        <el-table
                            :data="tableData"
                            border
                            style="width: 100%">
                            <el-table-column align='center' v-for='(value, key) of dict' :key='value' :prop='key' :label="value" width="140">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-row>
            </div>
            <div class='box'>
                <div class="wrapper wrapper_data" ref='data_tv' v-show='!excel'>
                    <div class="main_wrapper">
                        <div id="main" ></div>
                        <div id="main1"></div>
                    </div>
                    <div class='fullwrapper' v-show='notFull'>
                        <el-select v-model="value" placeholder="请选择">
                            <el-option v-for="item in options" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <org-choose v-if="showOrg" @pop-click="setOrgInfo" :areaData="userForm">
    </org-choose>

</div>
</template>
<script>
import limitArea from '@/components/limitArea.vue';
import cityArea from '@/components/ServiceArea.vue';
import orgChoose from '@/components/OrgChoose.vue';
import '../../common/iconfont.js'
import { MP } from '@/common/config'

export default {

    data() {
        return {
            excel: true,
            options: [],
            value: 0,
            notFull: true,
            orgName: '',
            userForm: {
                orgId: window._dataInfo.orgId,
                provinceId: window._dataInfo.provinceId,
                cityId: window._dataInfo.cityId,
                areaId: window._dataInfo.countryId,
                streetId: window._dataInfo.streetId,
            },
            showOrg: false,
            tableDataExcel: 1,
            totleNum: 0,
            type: window._dataInfo.type,
            tableData: [],
            dict: {
                'StreetName': '乡镇服务',
                'geriattricNursing': '老年护理服务',
                'assistedMedical': '协助医疗护理服务',
                'communication': '通讯服务',
                'consultation': '咨询服务',
                'diet': '膳食服务',
                'entrust': '委托代办服务',
                'environment': '环境卫生服务',
                'forHelp': '助行服务',
                'health': '养生服务',
                'leisure': '休闲娱乐服务',
                'medicalCare': '医疗保健服务',
                'other': '其他',
                'personalLife': '个人生活照料服务',
                'psychologicalSupport': '心理精神支持服务',
                'security': '安全保护服务',
                'teach': '教育服务',
                'wash': '洗涤服务'
            },
            initKey: 0,
            xAxis: []
        }
    },
    created () {
        this._getExcel()
    },
    components: {
        limitArea,
        cityArea,
        orgChoose
    },
    methods: {
        _getData (n) {
            // 树状图
            let initData = []
            // 饼状图
            let initData1 = []
            this.tableData.forEach(item => {
                initData.push(item[n])
                initData1.push({
                    value: item[n],
                    name: item['StreetName']
                })
            })
            this.canvasData = initData
            this.canvasData1 = initData1
            this._initCanvas()
        },
        _initCanvas() {
            this.myChart = echarts.init(document.getElementById('main'))
            this.myChart1 = echarts.init(document.getElementById('main1'))
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c}"
                },
                xAxis: {
                    data: this.xAxis
                },
                yAxis: {},
                series: [{
                    name: (this.options[this.initKey] && this.options[this.initKey].label) || '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#409EFF'
                        }
                    },
                    data: this.canvasData
                }]
            }
            let option1 = {
                xAxis: {
                    show: false
                },
                yAxis: {
                    show: false
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series: [{
                    name: (this.options[this.initKey] && this.options[this.initKey].label) || '',
                    type: 'pie',
                    data: this.canvasData1,
                    roseType: 'area',
                    radius: [30, 110],
                    center: ['75%', '50%']
                }]

            }
            this.myChart.setOption(option)
            this.myChart1.setOption(option1)
        },
        toggleStatistic(e) {
            if (e.target.innerHTML === '统计中心') {
                this.$router.push('/integratedMana/statistical')
            }
        },
        toggleType(idx) {
            if (idx === 1) {
                $('#excel').removeClass('el-button--primary').addClass('el-button--default')
                $('#echart').removeClass('el-button--default').addClass('el-button--primary')
                this.excel = false
                this.value = 1
            } else {
                $('#echart').removeClass('el-button--primary').addClass('el-button--default')
                $('#excel').removeClass('el-button--default').addClass('el-button--primary')
                this.excel = true
            }
        },
        toFull(idx) {
            if (idx === 0) {
                const el = this.$refs.data_excel
                if (screenfull.enabled) {
                    screenfull.request(el)
                }
            } else if (idx === 1) {
                const el = this.$refs.data_tv
                if (screenfull.enabled) {
                    screenfull.request(el)
                }
            }
            if (screenfull.enabled) {
                screenfull.on('change', () => {
                    this.notFull = screenfull.isFullscreen ? false : true
                });
            }
        },
        reSet() {
            //清空区域数据
            if (this.type === 0) {
                this.$refs.area.reSet()
            }
            // 为了应对现在业务，此处数据被污染
            this.orgName = ''
            // 清空时把其orgId
            this.userForm.orgId = window._dataInfo.orgId
        },
        selectChange(areaData) {
            let serviceArea = this.userForm;
            serviceArea.provinceId = areaData.provinceId;
            // serviceArea.provinceName = areaData.provinceName;
            serviceArea.cityId = areaData.cityId;
            // serviceArea.cityName = areaData.cityName;
            // serviceArea.countryId = areaData.areaId;
            serviceArea.areaId = areaData.areaId;
            // serviceArea.countryName = areaData.areaName;
            serviceArea.streetId = areaData.streetId;
            // serviceArea.streetName = areaData.streetName;
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
                // this.getLists();
            }
            this.showOrg = false;
        },
        _getExcel() {
            console.log('_getExcel')
            this.$http.get(`${MP}/data/statisticsToExcel?orgId=${this.userForm.orgId}`).then(res => {
                if (res.data.errCode === 0) {
                    this.tableData = res.data.data
                    let result = res.data.data[0]
                    let ar = []
                    res.data.data.forEach(item => {
                        ar.push(item.StreetName)
                    })
                    this.xAxis = ar
                    let i = 0
                    let arr = []
                    for (let k in result) {
                        if (k === 'StreetName') {
                            continue
                        }
                        i++
                        arr.push({
                            value: i - 1,
                            label: this.dict[k]
                        })
                    }
                    this.options = arr
                    if (!this.excel) {
                        this._handlerCanvas()
                    }
                }
            })
        },
        _handlerCanvas () {
            let option
            let option1
            let name = (this.options[this.value] && this.options[this.value].label) || ''
            let value
            for (let i in this.dict) {
                if (this.dict[i] === name) {
                    value = i
                }
            }
            this._getData(value)
            option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c}"
                },
                xAxis: {
                    data: this.xAxis,
                    show: true
                },
                yAxis: {
                    show: true
                },
                series: [{
                    name,
                    type: 'bar',
                    data: this.canvasData
                }]
            }
            option1 = {
                xAxis: {
                    show: false
                },
                yAxis: {
                    show: false
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series: [{
                    name,
                    type: 'pie',
                    data: this.canvasData1
                }]
            }
            this.myChart.setOption(option)
            this.myChart1.setOption(option1)
        }
    },
    watch: {
        value() {
            this._handlerCanvas()
        },
        orgName () {
            this._getExcel()
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

    .page-content {
        border: 1px solid #d1dbe5;
        border-top: 0;
    }

    .info {
        height: 100vh;
        width: 100vw;
        box-sizing: border-box;
        margin-top: -1px;
        padding-top: 10px;
        padding-left: 38px;
        padding-bottom: 50px;
    }

    .wrapper {
        margin-top: 50px;
        position: relative;
    }

    .wrapper_data {
        position: relative;
        display: flex;
        flex-flow: row nowrap;
    }

    .full_icon {
        position: absolute;
        top: 0;
        right: 300px;
        height: 36px;
    }

    .main_wrapper {
        display: flex;
        flex-flow: row wrap;
        margin-top: 50px;
        #main, {
            width: 900px;
            height:600px;
        }
        #main1{
            width: 500px;
            height: 600px;
        }
    }

    .fullwrapper {
        position: absolute;
        top: 0;
        right: 300px;
        display: flex;
        flex-flow: row nowrap;
    }

    .fullwrapper img {
        margin-left: 10px;
        height: 36px;
    }

    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
        margin-right: 4px;
    }

    .excelImg {
        width: 70%;
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