<template>
    <div class="popUp">
            <el-dialog title="添加菜单" class="dialog"
                       :visible="isShow"
                       :show-close="hasclose"
                       :lock-scroll="true"
                       :close-on-click-modal="false"
                       :modal="true">
                <el-form :model="curform" :rules="rules">
                    <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="curform.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单掩码" :label-width="formLabelWidth" prop="mask">
                        <el-input v-model="curform.mask" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="权限对应值" :label-width="formLabelWidth" prop="value">
                        <el-input v-model="curform.value" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="所属系统" :label-width="formLabelWidth" prop="pid">
                        <el-select v-model="curform.pid" placeholder="请选择">
                            <el-option  label="无" value="0"></el-option>
                            <el-option  v-for="item in options"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                            </el-option>
                        </el-select>
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
    import { UMS } from '@/common/config'
    export default {
        name: "popup",
        props: ['form'],
        data(){
            return{
                curform: {
                    name: '',
                    mask: '',
                    value: '',
                    pid: '0'
                },
                rules:{
                    name: [
                        { required: true, message: '请输入菜单名称', trigger: 'blur'},
                    ],
                    mask: [
                        { required: true, message: '请输入菜单掩码', trigger: 'blur' },
                    ],
                    value: [
                        { required: true, message: '请输入菜单对应值', trigger: 'blur' },
                    ],
                    pid: [
                        { required: true, message: '请输入菜单对应值', trigger: 'blur' },
                    ]
                },
                options: [],
                formLabelWidth: '120px',
                isShow: true,
                hasclose: false,
                isMode: false
            }
        },
        created(){
            if(this.options.length === 0){
                this.getAllSys();
            }
            if(this.form !== ""){
                this.curform = this.form;
            }
        },
        methods: {
            //通知父元素按下了确认
            cliConfirm(){
                let pid = this.curform.pid
                if (pid === '0') {
                    alert('请选择所属系统')
                    return
                }
                // this.curform.pid = pid === '0' ? '' : pid
                this.$emit('pop-click',this.curform,this);
            },
            //通知父元素按下了取消
            cliCancle(){
                this.$emit('pop-click');
            },
            getSys(){
              this.curform.sysName = this.form.funcId;
            },
            getAllSys(){
                this.$http.get(`${UMS}/func/getOneLevelFunc.do`).then(res=>{
                    this.options = res.data.data.funcs;
                }).catch(e=>console.log);
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
