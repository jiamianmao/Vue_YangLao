<template>
    <el-dialog :title ="dialogTitle"
               :visible="true"
               :show-close="false"
               :lock-scroll="true"
               :close-on-click-modal="false"
               :modal="true">
        <el-form :model="userForm" label-width="120px" label-position='left'>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="服务大类">
                        <el-select v-model="userForm.catePid" placeholder="请选择服务大类" :disabled="flag">
                            <el-option label="无" value=""></el-option>
                            <el-option v-for= "cate in cateList"
                                       :label="cate.cateName"
                                       :value="cate.catePid"
                                       :key="cate.catePid">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="服务小类">
                        <el-select v-model="userForm.cateId" placeholder="请选择服务小类" :disabled="flag">
                            <el-option label="无" value=""></el-option>
                            <el-option v-for="item in cates"
                                       :label="item.cateName"
                                       :value="item.cateId"
                                       :key="item.cateId"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="品类单价">
                        <el-input v-model="userForm.price"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="单次时间（单位分钟）">
                        <el-input v-model.number="userForm.serviceDuration" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-button
                            class="button" type="primary"
                            @click="addMin">
                        +
                    </el-button>
                    <el-button
                            class="button" type="primary"
                            @click="reduceMin"
                            v-if=" userForm.serviceDuration > 15 ">
                        -
                    </el-button>
                </el-col>
            </el-row>
            <el-form-item label="是否上架">
                <el-radio-group v-model="userForm.isOnShelves">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cliCancle">取 消</el-button>
            <el-button type="primary" @click="cliConfirm">保存</el-button>
        </div>
    </el-dialog>
</template>
<script>
    export default {
        name: 'controlPr',
        props: ['info','flag','dialogTitle','cateList','id'],
        data(){
            return{
                userForm: {
                    orgId: window._dataInfo.orgId,
                    orgName: window._dataInfo.orgName,
                    catePid: '',
                    catePname: '',
                    cateId: '',
                    cateName: '',
                    price: '',
                    serviceDuration: 15,
                    isOnShelves: 1,
                    id: ''
                },
                cates: [],
            }
        },
        created(){
            if(this.flag){
                this.userForm = this.info;
                this.userForm.serviceDuration = this.info.serviceDuration || 15;
            }
        },
        methods: {
            //通知父元素按下了确认
            cliConfirm(){
                let cate =this.cates.filter(v=>v.cateId === this.userForm.cateId)[0];
                if(cate && cate.cateName) this.userForm.cateName = cate.cateName;
                if(this.id) this.userForm.id = this.id;
                if(!this.userForm.catePid){
                    alert('请选择大品类');
                    return false;
                }
                if(!this.userForm.cateId){
                    alert('请选择小品类');
                    return false;
                }
                if(!this.userForm.price){
                    alert('请填入品类单价');
                    return false;
                }

                if (!/^\d{1,7}(\.\d{1,2})?$/.test(this.userForm.price)) {
                    alert('品类单价为数字总位数不超过7位，小数位数不超过2位的数字');
                    return false;
                }


                this.$emit('pop-click',this.userForm,this.flag);
            },
            //通知父元素按下了取消
            cliCancle(){
                this.$emit('pop-click');
            },
            addMin(){
                let serD = parseInt(this.userForm.serviceDuration);
                console.log(serD);
                serD += 15;
                this.userForm.serviceDuration = serD;
            },
            reduceMin(){
                this.userForm.serviceDuration -= 15;
                if(this.userForm.serviceDuration < 15){
                    this.userForm.serviceDuration = 15;
                }
            }
        },
        watch:{
            'userForm.catePid': function(){
                console.log('here');
                let _this = this;
                let arr = this.cateList.filter(v=>v.catePid == _this.userForm.catePid);

                if(arr.length > 0){
                    this.cates =  arr[0].cate;
                    //获取父类名称
                    console.log(arr[0]);
                    this.userForm.catePname = arr[0].cateName;
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .el-form-item__label::before{
        content: '*';
        color: #ff4949;
        margin-right: 4px;
        margin-left: 10px;
    }
</style>
