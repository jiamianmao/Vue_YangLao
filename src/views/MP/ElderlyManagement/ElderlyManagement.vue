<template>
    <pageContainer title='老人管理' class="org-m">
        <div class="search">
            <div class="search-table">
                <!--<el-row v-if=" type === 1">
                    <el-col :span="6">
                        <el-button class="button" type="primary" @click="add">添加老人</el-button>
                    </el-col>
                </el-row>-->
                <el-form :model="userForm" label-width="120px" class="demo-ruleForm form">
                    <el-row class="area">
                        <cityArea ref="area"
                                  title="服务区域"
                                  @select-change="selectChange"
                                  curNum="0"
                                  v-if="type === 0"></cityArea>
                        <limitArea @select-change="selectChange" v-if="type === 2"></limitArea>
                    </el-row>
                    <el-row v-if=" type !== 1">
                        <el-col :span="6">
                            <el-form-item label="服务机构">
                                {{userForm.condition.orgName}}
                                <el-button class="button" type="primary" @click="chooseOrg">选择服务机构</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="老人姓名">
                                <el-input v-model="userForm.condition.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="老人手机">
                                <el-input v-model="userForm.condition.mobile"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="老人性别">
                                <el-select v-model="userForm.condition.sex" placeholder="请选择机构状态">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option label="男" value="1"></el-option>
                                    <el-option label="女" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="老人状态">
                                <el-select v-model="userForm.condition.state" placeholder="请选择机构状态">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option label="正常" value="2"></el-option>
                                    <el-option label="失效" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="7">
                            <el-form-item label="创建时间">
                                <el-date-picker
                                        v-model="time"
                                        type="datetimerange"
                                        start-placeholder="选择时间范围">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item>
                            <el-col :span="10">
                                <el-button type="primary" @click="sift">筛选</el-button>
                                <el-button type="primary" @click="reSet">重置</el-button>
                                <el-button type="primary">
                                    <a download='' class="download" :href="`http://mp.17link.cc/manage/user/export?${getParams(getQuery(this.userForm))}`">导出</a>
                                </el-button>
                                <el-button v-if="type === 1" icon="plus" type="primary" @click="add">添加老人</el-button>
                            </el-col>
                            <el-col :span="2" v-if='type === 1'>
                                <el-upload action="http://mp.17link.cc/manage/user/import"
                                           :multiple="false"
                                           :with-credentials='true'
                                           :on-success="handleAvatarSuccess"
                                           :before-upload="beforeAvatarUpload">
                                    <el-button type="primary">导入老人信息</el-button>
                                </el-upload>
                            </el-col>
                            <el-col :span="3" v-if='type === 1'>
                                <el-button type="text" class="temp-download">
                                    <a download="" href="http://mp.17link.cc/manage/user/template">获取老人信息模板</a>
                                </el-button>
                            </el-col>
                        </el-form-item>
                    </el-row>
                </el-form>
            </div>
        </div>
        <div class="list">
            <el-table :data="tableData" stripe border class="list">
                <el-table-column
                        prop="orgName"
                        label="养老机构"
                        width="249">
                </el-table-column>
                <el-table-column
                        prop="residenceProvinceName"
                        label="省"
                        width="249">
                </el-table-column>
                <el-table-column
                        prop="residenceCityName"
                        label="市"
                        width="249">
                </el-table-column>
                <el-table-column
                        prop="residenceZoneName"
                        label="区县"
                        width="249">
                </el-table-column>
                <el-table-column
                        prop="residenceStreetName"
                        label="街道"
                        width="249">
                </el-table-column>
                <el-table-column
                        prop="community"
                        label="社区"
                        width="249">
                </el-table-column>
                <el-table-column prop="control" label="老人姓名" width="249">
                    <template slot-scope="scope">
                        <el-button
                                @click.native.prevent="linkTo(scope.$index, tableData)"
                                type="text"
                                size="small">
                            {{tableData[scope.$index].name}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="sexShow"
                        label="性别"
                        width="249">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="老人手机"
                        width="249">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="固定电话"
                        width="249">
                </el-table-column>
                <el-table-column
                        prop="createTimeShow"
                        label="创建时间"
                        width="249">
                </el-table-column>
                <el-table-column
                        prop="stateShow"
                        label="老人状态"
                        width="249">
                </el-table-column>
                <el-table-column prop="control" label="操作" v-if=" type === 1">
                    <template slot-scope="scope">
                        <el-button
                                @click.native.prevent="changeStatus(scope.$index, tableData)"
                                type="text"
                                size="small">
                            {{getAdverseStatus(tableData[scope.$index].stateShow)}}
                        </el-button>
                        <el-button
                                @click.native.prevent="edit(tableData[scope.$index])"
                                type="text"
                                size="small"
                                v-if="tableData[scope.$index].stateShow === '正常' ">
                            修改
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination
                    @current-change="pageChange"
                    :page-size="10"
                    layout="total, prev, pager, next"
                    :total="totleNum">
            </el-pagination>
        </div>
        <org-choose v-if="showOrg"
                    @pop-click="setOrgInfo"
                    :areaData="serviceAreaMap">
        </org-choose>

    </pageContainer>
</template>
<script>
    import cityArea from '@/components/ServiceArea.vue';
    import limitArea from '@/components/limitArea.vue';
    import orgChoose from '@/components/OrgChoose.vue';
    import PageContainer from '@/components/PageContainer.vue'; 
    import { MP } from '@/common/config' 
    export default {
        data(){
            return{
                userForm: {
                    pageNum: 1,
                    pageSize: 10,
                    condition: {
                        orgId: "",
                        name: "",
                        mobile: "",
                        sex: "",
                        state: "",
                        createDateFrom: "",
                        createDateTo: "",
                        managerName: window._dataInfo.name,
                        managerId: window._dataInfo.id
                    },
                    serviceArea:{
                        provinceId: '',
                        provinceName: '',
                        cityId: '',
                        cityName: '',
                        zoneId: '',  // 改过了
                        zoneName: '',
                        streetId: '',
                        streetName: ''
                    }
                },
                serviceAreaMap: {},
                userInfo: window._dataInfo,
                type: window._dataInfo.type, //0平台1机构2政府
                tableData: [],
                showOrg: false,
                time: [],
                totleNum: 0
            }
        },
        components: {
            cityArea,
            limitArea,
            orgChoose,
            PageContainer
        },
        created(){
            this.getLists();
        },
        methods: {
            sift(){
                var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
                let num = this.userForm.condition.mobile
                if (num && !myreg.test(num)) {
                    alert('请输出正确手机号')
                    return
                }
                this.userForm.pageSize = 10;
                this.getLists();
            },
            //修改老人状态
            changeStatus(index, tableData){
                let temp = tableData[index];
                let id = tableData[index].id;
                let state = temp.state === 1 ? 2: 1;
                this.$http.post(`${MP}/manage/user/stateSwitch`, 'id='+id+'&state='+state).then(data=>{
                    alert('修改成功');
                    this.getLists();
                }).catch(e=>console.log);
            },
            getAdverseStatus(status){
                if(!status.trim){
                    return '停用'
                }
                if(status.trim() === '正常'){
                    return '停用';
                }
                return '启用';
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
            },
            //选择机构弹框
            chooseOrg(){
                this.showOrg = true;
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
                this.userForm.condition = {
                        orgId: "",
                        name: "",
                        mobile: "",
                        sex: "",
                        state: "",
                        createDateFrom: "",
                        createDateTo: "",
                        managerName: window._dataInfo.name,
                        managerId: window._dataInfo.id,
                }
                if (this.type !== 2) {
                    this.$refs.area && this.$refs.area.reSet()
                }
            },
            getLists(fn){
                if(this.time.length > 0){
                    this.userForm.condition.createDateFrom = this.time[0].getTime();
                    this.userForm.condition.createDateTo = this.time[1].getTime();
                }
                this.$http.post(`${MP}/manage/user/query`, this.userForm).then(res=>{
                    let data = res.data.data
                    console.log(data)
                    this.totleNum = data.count;
                    this.tableData = data.list;
                    this.tableData.forEach(v => {
                        v.stateShow = (~~v.state === 1? '失效' : '正常');
                        v.sexShow = (~~v.sex === 1 ? '男' : '女');
                        v.createTimeShow = new Date(v.createTime).toLocaleString();
                    });
                    if(fn) fn();
                }).catch(e=>console.log);
            },
            linkTo(index,tableData){
                this.$router.push({
                    path: '/integratedMana/operateElderly',
                    query: {
                        id: tableData[index].id
                    }
                })
            },
            edit(tableData){
                this.$router.push({
                    path: '/integratedMana/operateElderly',
                    query: {
                        id: tableData.id
                    }
                });
            },
            add(){
                this.$router.push({
                    path: '/integratedMana/operateElderly'
                });
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
            beforeAvatarUpload(file){
                if (this.type !== 1 && this.userForm.condition.orgId) {
                    alert('请先选择服务机构')
                    return false
                }
                if(!file.name.endsWith('xlsx')){
                    alert('只接受以 .xlsx 结尾的文件')
                    return false
                }
            },
            handleAvatarSuccess () {
                if(arguments[0].errCode !== 0 && arguments[0].errMessage){
                    alert(arguments[0].errMessage)
                }
                if(arguments[2].length >= 1) {
                    arguments[2].shift()
                }
            },
        },
        watch: {
            userForm: {
                deep: true,
                handler () {
                    let x = this.userForm.serviceArea
                    this.serviceAreaMap = {
                        provinceId: x.provinceId,
                        provinceName: x.provinceName,
                        cityId: x.cityId,
                        cityName: x.cityName,
                        areaId: x.zoneId,  // 改过了
                        areaName: x.zoneName,
                        streetId: x.streetId,
                        streetName: x.streetName
                    }
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
