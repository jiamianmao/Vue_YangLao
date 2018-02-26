<template>
    <div>
        <el-table :data="data" border style="width: 100%">
            <template v-for="ele in eles" v-if="ele.ifLink">
                <el-table-column prop="control" :label="ele.name" width="200">
                    <template slot-scope="scope">
                        <el-button
                                @click.native.prevent="routeTo(scope.$index,data)"
                                type="text"
                                size="small">
                            {{data[scope.$index][ele.value]}}
                        </el-button>
                    </template>
                </el-table-column>
            </template>
            <template v-else>
                <el-table-column
                        :prop="ele.value"
                        :label="ele.name"
                        width="200"
                        :key = "ele.value">
                </el-table-column>
            </template>
            <el-table-column prop="control" label="操作" width="300">
                <template slot-scope="scope">
                    <el-button
                            @click.native.prevent="editStatus(scope.$index,data)"
                            type="text"
                            size="small">
                        {{getAdverseStatus(data[scope.$index].status)}}
                    </el-button>
                    <el-button
                            @click.native.prevent="editOrg(scope.$index,data)"
                            type="text"
                            size="small"
                            v-if="data[scope.$index].status === '正常'">
                        修改
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row type="flex" justify="center">
            <el-pagination class="pager"
                    @current-change="handleCurrentChange"
                    :page-size="10"
                    layout="total, prev, pager, next"
                    :total="totalPage">
            </el-pagination>
        </el-row>
        </div>
</template>
<script>
    export default {
        name: 'lists',
        props: ['tableEles','totalPage','data','httpUrl','pageUrl','name'],
        data(){
            return{
                eles : this.tableEles,
                total: this.totalPage,
                currentUrl: this.url
            }
        },
        methods: {
            handleCurrentChange(val){
                this.$emit('pagination-click',val);
            },
            getAdverseStatus(status){
                //1-启用状态  2-停用状态
                if(!status) return false;
                if(!status.trim) return false;
                if(status.trim() === "正常"){
                    return "停用";
                }else if (status.trim() === "失效"){
                    return "启用";
                }
                return "";
            },
            editStatus(index,tableData){
                let status =  tableData[index].status === "正常" ? 2:1;
                let id = tableData[index].id;
                this.$http.get(this.httpUrl+'?status='+status + "&id=" + id).then(data=>{
                    tableData[index].status = status === 1 ? "正常" : "失效";
                    console.log(tableData[index]);
                    alert('修改成功');
                }).catch(e=>alert(e));
            },
            editOrg(index,tableData){
                this.$router.push({
                    path: this.pageUrl,
                    query:{
                        id : tableData[index].id
                    }
                });
                return (fn)=>{fn()}
            },
            routeTo(index,tableData){
                this.$router.push({
                    path: this.pageUrl,
                    query:{
                        id : tableData[index].id
                    }
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
    .pager{
        padding: 15px 0;
    }
</style>
