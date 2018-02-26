
<template>
    <el-row :gutter="20" v-bind:class="{ 'must': this.check}">
        <el-col :span="3">
            <el-select v-model="areaData.provinceId" :disabled="ifEdit" placeholder="请选择">
                <el-option label="无" value=""></el-option>
                <el-option
                        v-for="item in provinces"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="3">
            <el-select v-model="areaData.cityId" :disabled="ifEdit" placeholder="请选择" label-width="0">
                <el-option label="无" value=""></el-option>
                <el-option
                        v-for="item in cities"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="3">
            <el-select v-model="areaData.zoneId" :disabled="ifEdit" placeholder="请选择" label-width="0">
                <el-option label="无" value=""></el-option>
                <el-option
                        v-for="item in areas"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="3">
            <el-select v-model="areaData.streetId"
                       :disabled="ifEdit"
                       placeholder="请选择"
                       label-width="0"
                       @change="selectChange">
                <el-option label="无" value=""></el-option>
                <el-option
                        v-for="item in streets"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
        </el-col>
        <el-col :span="3">
                <el-input v-model="areaData.community" :disabled="ifEdit" placeholder="请输入所在社区"></el-input>
        </el-col>
        <el-col :span="5">
            <el-input v-model="areaData.detailedAddress" :disabled="ifEdit" placeholder="请输入详细地址"></el-input>
        </el-col>
    </el-row>
</template>
<script>
    import { UMS } from '@/common/config'
    export default {
        name: 'eArea',
        props: ['curNum','ifEdit','data',"check"],
        data(){
            return{
                areaData: {
                    provinceId: '',//被选中的省
                    provinceName: '',
                    cityId: '',//被选中的市
                    cityName: '',
                    zoneId: '',//被选中的区域
                    zoneName: '',
                    streetId: '',//被选中的街道
                    streetName: '',
                    community: '',
                    detailedAddress: ''
                },
                provinces: [],//省级信息
                cities: [],//市信息
                areas: [],//区域信息
                streets: [],//街道信息
                ruls: []
            }
        },
        created(){
            this.getProvinces();
            if(this.data){
                if(this.ifEdit) {
                    this.areaData.provinceId = parseInt(this.data.provinceId);
                    this.areaData.provinceName = this.data.provinceName;
                    this.areaData.cityId = parseInt(this.data.cityId);
                    this.areaData.cityName = this.data.cityName;
                    this.areaData.zoneId = parseInt(this.data.zoneId);
                    this.areaData.zoneName = this.data.zoneName;
                    this.areaData.streetId = parseInt(this.data.streetId);
                    this.areaData.streetName = this.data.streetName;
                    this.areaData.community = this.data.community;
                    this.areaData.detailedAddress = this.data.detailedAddress;
                }
            }
        },
        mounted(){
            //此组件需要重构
        },
        methods: {
            async getProvinces(){
                try{
                    //获取所有省份信息
                    let res= await this.$http.get(`${UMS}/city/getAllProvince.do`,{
                        withCredentials: true
                    });
                    let { list } = res.data.data
                    this.provinces = list;
                    if(this.ifEdit && this.data){
                        this.areaData.provinceId = parseInt(this.data.provinceId);
                    }
                }catch(e){
                    console.log(e);
                }
            },
            async getCities(){
                let res = await this.$http.get(`${UMS}/city/getCityByPid.do?pid=${this.areaData.provinceId}`, {
                    withCredentials: true
                });
                let { list } = res.data.data
                //拉取区级信息
                let _this = this;
                let tempArr = this.provinces.filter(v=>v.id == _this.areaData.provinceId);
                if(tempArr.length > 0 && tempArr[0].name){
                    this.areaData.provinceName = tempArr[0].name;
                }
                //拉取市级信息
                this.cities = list;
                if( this.ifEdit ){
                    this.areaData.cityId = parseInt(this.data.cityId);
                }
                this.selectChange();
            },
            async getAreas(){
                try{
                    let res = await this.$http.get(`${UMS}/city/getCityByPid.do?pid=${this.areaData.cityId}`, {
                        withCredentials: true
                    });
                    let { list } = res.data.data
                    this.areas = list;
                    let _this = this;
                    let tempArr = this.cities.filter(v=>v.id == _this.areaData.cityId);
                    if(tempArr.length > 0 && tempArr[0].name){
                        this.areaData.cityName = tempArr[0].name;
                    }
                    if( this.ifEdit ){
                        this.areaData.zoneId = parseInt(this.data.zoneId);
                    }
                    this.selectChange();
                }catch(e){
                    console.log(e)
                }
            },
            async getStreets(){
                try{
                    let res = await this.$http.get(`${UMS}/city/getCityByPid.do?pid=${this.areaData.zoneId}`, {
                        withCredentials: true
                    })
                    let { list } = res.data.data
                    this.streets = list;
                    let _this = this;
                    let tempArr = this.areas.filter(v=>v.id == _this.areaData.zoneId);
                    if(tempArr.length > 0 && tempArr[0].name){
                        this.areaData.zoneName = tempArr[0].name;
                    }
                    if( this.ifEdit ){
                        this.areaData.streetId = parseInt(this.data.streetId);
                    }
                    this.selectChange();
                }catch(e){
                    console.log(e)
                }
            },
            selectChange(){
                //如果省市区都备选,则街道存在，获取街道名称
                if(this.areaData.streetId){
                    let obj = this.streets.filter(v=>v.id === this.areaData.streetId);
                    if(obj.length && obj.length > 0 && obj[0].name){
                        this.areaData.streetName = obj[0].name;
                    }
                }
                this.$emit('select-change',this.areaData,this.curNum);
            },
            reSet(){
                this.areaData ={
                    provinceId: "",//被选中的省
                    provinceName: "",
                    cityId: "",//被选中的市
                    cityName: "",
                    zoneId:"",//被选中的区域
                    zoneName:"",
                    streetId: "",//被选中的街道
                    streetName: ""
                };
            }
        },
        watch:{
            "data" : function(){
                this.getProvinces();
                if(this.ifEdit) {
                    this.areaData.provinceId = parseInt(this.data.provinceId);
                    this.areaData.provinceName = this.data.provinceName;
                    this.areaData.cityId = parseInt(this.data.cityId);
                    this.areaData.cityName = this.data.cityName;
                    this.areaData.zoneId = parseInt(this.data.zoneId);
                    this.areaData.zoneName = this.data.zoneName;
                    this.areaData.streetId = parseInt(this.data.streetId);
                    this.areaData.streetName = this.data.streetName;
                    this.areaData.community = this.data.community;
                    this.areaData.detailedAddress = this.data.detailedAddress;
                }
            },
            "areaData.provinceId": function() {
                if(!this.ifEdit){
                    this.areaData.cityId = '';
                    this.areaData.zoneId= '';
                    this.areaData.streetId = '';

                    this.cities = [];
                    this.areas = [];
                    this.streets = [];
                }
                try{
                    if(!this.areaData.provinceId){
                        return false;
                    }
                    // 获得市信息
                    this.getCities()
                }catch(e){
                    console.log(e);
                }
            },
            "areaData.cityId": function() {
                if(!this.ifEdit){
                    this.areaData.zoneId= '';
                    this.areaData.streetId = '';

                    this.areas = [];
                    this.streets = [];
                }

                if(!this.areaData.cityId){
                    return false;
                }
                //拉取区级信息
                this.getAreas();
            },
            "areaData.zoneId": function() {
                if(!this.ifEdit)  {
                    this.areaData.streetId = '';
                    this.streets = [];
                }

                if(!this.areaData.zoneId){
                    return false;
                }
                //拉取街道级信息
                this.getStreets();
            },
            "areaData.community": function(){
                this.selectChange();
            },
            "areaData.detailedAddress" : function(){
                this.selectChange();
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
