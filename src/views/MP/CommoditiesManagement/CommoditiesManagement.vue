<template>
    <pageContainer title='商品管理' class="org-m">
        <div class="search">
            <!--<div class="head clearfix">f
                <h5 class="fl">商品管理</h5>
                <div></div>
            </div>-->
            <div class="search-table">
                <el-row>
                    <el-col :span="6"  v-if=" type === 1">
                        <el-button class="button" type="primary" @click="addPr">上架新商品</el-button>
                    </el-col>
                </el-row>
                <el-form :model="userForm" label-width="120px" class="demo-ruleForm form">
                    <el-row class="area">
                        <cityArea ref="area"
                                  title="服务区域"
                                  @select-change="selectChange"
                                  curNum="0"
                                  v-if="type === 0"></cityArea>
                        <limitArea v-if="type === 2" @select-change="selectChange"></limitArea>
                    </el-row>
                    <el-row>
                        <el-col :span="6" v-if=" type !== 1">
                            <el-form-item label="服务机构">
                                {{userForm.condition.orgName}}
                                <el-button class="button" type="primary" @click="chooseOrg">选择服务机构</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="服务品类(一级)">
                                <el-select v-model="userForm.condition.catePid" placeholder="请选择一级品类">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for= "cate in cateList"
                                            :label="cate.cateName"
                                            :value="cate.catePid"
                                            :key="cate.catePid">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="服务品类(二级)">
                                <el-select v-model="userForm.condition.cateId" placeholder="请选择二级品类">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="item in cates"
                                            :label="item.cateName"
                                            :value="item.cateId"
                                            :key="item.cateId"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="是否上架">
                                <el-select v-model="userForm.condition.isOnShelves" placeholder="请选择机构状态">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item>
                            <el-button type="primary" @click="sift">筛选</el-button>
                            <el-button type="primary" @click="reSet">重置</el-button>
                            <el-button type="primary">
                                <a download="test" class="download" :href="`http://mp.17link.cc/manage/product/export?${getParams(getQuery(this.userForm))}`">导出</a>
                            </el-button>
                        </el-form-item>
                    </el-row>
                </el-form>
            </div>
        </div>
        <div class="list">
            <el-table :data="tableData" stripe border class="list">
                <el-table-column prop="control" label="商品编号" width="249">
                    <template slot-scope="scope">
                        <el-button
                                @click.native.prevent="linkTo(scope.$index, tableData)"
                                type="text"
                                size="small">
                            {{tableData[scope.$index].id}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="orgName"
                        label="养老机构"
                        width="249">
                </el-table-column>
                <el-table-column
                        prop="catePname"
                        label="服务大类"
                        width="249">
                </el-table-column>
                <el-table-column
                        prop="cateName"
                        label="服务品类"
                        width="249">
                </el-table-column>
                <el-table-column
                        prop="serviceDuration"
                        label="单次服务时间/分钟"
                        width="249">
                </el-table-column>
                <el-table-column
                        prop="price"
                        label="价格/次"
                        width="249">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="是否上架"
                        width="249">
                </el-table-column>
                <el-table-column prop="control" label="操作" v-if=" type === 1">
                    <template slot-scope="scope">
                        <el-button
                                @click.native.prevent="changeStatus(scope.$index, tableData)"
                                type="text"
                                size="small">
                            {{getAdverseStatus(tableData[scope.$index].status)}}
                        </el-button>
                        <el-button
                                @click.native.prevent="edit(tableData[scope.$index])"
                                type="text"
                                size="small"
                                v-if="tableData[scope.$index].isOnShelves === 1">
                            修改
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
        </div>
        <org-choose v-if="showOrg"
                    :areaData='serviceAreaMap'
                    @pop-click="setOrgInfo">
        </org-choose>
        <control-pr v-if="showDialog"
                   :cateList = 'cateList'
                   :info = 'info'
                   :id= "id"
                   :dialogTitle = 'dialogTitle'
                   :flag="flag"
                   @pop-click="dialogClick">
        </control-pr>
    </pageContainer>
</template>
<script>

    import PageContainer from '@/components/PageContainer.vue'; 
    import cityArea from '@/components/ServiceArea.vue';
    import limitArea from '@/components/limitArea.vue';
    import orgChoose from '@/components/OrgChoose.vue';
    import controlPr from './editPro.vue';
    import { MP } from '@/common/config'
    export default {
        data(){
            return{
                userForm: {
                    pageNum: 1,
                    pageSize: 10,
                    condition: {
                        orgId: '',
                        orgName: "",
                        catePid: '',
                        cateId: '',
                        isOnShelves: ''
                    },
                    serviceArea: {
                        cityId: '',
                        cityName: "",
                        provinceId: '',
                        provinceName: "",
                        streetId: '',
                        streetName: "",
                        zoneId: '',
                        zoneName: ""
                    },
                },
                userInfo: window._dataInfo,
                type: window._dataInfo.type, //0平台1机构2政府
                tableData: [],
                cateList: [],
                showOrg: false,
                totalNum: '',
                showDialog: false,
                dialogTitle: '',
                flag: true,
                info:{
                    catePid: '',
                    catePname: '',
                    cateId: '',
                    cateName: '',
                    serviceDuration: '',
                    price: '',
                    isOnShelves: '',
                    orgId: window._dataInfo.orgId,
                    orgName: window._dataInfo.orgName
                },
                id: '',
                serviceAreaMap: {}
            }
        },
        components: {
            cityArea,
            limitArea,
            orgChoose,
            controlPr,
            PageContainer
        },
        computed: {
            cates: function(){
                let _this = this;
                let cates = [];
                let pid = this.userForm.condition.catePid;
                let arr = this.cateList.filter(v=>v.catePid == pid);
                let cateList = this.cateList;
                if(arr.length > 0){
                    for(let i = 0 ; i < cateList.length; i++){
                        if(cateList[i].catePid == pid && cateList[i].cate){
                            cates = cateList[i].cate;
                            return cates;
                        }
                    }
                }
                return cates || [];
            }
        },
        created(){
            this.getCates();
            this.getLists(function(){
                this.userForm.pageSize = 1000;
            });
        },
        methods: {
            sift(){
                this.userForm.pageSize = 10;
                this.getLists();
            },
            getCates(){
                this.$http.get(`${MP}/manage/category/query`).then(res=>{
                    let data = res.data.data
                    this.cateList = data.list;
                }).catch(e=>alert(e));
            },
            changeStatus(index, tableData){
                let temp = tableData[index];
                let isOnShelves = temp.isOnShelves === 1? 2: 1;
                this.$http.post(`${MP}/manage/product/switch`, {
                    id:  tableData[index].id,
                    isOnShelves: isOnShelves,
                    operatorId: this.userInfo.id,
                    operatorName: this.userInfo.name
                }).then(data=>{
                    alert('操作成功');
                    temp.isOnShelves = isOnShelves;
                    temp.status = (tableData[index].isOnShelves === 1 ? "是" : "否")
                }).catch(e=>console.log);
            },
            getAdverseStatus(status){
                if(!status.trim) return '否';
                if(status.trim() === '是'){
                    return '下架'
                }else{
                    return '上架'
                }
            },
            selectChange(areaData){
                let serviceArea = this.userForm.serviceArea;
                serviceArea.provinceId = areaData.provinceId;
                serviceArea.provinceName = areaData.provinceName;
                serviceArea.cityId = areaData.cityId;
                serviceArea.cityName = areaData.cityName;
                serviceArea.zoneId = areaData.areaId;
                serviceArea.zoneName = areaData.areaName;
                serviceArea.streetId = areaData.streetId;
                serviceArea.streetName = areaData.streetName;
                this._change()
            },
            //获取选中机构信息
            setOrgInfo(org){
                if(org){
                    this.userForm.condition.orgId = org.id;
                    this.userForm.condition.orgName = org.name;
                }
                this.showOrg = false;
            },
            pageChange(page){
                this.userForm.pageNum = page;
                this.userForm.pageSize = 10;
                this.getLists();
            },
            reSet(){
                this.userForm = {
                    pageNum: 1,
                    pageSize: 1000,
                    condition: {
                        orgId: '',
                        catePid: '',
                        cateId: '',
                        isOnShelves: ''
                    },
                    serviceArea: {
                        cityId: '',
                        cityName: "",
                        provinceId: '',
                        provinceName: "",
                        streetId: '',
                        streetName: "",
                        zoneId: '',
                        zoneName: ""
                    }
                }
                if (this.type !== 2) {
                    this.$refs.area && this.$refs.area.reSet()
                }
            },
            getLists(fn){
                this.$http.post(`${MP}/manage/product/query`, this.userForm).then(res=>{
                    let data = res.data.data
                    this.totalNum = data.count;
                    this.tableData = data.list;
                    this.tableData.forEach(v=>v.status = (v.isOnShelves === 1 ? " 是" : "否"));
                    if(fn) fn();
                }).catch(e=>console.log);
            },
            chooseOrg(){
                this.showOrg = true;
            },
            linkTo(index,tableData){
                this.$router.push({
                    path: '/integratedMana/CommodityInfo',
                    query: {
                        id: tableData[index].id
                    }
                });
            },
            edit(tableData){
                for(let k in this.info)
                    this.info[k] = tableData[k];

                this.info.orgId = window._dataInfo.orgId;
                this.info.orgName = window._dataInfo.orgName;
                this.id = tableData.id;
                this.dialogTitle = '修改商品';
                this.flag = true; //是否为修改商品
                this.showDialog = true;
            },
            addPr(){
                this.info.orgId = window._dataInfo.orgId;
                this.info.orgName = window._dataInfo.orgName;
                this.dialogTitle = '创建商品';
                this.flag = false; //是否为修改商品
                this.showDialog = true;
            },
            dialogClick(...arg){
                if(arg.length > 0){
                    let url = '';
                    if(arg[1]){
                        //修改商品
                        url = `${MP}/manage/product/update`;
                    }else{
                        //添加
                        url = `${MP}/manage/product/add`;
                    }
                    this.$http.post(url,arg[0]).then(res=>{
                        if (res.data.errCode === 1) {
                            alert(res.data.errMessage)
                        } else {
                            alert('操作成功');
                            this.userForm.pageSize = 10;
                            this.getLists();
                        }
                    }).catch(e=>alert(e));
                }
                this.showDialog = false;
            },
            getQuery(data){
                var dataStr = ''
                for(var key in data){
                    if(typeof data[key] === 'object') dataStr += this.getQuery(data[key]);
                    else{
                        dataStr += key + '=' + data[key] + '&'
                    }
                }
                return dataStr;
            },
            getParams(data){
                return data.slice(0, -1);
            },
            _change () {
                this.serviceAreaMap = {
                    cityId: this.userForm.serviceArea.cityId,
                    cityName: this.userForm.serviceArea.cityName,
                    provinceId: this.userForm.serviceArea.provinceId,
                    provinceName: this.userForm.serviceArea.provinceName,
                    streetId: this.userForm.serviceArea.streetId,
                    streetName: this.userForm.serviceArea.streetName,
                    areaId: this.userForm.serviceArea.zoneId,
                    areaName: this.userForm.serviceArea.zoneName
                }
            }
        },
        watch: {
            userForm: {
                deep: true,
                handler () {
                    this._change()
                }
            }
        }
    }
</script>
<style lang="scss">
    .org-m{
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
                // background-color: #FBFBFB;
                // border: 1px solid #CAD3DF;
                padding-top: 10px;
                margin-top: -1px;
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
