<template>
    <el-row :gutter="20">
        <el-form-item>
            <el-col :span="5">
                <el-select v-model="areaData.provinceId" :disabled="areaNum > 0" placeholder="请选择">
                    <el-option label="无" value=""></el-option>
                    <el-option
                            v-for="item in provinces"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select v-model="areaData.cityId" :disabled="areaNum > 1" placeholder="请选择" >
                    <el-option label="无" value=""></el-option>
                    <el-option
                            v-for="item in cities"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select v-model="areaData.areaId" :disabled="areaNum > 2" placeholder="请选择" >
                    <el-option label="无" value=""></el-option>
                    <el-option
                            v-for="item in areas"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select v-model="areaData.streetId" :disabled="areaNum > 3" placeholder="请选择"  @change="selectChange">
                    <el-option label="无" value=""></el-option>
                    <el-option
                            v-for="item in streets"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-col>
        </el-form-item>
    </el-row>
</template>
<script>
    import { UMS } from '@/common/config'
    export default {
        name: 'limitArea',
        props: [],
        data(){
            return{
                areaData: {
                    provinceId: null,//被选中的省
                    provinceName: null,
                    cityId: null,//被选中的市
                    cityName: null,
                    areaId: null,//被选中的区域
                    areaName: null,
                    streetId: null,//被选中的街道
                    streetName: null
                },
                provinces: [],//省级信息
                cities: [],//市信息
                areas: [],//区域信息
                streets: [],//街道信息
                ruls: [],
                userInfo: window._dataInfo,
                areaNum: 0
            }
        },
        created(){
            if(this.userInfo.provinceId){
                this.areaNum += 1;
                //设置省级数组
                this.provinces = [{
                    id: this.userInfo.provinceId,
                    name: this.userInfo.provinceName
                }];
                this.areaData.provinceId = this.userInfo.provinceId;
                this.areaData.provinceName = this.userInfo.provinceName;
            }

            if(this.userInfo.cityId){
                this.areaNum += 1;
            }

            if(this.userInfo.countryId){
                this.areaNum += 1;
            }

            if(this.userInfo.streetId){
                this.areaNum += 1;
            }
            
            if (!this.areaNum) {
                this.getProvinces()
            }
        },
        methods: {
            getProvinces(){
                //获取所有省份信息
                this.$http.get(`${UMS}/city/getAllProvince.do`).then(res=>{
                    let data = res.data.data
                    this.provinces = data.list;
                }).catch(e=>alert(e));
            },
            selectChange(){
                //如果省市区都备选,则街道存在，获取街道名称
                if(this.areaData.streetId){
                    let tempObj = this.streets.filter(v=>v.id === this.areaData.streetId);
                    if(tempObj.length > 0 && tempObj[0].name)
                    this.areaData.streetName = tempObj[0].name;
                }
                this.$emit('select-change',this.areaData,this.curNum);
            }
        },
        watch:{
            "areaData.provinceId": function() {
                // 获得省名称
                let _this = this;
                if(!this.areaData.provinceId) return false;
                let arr = this.provinces.filter(v=>v.id === _this.areaData.provinceId);
                if(arr.length > 0 && arr[0].name){
                    this.areaData.provinceName = arr[0].name;
                    console.log();
                }
//                this.areaData.provinceName = this.provinces.filter(v=>v.id === _this.areaData.provinceId)[0].name;
                //拉取市级信息
                this.$http.get(`${UMS}/city/getCityByPid.do?pid=`+this.areaData.provinceId).then(res=>{
                    let data = res.data.data
                    this.cities = data.list;
                    if(_this.userInfo.cityId){
                        _this.areaData.cityId = _this.userInfo.cityId;
                        _this.areaData.cityName = _this.userInfo.cityName;
                    }
                    this.selectChange();
                }).catch(e=>{
                    console.log(e);
                });
            },
            "areaData.cityId": function() {
                if(!this.areaData.cityId) return false;
                //拉取区级信息
                let _this = this;
                this.areaData.cityName = this.cities.filter(v=>v.id === _this.areaData.cityId)[0].name;
                this.$http.get(`${UMS}/city/getCityByPid.do?pid=`+this.areaData.cityId).then(res=>{
                    let data = res.data.data
                    _this.areas= data.list;
                    if(_this.userInfo.countryId){
                        _this.areaData.areaId = _this.userInfo.countryId;
                        _this.areaData.areaName = _this.userInfo.countryName;
                    }
                    _this.selectChange();
                }).catch(e=>alert(e));

            },
            "areaData.areaId": function() {
                if(!this.areaData.areaId) return false;
                var _this = this;
                this.areaData.areaName = this.areas.filter(v=>v.id === _this.areaData.areaId)[0].name;
                //拉取街道级信息
                this.$http.get(`${UMS}/city/getCityByPid.do?pid=`+this.areaData.areaId).then(res=>{
                    let data = res.data.data
                    _this.streets = data.list;
                    if(_this.userInfo.streetId){
                        _this.areaData.streetId = _this.userInfo.streetId;
                        _this.areaData.streetName = _this.userInfo.streetName;
                    }
                    _this.selectChange();
                }).catch(e=>alert(e));

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
