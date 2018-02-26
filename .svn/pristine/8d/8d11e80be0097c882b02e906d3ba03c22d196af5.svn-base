<template>
    <div class="popUp">
        <el-dialog title="充值" class="dialog"
                   :visible="true"
                   :show-close="false"
                   :lock-scroll="true"
                   :close-on-click-modal="false"
                   :modal="true">
            <el-form :model="data" :rules="rules" :label-position="position" ref="form">
                <el-row>
                    <el-form-item label="操作类型" prop="type">
                        <el-radio-group v-model.number="data.type">
                            <el-radio :label="1">增加金额</el-radio>
                            <el-radio :label="2">减少金额</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="ele.bankLabel" :label-width="formLabelWidth" prop="amount">
                            <el-input type="text" v-model="data.amount"></el-input>
                        </el-form-item>
                        <span>{{ele.des}}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="ele.reasonLabel" :label-width="formLabelWidth" prop="remark">
                            <el-input type="textarea" v-model="data.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="补助时间（开始-结束）" :label-width="formLabelWidth">
                            <el-date-picker
                                    v-model="time"
                                    type="datetimerange"
                                    placeholder="选择时间范围">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-button type="primary" @click="cliConfirm">确定</el-button>
                    <el-button type="primary" @click="cliCancle">取消</el-button>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: "popup",
        props: ['userId'],
        data(){
            const validate = async (rule, value, cb) => {
                if (value > 0) {
                    cb();
                } else {
                    cb(new Error('请输入大于零的数字'));
                }
            };
            return{
                rules:{
                    type: [
                        { required: true, type:'number' ,message: '请选择操作类型', trigger: 'blur'},
                    ],
                    amount: [
                        { required: true, message: '请输入金额，金额需大于零，只包含两位小数', trigger: 'blur' },
                        { validator: validate,trigger: 'blur' }
                    ],
                    remark: [
                        { required: true, message: '请输入充值原因', trigger: 'blur' },
                    ]
                },
                ele: {
                    bankLabel: '充值金额',
                    reasonLabel: '充值原因',
                    opt: '+',
                    des: '金额必须是大于0的数字，小数点最多两位'
                },
                data: {
                    userId: this.userId,
                    createrId: window._dataInfo.id,
                    createrName: window._dataInfo.name,
                    amount: '',
                    remark: '',
                    type: 1,
                    start: '',
                    end: ''
                },
                formLabelWidth: '120px',
                position: 'left',
                time: [],

            }
        },
        methods: {
            //通知父元素按下了确认
            cliConfirm(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        if(this.time.length > 1){
                            this.data.start = new Date(this.time[0]).getTime();
                            this.data.end = new Date(this.time[1]).getTime();
                        }
                        this.$emit('pop-click',this.data);
                    }
                });
            },
            //通知父元素按下了取消
            cliCancle(){
                this.$emit('pop-click');
            },
        },
        watch:{
            'data.type' : function(){
                if(1 === this.data.type)
                    this.ele = {
                        bankLabel: '充值金额',
                        reasonLabel: '充值原因',
                        opt: '+',
                        des: '金额必须是大于0的数字，小数点最多两位'
                    };
                else
                    this.ele = {
                        bankLabel: '减少金额',
                        reasonLabel: '减少原因',
                        opt: '-',
                        des: '金额必须是大于0的数字，小数点最多两位'
                    }
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
