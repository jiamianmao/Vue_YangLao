<template>
    <div class="popUp">
        <el-dialog title="选择服务机构" class="dialog"
                   :visible="true"
                   :show-close="false"
                   :lock-scroll="true"
                   :close-on-click-modal="false"
                   :modal="true">
                <el-table :data="orgs" border style="width: 42%">
                    <el-table-column
                            prop="name"
                            label="机构名称"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            label="选择">
                        <template slot-scope="scope">
                            <input type="radio" name="chose" @click="choose(scope.$index,orgs)">
                        </template>
                    </el-table-column>
                </el-table>
            <el-pagination
                    layout="prev, pager, next"
                    :total="totalPage"
                    @current-change="handleCurrentChange">
            </el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cliCancle">取 消</el-button>
                <el-button type="primary" @click="cliConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { UMS } from '@/common/config'
    export default {
        name: "orgChoose",
        props:['areaData'],
        data(){
            return{
                orgs:[],
                org:{
                    id: "",
                    name: ""
                },
                orgId: "",
                totalPage: 0,
                searchData: {
                    provinceId: "",
                    cityId: "",
                    areaId: "",
                    streetId: "",
                    pageNum: 1
                },
            }
        },
        created(){
            for(let k in this.areaData){
                if (this.areaData[k]) {
                    this.searchData[k] = this.areaData[k];
                } else {
                    this.searchData[k] = undefined
                }
            }
            this.searchData.pageNum = 1;
            this.getOrgs(1);
        },
        methods: {
            //通知父元素按下了确认
            cliConfirm(){
                this.$emit('pop-click',this.org);
            },
            //通知父元素按下了取消
            cliCancle(){
                this.$emit('pop-click');
            },
            //获取分页信息
            getOrgs(num){
                this.searchData.pageNum = num;
                this.$http.post(`${UMS}/orgStreet/getOrgByParam.do`,this.searchData).then(res=>{
                    let data = res.data.data
                    this.orgs = data.list;
                    this.totalPage = data.totalNum;
                }).catch(e=>console.log);
            },
            handleCurrentChange(val){
                this.getOrgs(val);
            },
            choose(index,orgs){
                this.org = orgs[index];
            }
        }
    }
</script>


<style lang="scss">


</style>
