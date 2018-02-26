<template>
    <div class="popUp">
        <el-dialog title="配置角色" class="dialog"
                   :visible="true"
                   :show-close="false"
                   :lock-scroll="true"
                   :close-on-click-modal="false"
                   :modal="true">
            <el-row type="flex" justify="center">
                <el-transfer v-model="myFuncs"
                             :data="sysFuncs"
                             :titles="['未添加角色', '已添加角色']"
                             :button-texts="['删除', '添加']"
                             :props="{
                             key: 'id',
                             label: 'name'
                         }"></el-transfer>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cliCancle">取 消</el-button>
                <el-button type="primary" @click="cliConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "editRole",
        props:["ownFuncs","allFuncs"],
        data(){
            return{
                formLabelWidth: '120px',
                sysFuncs: this.allFuncs,
                myFuncs: []
            }
        },
        components: {

        },
        created(){
            this.myFuncs = [];
            this.ownFuncs.forEach(v=>this.myFuncs.push(v.id));
        },
        methods: {
            //通知父元素按下了确认
            cliConfirm(){
                let arr = [];
                this.$emit('pop-click',this.myFuncs);
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
