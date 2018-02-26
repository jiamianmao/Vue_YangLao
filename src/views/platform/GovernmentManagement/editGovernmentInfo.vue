<template>
    <div class="popUp">
        <el-dialog title="修改信息" class="dialog"
                   :visible="true"
                   :show-close="false"
                   :lock-scroll="true"
                   :close-on-click-modal="false"
                   :modal="true">
            <el-form :model="tempForm" :rules="rules">
                <el-form-item label="行政区域" :label-width="formLabelWidth" prop="createrId">
                    <el-input v-model="tempForm.areaShow" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="账号类型" :label-width="formLabelWidth" prop="createrId">
                    <el-input v-model="tempForm.category" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="用户账号" :label-width="formLabelWidth" prop="createrId">
                    <el-input v-model="tempForm.username" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="tempForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="账号状态" :label-width="formLabelWidth" prop="status">
                    <el-radio-group v-model="tempForm.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="2">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cliCancle">取 消</el-button>
                <el-button type="primary" @click="cliConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "editGovermentInfo",
        props:["userInfo"],
        data(){
            return{
                form: {
                    id: "",
                    name: "",
                    status:"1",
                },
                tempForm: this.userInfo,
                rules:{
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    status:[
                        { required: true, message: '请选择状态', trigger: 'blur' }
                    ]
                },
                formLabelWidth: '120px',
            }
        },
        created(){
        },
        components: {

        },
        methods: {
            //通知父元素按下了确认
            cliConfirm(){
                for(let k in this.form){
                    this.form[k] = this.tempForm[k];
                }

                if(!this.form.name){
                    alert('请填入用户名称');
                }

                this.$emit('pop-click',this.form,this);
            },
            //通知父元素按下了取消
            cliCancle(){
                this.$emit('pop-click');
            }
        }
    }
</script>


<style lang="scss">
    .popUp{
        .dialog{
            /*position: absolute;*/
            /*top: 300px;*/
            /*left: 30%;*/
        }
    }

</style>
