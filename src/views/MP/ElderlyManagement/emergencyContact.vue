<template>
    <el-row :gutter="20">
        <el-col :span="5">
            <el-form-item>
                <el-input v-model="infoData.name"
                          :disabled="ifEdit"
                          @change="inputChange"
                          placeholder="紧急联系人姓名"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="5">
            <el-form-item>
                <el-input v-model="infoData.relation"
                          :disabled="ifEdit"
                          @change="inputChange"
                          placeholder="与老人关系"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="5">
            <el-form-item>
                <el-input v-model="infoData.mobile"
                          :disabled="ifEdit"
                          @change="inputChange"
                          placeholder="手机号"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="5">
            <el-form-item>
                <el-input v-model="infoData.phone"
                          :disabled="ifEdit"
                          @change="inputChange"
                          placeholder="座机"></el-input>
            </el-form-item>
        </el-col>
    </el-row>
</template>
<script>
    export default {
        name: 'eInfo',
        props: ['curNum','ifEdit','info',"check"],
        data(){
            return{
                infoData: {
                    "mobile":"",
                    "name":"",
                    "phone":"",
                    "relation":""
                },
            }
        },
        created(){

        },
        mounted(){
            if(this.info){
                this.infoData = this.info;
            }
        },
        methods: {
            inputChange(){
                this.$emit('value-change',this.infoData,this.curNum);
            }
        },
        watch: {
            'info' :function(){
                this.infoData = this.info;
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

