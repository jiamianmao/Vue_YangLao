<template>
    <div class="popUp">
            <el-dialog :title="title" class="dialog"
                       :visible="true"
                       :show-close="false"
                       :lock-scroll="true"
                       :close-on-click-modal="false"
                       :modal="true">
                <el-form :model="curform" :rules="rules" v-if="show">
                    <el-radio-group v-model="curform.num">
                        <el-radio v-for='(item,index) in cancelReasonList' :key="item.id" :label="item.id">{{item.text}}</el-radio>
                    </el-radio-group>
                    <el-form-item label="" :label-width="formLabelWidth" v-if = '(curform.num == 4)'>
                        <el-input type="textarea" v-model="curform.desc"></el-input>
                    </el-form-item>
                </el-form>
                <el-form :model="visitform" :rules="rules" v-else>
                    <el-form-item label="服务满意度" :label-width="formLabelWidth" prop="scope">
                        <el-rate v-model="visitform.scope"></el-rate>
                    </el-form-item>
                    <el-form-item label="回访记录" style='display: none;' :label-width="formLabelWidth" prop="desc">
                        <el-input type="textarea" v-model="visitform.desc"></el-input>
                    </el-form-item>
                </el-form>
                <el-button @click="cliCancle">取 消</el-button>
                <el-button type="primary" @click="cliConfirm">确 定</el-button>
            </el-dialog>
    </div>
</template>

<script>
    import { MP } from '@/common/config'
    export default {
        name: "popup",
        props: ['show'],
        data(){
            return{
                rules:{
                    name: [
                        { required: true, message: '请输入菜单名称', trigger: 'blur'},
                    ],
                    mask: [
                        { required: true, message: '请输入菜单掩码', trigger: 'blur' },
                    ]
                },
                curform:{
                    num: '',
                    desc: '',
                },
                visitform: {
                    scope: 5,
                    desc: ''
                },
                formLabelWidth: '120px',
                cancelReasonList: [],
            }
        },
        created(){
            if( this.show ){
                this.title='请选择取消原因';
                //获取取消字典
                this.getCancelReasonList();
            }else{
                this.title='添加回访记录';
            }
        },
        methods: {
            //通知父元素按下了确认
            cliConfirm(){
                let temobj = {};
                if(this.show){
                    temobj = this.curform;
                }else{
                    temobj = this.visitform
                }
                this.$emit('pop-click',temobj,this.show);
            },
            //通知父元素按下了取消
            cliCancle(){
                this.$emit('pop-click');
            },
            getCancelReasonList(){
                this.$http.get(`${MP}/order/cancelReasonDict`).then(res => {
                    let data = res.data.data
                    this.cancelReasonList = data.cancelReason;
                }).catch(e=>alert(e));
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
