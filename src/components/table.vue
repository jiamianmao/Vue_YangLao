<template>
    <div>
        <el-table :data="data" border style="width: 100%">
            <template v-for="ele in eles" v-if="!ele.ifControl">
                <template v-if="ele.eventName">
                    <el-table-column prop="control" :label="ele.name" width="200">
                        <template slot-scope="scope">
                            <el-button
                                    @click.native.prevent="eventCb(scope.$index,data,ele.eventName)"
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
                            width="180">
                    </el-table-column>
                </template>
            </template>
            <template v-else>
                <el-table-column prop="control" label="操作">
                    <template slot-scope="scope">
                        <el-button
                                @click.native.prevent="control(scope.$index,data,ele.name)"
                                type="text"
                                size="small">
                            {{ele.name}}
                        </el-button>
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <div class="block">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :page-size="10"
                    layout="total, prev, pager, next"
                    :total="totalPage">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'tables',
        props: ['tableEles','totalPage','data'],
        data(){
            return{
                eles : this.tableEles,
            }
        },
        created(){
//          console.log(this.eles);
//          console.log(this.tableEles);
        },
        methods: {
            handleCurrentChange(val){
                this.$emit('pagination-click',val);
            },
            control(index,tableData,name){
                this.$emit('control-click',tableData[index],name,this);
            },
            eventCb(index,tableData,event){
                this.$emit(event,tableData[index]);
            }
        }
    }
</script>
<style lang="scss">

</style>
