<template>
    <page-container title="品类目录" class= "category">
        <div class="contain">
            <el-button @click="newCategory"
                    type="primary"
                    size="small"
                    class="new-role">
                添加品类
            </el-button>
            <div class="list">
                <el-tree class='tree' :data="data"
                         :props="defaultProps"
                         :expand-on-click-node="false"
                         :render-content="renderContent">

                </el-tree>
            </div>
        </div>
        <el-dialog :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="formData" :rules="rules">
                <el-form-item label="品类名称"  label-width="100px"  prop="cateName">
                    <el-input v-model="formData.cateName" :disabled="ifDelete"></el-input>
                </el-form-item>
                <el-form-item label="大品类" label-width="100px">
                    <el-select v-model="formData.catePid" :disabled="ifDelete">
                        <el-option label="无" value="0"></el-option>
                        <el-option v-for="item in data"
                                :key="item.id"
                                :label="item.cateName"
                                :value="item.catePid">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </page-container>
</template>
<script>
    import PageContainer from '@/components/PageContainer.vue';
    import { MP } from '@/common/config'
    export default {
        data() {
            return {
                data:[],
                defaultProps: {
                    children: 'cate',
                    label: 'cateName'
                },
                dialogFormVisible: false,
                formData: {
                    cateId: "",
                    cateName: "",
                    catePid: ""
                },
                formLabelWidth: '120px',
                title: "",
                type: '',
                id: '',
                controlType: 0,  //0 增加  1 更改 2 删除
                ifDelete: false,
                rules:{
                    cateName: { type: 'string',length: 25, required: true, message: '请输入品类名称', trigger: 'blur' }
                }
            };
        },
        created(){
            this.getData();
        },
        components:{
            PageContainer
        },
        methods: {
            newCategory(){
                this.ifDelete = false;
                this.controlType = 1;
                this.title = "添加分类";
                this.dialogFormVisible = true;
                this.formData = {
                    cateId: "",
                    cateName: "",
                    catePid: ""
                };
            },
            edit(store, data) {
                this.dialogFormVisible = true;
                this.controlType = 0;
                //存在则表示更改父类
                if(data.cate){
                    this.formData.catePid = '0';
                    this.formData.cateName = data.cateName;
                    this.formData.cateId = data.catePid;
                }else{
                 //否则修改的是子类
                    this.formData.catePid = data.catePid;
                    this.formData.cateName = data.cateName;
                    this.formData.cateId = data.cateId;
                }
                this.title = "修改分类";
            },

            remove(store, data) {
                this.dialogFormVisible = true;
                this.controlType = 2;
                this.ifDelete = true;
                this.title = "删除分类";
                if(data.cateId){
                    //子
                    this.formData.catePid = data.catePid;
                    this.formData.cateName = data.cateName;
                    this.formData.cateId = data.cateId;
                    this.type = 2;
                    this.id = data.cateId;
                }else{
                    //父
                    this.formData.catePid = '0';
                    this.formData.cateName = data.cateName;
                    this.formData.cateId = data.catePid;
                    this.type = 1;
                    this.id = data.catePid;
                }
            },
            renderContent(h, { node, data, store }) {
                return (
                <div style='width: 100%;display: flex; justify-content: space-between; padding-right: 20px;'>
                    <span>
                        <span>{node.label}</span>
                    </span>
                    <span>
                        <el-button size="mini" on-click={ () => this.edit(store, data) }>修改</el-button>
                        <el-button size="mini" on-click={ () => this.remove(store, data) }>删除</el-button>
                    </span>
                </div>
                );
            },
            submit(){
                let form = this.formData;
                switch(this.controlType){
                    case 0:
                        if(form.cateName === ''){
                            alert('请输入品类名称');
                            this.ifDelete = false;
                            this.dialogFormVisible = false;
                            return false;
                        }
                        this.$http.get(`${MP}/manage/category/update?cateName=` + form.cateName
                            +"&catePid="+form.catePid
                            +"&cateId="+form.cateId).then(data=>{
                            this.getData();
                        }).catch(e=>alert(e));
                        break;
                    case 1:
                        if(form.cateName === ''){
                            alert('请输入品类名称');
                            this.ifDelete = false;
                            this.dialogFormVisible = false;
                            return false;
                        }
                        this.$http.get(`${MP}/manage/category/add?cateName=` + form.cateName
                            +"&catePid="+form.catePid).then(data=>{
                            this.getData();
                        }).catch(e=>alert(e));
                        break;
                    case 2:
                        if(this.type === 1){
                            let tempObj = this.data.find(v=> v.catePid === this.id);
                            console.log(tempObj);
                            if(tempObj){
                                let cate = tempObj.cate;
                                if(cate && cate.length && cate.length > 0){
                                    alert('无法删除带有小品类的大品类');
                                    this.ifDelete = false;
                                    this.dialogFormVisible = false;
                                    return false;
                                }
                            }else{
                                alert('网络异常，请刷新从新操作');
                                this.ifDelete = false;
                                this.dialogFormVisible = false;
                                return false;
                            }
                        }
                        this.$http.get(`${MP}/manage/category/delete?id=` + this.id+"&type="+this.type).then(data=>{
                            this.getData();
                        }).catch(e=>alert(e));
                        break;
                }
                this.ifDelete = false;
                this.dialogFormVisible = false;
            },
            getData(){
                this.$http.get(`${MP}/manage/category/query`).then(res => {
                    let data = res.data.data
                    this.data = data.list;
                    //获取品类数组
                    for(let i = 0 ; i < this.data.length; i++){
                        if(this.data[i].cate && this.data[i].cate.length && this.data[i].cate.length > 0){
                            let tempData = this.data[i].cate;
                            for(let j = 0; j < tempData.length ; j++){
                                tempData[j].catePid = this.data[i].catePid;
                            }
                        }
                    }
                }).catch(e=>alert(e));
            }
        }
    };
</script>
<style lang="scss">
    .category{
       .new-role{
           margin-left: 10px;
       }
       .tree{
           margin-top: 10px;
           border: 1px solid #d1dbe5;
           .el-tree-node{
               margin: 10px 0;
               line-height: 28px;
           }
       }
    }

</style>
