<template>
    <pageContainer title='商品详情' show-back-btn class="roleAuthority">
        <!--<h5>
            商品详情
            <el-button type="primary" size="small" @click="goBack">返回</el-button>
        </h5>-->
        <div class="authority clearfix">
            <h4>
                商品基本信息
                <el-button type="primary" size="small" @click="editPr" v-if="type === 1">修改</el-button>
            </h4>
            <div class="roleInfo fl">
                <ul>
                    <li>商品编号：{{id}}</li>
                    <li>服务大类：{{allInfo.catePname}}</li>
                    <li>服务品类：{{allInfo.cateName}}</li>
                    <li>单次服务时长：{{allInfo.serviceDuration}}分钟</li>
                    <li>价格：{{allInfo.price}}元</li>
                    <li>是否上架：{{allInfo.isOnShelves === 1?'是':'否'}}</li>
                </ul>
            </div>
            <div class="createrInfo fl">
                <ul>
                    <li>服务机构：{{org.orgName}}</li>
                    <li v-for="item in serviceArea" :key="item.id">服务区域：{{item.provinceName + item.cityName + item.zoneName +item.streetName}}</li>
                    <li>创建时间：{{time(allInfo.createTime, 'YYYY-MM-DD HH:mm:SS')}}</li>
                </ul>
            </div>
        </div>
        <div class="userEdit">
            <div class="title clearfix">
                <h4 class="fl">操作记录</h4>
            </div>
            <el-table
                    class= "table"
                    :data= "operationRecord"
                    border>
                <el-table-column
                        prop="showTime"
                        label="操作时间"
                        align="center">
                </el-table-column>
                <el-table-column
                        prop="createUserName"
                        label="操作人"
                        align="center">
                </el-table-column>
            </el-table>
        </div>
        <controlPr v-if="showDialog"
                   :cateList = 'cateList'
                   :info = 'info'
                   title = '修改商品'
                   :flag="true"
                   :id = 'id'
                   @pop-click="dialogClick">
        </controlPr>
    </pageContainer>
</template>


<script>
    import PageContainer from '@/components/PageContainer.vue'; 
    import controlPr from './editPro.vue';
    import { format } from 'date-fns';
    import { MP } from '@/common/config'

    export default {
        data(){
            return{
                showDialog: false,
                type: window._dataInfo.type,
                serviceArea: [],
                operationRecord: [],
                allInfo:{},
                org: {},
                id: '',
                cateList: [],
                info: {
                    catePid: '',
                    catePname: '',
                    cateId: '',
                    cateName: '',
                    serviceDuration: '',
                    price: '',
                    isOnShelves: '',
                    orgId: '',
                    orgName: ''
                },
                time: format
            }
        },
        components: {
            controlPr,
            PageContainer
        },
        created(){
            this.id = this.$route.query.id;
            this.getData();
            this.getCate();
        },
        methods:{
            goBack(){
                this.$router.push({path: "/integratedMana/product"});
            },

            editPr(){
                this.showDialog = true;
                console.log(this.info);
            },

            dialogClick(...arr){
                if(arr.length > 0){
                    arr[0].orgId =   window._dataInfo.orgId;
                    arr[0].orgName = window._dataInfo.orgName;
         
                    this.$http.post(`${MP}/manage/product/update`, arr[0]).then(data => {
                        this.getData();
                        alert('修改成功');
                    }).catch(e=>alert(e));
                }
                //关闭弹出框
                this.showDialog=false;
            },
            getData(){
                this.$http.get(`${MP}/manage/product/detail?id=` + this.id).then(res => {
                    let data = res.data.data
                    this.org = data.org;
                    this.serviceArea = this.org.serviceArea;
                    this.operationRecord = data.operationRecord;
                    this.operationRecord.forEach(v=> v.showTime=format(v.createTime, 'YYYY-MM-DD HH:mm:SS') );
                    console.log(this.operationRecord);
                    this.allInfo = data;
                    for(let k in this.info) this.info[k] = this.allInfo[k];
                    //
                    this.allInfo.forEach(v=>v.createTime = new Date(v.createTime).toLocaleString());
                    this.info.orgId = window._dataInfo.orgId;
                    this.info.orgName = window._dataInfo.orgName;
                    console.log(this.info);
                }).catch(e=>console.log);
            },
            getCate(){
                this.$http.get(`${MP}/manage/category/query`).then(res => {
                    let data = res.data.data
                    this.cateList = data.list;
                }).catch(e=>alert(e));
            },
        }
    }
</script>


<style lang="scss">
    .roleAuthority{
        width: 1060px;
        h5{
            width: 100%;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            border: 1px solid #ccc;
            font-size: 20px;
            height: 40px;
            padding-top: 5px;
            /*line-height: 30px;*/
            background-color: #f7f7f7;
            .el-button--small{
                margin-left: 20px;
            }
        }
        .authority{
            h4{
                font-size: 20px;
                height: 30px;
                line-height: 30px;
                padding-left: 20px;
                .el-button--small{
                    margin-left: 20px;
                }
            }
            width: 100%;
            padding: 15px 0;
            border: 1px solid #ccc;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            ul{
                padding: 20px;
                font-size: 20px;
                li{
                    padding: 0 5px;
                    height: 50px;
                    line-height: 50px;
                }
            }
            .roleInfo{
                width: 50%;
                ul{
                    border-right: 1px solid #000;
                }
            }
            .createrInfo{
                ul{
                    padding-top: 25%;
                }
            }
        }
        .userEdit{
            margin-top: 25px;
            box-sizing: border-box;
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            .title{
                margin-bottom: 20px;
                h4{
                    font-size: 20px;
                    height: 28px;
                    line-height:28px;
                    margin-right: 20px;
                }

            }
            .table{
                margin: 0 auto;
            }
        }

        .record{
            margin-top: 25px;
            box-sizing: border-box;
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            h4{
                font-size: 20px;
                height: 28px;
                line-height:28px;
                margin-right: 20px;
            }
        }
    }
</style>
