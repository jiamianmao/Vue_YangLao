<template>
    <el-row :gutter="20">
        <el-dialog title="添加地址" class="dialog"
                   :visible="true"
                   :show-close="false"
                   :lock-scroll="true"
                   :close-on-click-modal="false"
                   :modal="true">
            <el-form :model="areaData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="省">
                    <!--<el-col :span="5">-->
                    <el-select v-model="areaData.provinceId" placeholder="请选择">
                        <el-option label="无" value=""></el-option>
                        <el-option
                                v-for="item in provinces"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <!--</el-col>-->
                </el-form-item>
                <el-form-item label="市">
                    <!--<el-col :span="4">-->
                    <el-select v-model="areaData.cityId"  placeholder="请选择" >
                        <el-option label="无" value=""></el-option>
                        <el-option
                                v-for="item in cities"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <!--</el-col>-->
                </el-form-item>
                <el-form-item label="区县">
                    <!--<el-col :span="4">-->
                    <el-select v-model="areaData.zoneId"  placeholder="请选择" >
                        <el-option label="无" value=""></el-option>
                        <el-option
                                v-for="item in areas"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <!--</el-col>-->
                </el-form-item>
                <el-form-item label="街道">
                    <!--<el-col :span="4">-->
                    <el-select v-model="areaData.streetId" placeholder="请选择">
                        <el-option label="无" value=""></el-option>
                        <el-option
                                v-for="item in streets"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <!--</el-col>-->
                </el-form-item>
                <el-form-item label="社区" prop="email">
                    <el-input v-model="areaData.community"></el-input>
                </el-form-item>
                <el-form-item label="详细地址" prop="email">
                    <el-input v-model="areaData.detailedAddress"></el-input>
                </el-form-item>
            </el-form>
            <el-button @click="cliCancle">取 消</el-button>
            <el-button type="primary" @click="cliConfirm">确 定</el-button>
        </el-dialog>
    </el-row>
</template>
<script>
    import { UMS } from '@/common/config'
    export default {
        name: 'addAddress',
        data(){
            return{
                areaData: {
                    provinceId: "",//被选中的省
                    provinceName: "",
                    cityId: "",//被选中的市
                    cityName: "",
                    zoneId: "",//被选中的区域
                    zoneName: "",
                    streetId: "",//被选中的街道
                    streetName: "",
                    community: "",//社区
                    detailedAddress: ""//详细地址
                },
                provinces: [],//省级信息
                cities: [],//市信息
                areas: [],//区域信息
                streets: [],//街道信息
                rules: {}
            }
        },
        created(){
            //获取所有省份信息
            this.$http.get(`${UMS}/city/getAllProvince.do`,{
                withCredentials: true
            }).then(res=>{
                let data = res.data.data
                this.provinces = data.list;
            }).catch(e=>console.log);
        },
        methods: {
            //通知父元素按下了确认
            cliConfirm(){
                //获取省名称
                let _this = this;
                if(this.areaData.provinceId){
                    let tempArr = this.provinces.filter(v=>v.id === _this.areaData.provinceId);
                    if(tempArr.length > 0 && tempArr[0].name){
                        this.areaData.provinceName = tempArr[0].name;
                    }
                }
                //市
                if(this.areaData.cityId){
                    let tempArr = this.cities.filter(v=>v.id === _this.areaData.cityId);
                    if(tempArr.length > 0 && tempArr[0].name){
                        this.areaData.cityName = tempArr[0].name;
                    }
                }
                //区
                if(this.areaData.zoneId){
                    let tempArr = this.areas.filter(v=>v.id === _this.areaData.zoneId);
                    if(tempArr.length > 0 && tempArr[0].name){
                        this.areaData.zoneName = tempArr[0].name;
                    }
                }
                //街道
                if(this.areaData.streetId){
                    let tempArr = this.streets.filter(v=>v.id === _this.areaData.streetId);
                    if(tempArr.length > 0 && tempArr[0].name){
                        this.areaData.streetName = tempArr[0].name;
                    }
                }
                //
                this.$emit('pop-click',this.areaData);
            },
            //通知父元素按下了取消
            cliCancle(){
                this.$emit('pop-click');
            },
        },
        watch:{
            "areaData.provinceId": function() {
                //如果省改变 则表示重新选择，清空市  区  街道
                this.areaData.cityId= '';
                this.areaData.cityName= '';
                this.areaData.zoneId= '';
                this.areaData.zoneName= '';
                this.areaData.streetId= '';
                this.areaData.streetName= '';
                if(!this.areaData.provinceId){
                    return false;
                }
                //拉取市级信息
                this.$http.get(`${UMS}/city/getCityByPid.do?pid=${this.areaData.provinceId}`, {
                    withCredentials: true
                }).then(res => {
                    let data = res.data.data
                    this.cities = data.list;
                }).catch(e=>console.log);

            },
            "areaData.cityId": function() {
                this.areaData.zoneId= '';
                this.areaData.zoneName= '';
                this.areaData.streetId= '';
                this.areaData.streetName= '';
                if(!this.areaData.cityId){
                    return false;
                }
                this.$http.get(`${UMS}/city/getCityByPid.do?pid=${this.areaData.cityId}`, {
                    withCredentials: true
                }).then(res => {
                    let data = res.data.data
                    this.areas= data.list;
                }).catch(e=>console.log);

            },
            "areaData.zoneId": function() {
                this.areaData.streetId= '';
                this.areaData.streetName= '';
                if(!this.areaData.zoneId){
                    return false;
                }
                this.$http.get(`${UMS}/city/getCityByPid.do?pid=${this.areaData.zoneId}`, {
                    withCredentials: true
                }).then(res => {
                    let data = res.data.data
                    this.streets = data.list;
                }).catch(e=>console.log);
            }
        }
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
</style>
