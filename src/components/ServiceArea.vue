<template>
    <el-row>
        <el-form-item :label="this.title" v-bind:class="{ 'must': this.check}">
            <el-col :span="5">
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
            <el-col :span="4">
                <el-select v-model="areaData.cityId" :disabled="ifEdit" placeholder="请选择" >
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
                <el-select v-model="areaData.areaId" :disabled="ifEdit" placeholder="请选择" >
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
                <el-select v-model="areaData.streetId" :disabled="ifEdit" placeholder="请选择"  @change="selectChange">
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
        name: 'cityArea',
        props: ['curNum','ifEdit','serviceArea','title',"check"],
        data(){
            return{
                areaData: {
                    provinceId: '',//被选中的省
                    provinceName: '',
                    cityId: '',//被选中的市
                    cityName: '',
                    areaId: '',//被选中的区域
                    areaName: '',
                    streetId: '',//被选中的街道
                    streetName: ''
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
            if(this.ifEdit){
                this.areaData = this.serviceArea;
                this.provinces.push({
                    name: this.areaData.provinceName,
                    id: this.areaData.provinceId
                });
                this.cities.push({
                    name: this.areaData.cityName,
                    id: this.areaData.cityId
                });
                this.areas.push({
                    name: this.areaData.areaName,
                    id: this.areaData.areaId
                });
                this.streets.push({
                    name: this.areaData.streetName,
                    id: this.areaData.streetId
                });
            }
        },
        methods: {
            getProvinces(){
                //获取所有省份信息
                this.$http.get(`${UMS}/city/getAllProvince.do`).then(res=>{
                    this.provinces = res.data.data.list
                }).catch(e=>alert(e));
            },
            selectChange(){
                //获取省名称
                let _this = this;
                if(this.areaData.provinceId){
                    let tempArr = this.provinces.filter(v => v.id === _this.areaData.provinceId);
                    if(tempArr.length > 0 && tempArr[0].name){
                        this.areaData.provinceName = tempArr[0].name;
                        // console.log(this.areaData.provinceName);
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
                if(this.areaData.areaId){
                    let tempArr = this.areas.filter(v=>v.id === _this.areaData.areaId);
                    if(tempArr.length > 0 && tempArr[0].name){
                        this.areaData.areaName = tempArr[0].name;
                    }
                }
                //街道
                if(this.areaData.streetId){
                    let tempArr = this.streets.filter(v=>v.id === _this.areaData.streetId);
                    if(tempArr.length > 0 && tempArr[0].name){
                        this.areaData.streetName = tempArr[0].name;
                    }
                }
                // 每当地址改变的时候 都发射事件（选择的地址， 和当前数字 这个是props，未看出来意义）
                this.$emit('select-change',this.areaData, this.curNum)
                // this.$emit('select-change',this.areaData)
            },
            reSet(){
                this.areaData ={
                    provinceId: '',//被选中的省
                    provinceName: '',
                    cityId: '',//被选中的市
                    cityName: '',
                    areaId: '',//被选中的区域
                    areaName: '',
                    streetId: '',//被选中的街道
                    streetName: ''
                };
            }
        },
        watch:{
            "serviceArea": function(){
                this.areaData = this.serviceArea;
            },
            'ifEdit' : function(){
                this.getProvinces();
            },
            "areaData.provinceId": function() {
                if(this.ifEdit){
                    return false;
                }
                //如果省改变 则表示重新选择，清空市  区  街道
                this.areaData.cityId= '';
                this.areaData.cityName= '';
                this.areaData.areaId= '';
                this.areaData.areaName= '';
                this.areaData.streetId= '';
                this.areaData.streetName= '';
                if(!this.areaData.provinceId){
                    return false;
                }
                //拉取市级信息
                this.$http.get(`${UMS}/city/getCityByPid.do?pid=${this.areaData.provinceId}`).then(res=>{
                    this.cities = res.data.data.list;
                    this.selectChange();
                }).catch(e=>{
                    console.log(e);
                });
            },
            "areaData.cityId": function() {
                if(this.ifEdit){
                    return false;
                }
                this.areaData.areaId= '';
                this.areaData.areaName= '';
                this.areaData.streetId= '';
                this.areaData.streetName= '';
                if(!this.areaData.cityId){
                    return false;
                }
                this.$http.get(`${UMS}/city/getCityByPid.do?pid=${this.areaData.cityId}`).then(res=>{
                    this.areas= res.data.data.list;
                    this.selectChange();
                }).catch(e=>alert(e));

            },
            "areaData.areaId": function() {
                if(this.ifEdit){
                    return false;
                }
                this.areaData.streetId= '';
                this.areaData.streetName= '';
                if(!this.areaData.areaId){
                    return false;
                }
                //拉取街道级信息
                this.$http.get(`${UMS}/city/getCityByPid.do?pid=${this.areaData.areaId}`).then(res=>{
                    this.streets = res.data.data.list;
                    this.selectChange();
                }).catch(e=>alert(e));

            },
            areaData: {
                deep: true,
                handler () {
                    this.$emit('select-change',this.areaData, this.curNum)
                }
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
