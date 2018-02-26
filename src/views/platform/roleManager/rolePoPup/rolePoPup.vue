<template>
    <div class="popUp">
            <el-dialog :title="this.title" class="dialog"
                       :visible="true"
                       :show-close="false"
                       :lock-scroll="true"
                       :close-on-click-modal="false"
                       :modal="true">
                <el-form v-model="form" :rules="rule">
                    <el-row>
                        <el-col :span="13">
                            <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name" class="must">
                                <el-input v-model.string="form.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="角色状态" :label-width="formLabelWidth" prop="status">
                                <el-select v-model.string="form.status" placeholder="请选择">
                                    <el-option
                                            v-for="(item,index) in ['正常','失效']"
                                            :key="index"
                                            :label="item"
                                            :value="index+1">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="角色类型" :label-width="formLabelWidth" prop="type">
                                <el-select v-model.string="form.type" placeholder="请选择">
                                    <el-option
                                            v-for="(item,index) in ['平台','机构','政府']"
                                            :key="index"
                                            :label="item"
                                            :value="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-row>
                        <el-col :span="7">
                            <el-button type="primary" @click="cliConfirm">确 定</el-button>
                            <el-button @click="cliCancle">取 消</el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "rolePoPup",
        props:["title","roleInfo"],
        created(){
            if(this.roleInfo !== ""){
                this.form = this.roleInfo;
            }
            console.log('here');
        },
        data(){
            return{
                form: {
                    id: "",
                    name: "",
                    status: "",
                    type: "",
                    typeShow: '',
                },
                rule:{
                    status: { required: true, message: '请选择状态', trigger: 'blur' },
                    type: { required: true, message: '请选择类型', trigger: 'blur' },
                },
                formLabelWidth: '120px',
            }
        },
        components: {

        },
        methods: {
            //通知父元素按下了确认
            cliConfirm(){
                this.$emit('pop-click',this.form,this);
            },
            //通知父元素按下了取消
            cliCancle(){
                this.$emit('pop-click');
            }
        }
    }
</script>
<style lang="scss" scoped>

</style>

