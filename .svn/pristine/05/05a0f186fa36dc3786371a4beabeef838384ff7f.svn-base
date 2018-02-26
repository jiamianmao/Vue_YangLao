<template>
    <div class="popUp">
        <el-dialog title="配置菜单权限" class="dialog"
                   :visible="true"
                   :show-close="false"
                   :lock-scroll="true"
                   :close-on-click-modal="false"
                   :modal="true">
            <div class="tranfer">
                <el-row>
                    <el-col :span="10">
                        <el-tree
                                :data="allFunc"
                                show-checkbox
                                default-expand-all
                                node-key="id"
                                :default-checked-keys="havedFuncs"
                                ref="tree"
                                :props="defaultProps"
                                @check-change="getNode">
                        </el-tree>
                    </el-col>
                </el-row>
            </div>
            <el-button @click="cliCancle">取 消</el-button>
            <el-button type="primary" @click="cliConfirm" v-if="!ifChange">确 定</el-button>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "rolefunc",
        props:["title","roleId","ownFuncs",'all'],
        data(){
            return{
                allFunc: [],
                chooseFunc:[],
                defaultProps:{
                    label: 'name',
                    children: 'children',
                },
                havedFuncs: this.ownFuncs
            }
        },
        components: {

        },
        created(){
            //获取所有菜单
            this.allFunc = this.makeTree( this.all || [] );
            Array.prototype.push.apply(this.chooseFunc,this.ownFuncs);
        },
        mounted(){
        },
        methods: {
            //通知父元素按下了确认
            cliConfirm(){
                this.$emit('pop-click',this.chooseFunc,this.roleId);
            },
            //通知父元素按下了取消
            cliCancle(){
                this.$emit('pop-click');
            },
            makeTree(arr){
                let sonMenus = [];
                let menus = [];
                let parents = arr.filter(function(v){
                    return v.pid === 0;
                });
                for(let i = 0 ; i < parents.length; i++){
                    sonMenus = arr.filter(function(v){
                        return v.pid === parents[i].id;
                    });
                    menus.push({
                        name: parents[i].name,
                        children: sonMenus
                    });
                }
                return menus;
            },
            getNode(){
                this.chooseFunc= [];
                let tempObj = this.$refs.tree.getCheckedNodes(true);
                tempObj.forEach(v=>this.chooseFunc.push(v.id));
                console.log(this.chooseFunc);
            },
        },
        computed:{
            ifChange: function(){
                return (this.havedFuncs.sort().toString() === this.chooseFunc.sort().toString());
            }
        }

    }
</script>


<style lang="scss">
    .popUp{
        .dialog{

        }
    }

</style>
