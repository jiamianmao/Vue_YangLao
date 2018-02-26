<template>
    <div>
        <el-select v-model="cateP" filterable placeholder="请选择" :disabled="displayed" @change="selected">
            <el-option
                    v-for="item in data"
                    :key="item.value"
                    :label="item.cateName"
                    :value="item.catePid">
            </el-option>
        </el-select>
        <el-checkbox-group v-model="checkList" @change="checked">
            <el-checkbox v-for="item in cates" :key="item.id" :label="item.id">{{item.cateName}}</el-checkbox>
        </el-checkbox-group>
    </div>
</template>
<script>

    export default {
        name: "checkGroup",
        props: ['data','ifNew','num','displayed'],
        data(){
            return{
                cates: [],
                checkList: [],
                cateP: "",
                productList : []
            }
        },
        components: {

        },
        created(){
            console.log(this.data);
        },
        methods: {
            sendData(obj){
                this.$emit("checked",obj,this.num);
            },
            checked(value){
                //每次传入的值，都是本次选中的值
                this.productList = [];
                let time = 0;
                let price = 0;
                let catePObj = this.data.filter(v=>v.catePid === this.cateP)[0];

                for(let i = 0 ; i < value.length ; i++){
                    let item = this.cates.filter(v=> v.id === value[i])[0];
                    if(item){
                        this.productList.push(item);
                        //计算
                        time += item.serviceDuration;
                        price += item.price;
                        //duration
                        item.duration = item.serviceDuration;
                        item.catePid = catePObj.catePid;
                        item.catePname = catePObj.catePname;
                    }
                }
                this.sendData({
                    price: price,
                    time: time,
                    productList: this.productList
                });
            },
            selected(){
                //删除被选中的商品,重新开始
                this.productList = [];
                this.checkList = [];
                this.$emit('group-selected',this.cateP,this.num);
            }
        },
        watch:{
            'cateP' : function(){
                this.cates = this.data.filter(v=>v.catePid === this.cateP)[0].product;
            },
            'checkList': function(){
                this.productList = [];
                let time = 0;
                let price = 0;
                let catePObj = this.data.filter(v=>v.catePid === this.cateP)[0];
                let value = this.checkList;


                for(let i = 0 ; i < value.length ; i++){
                    let item = this.cates.filter(v=> v.id === value[i])[0];
                    if(item){
                        this.productList.push(item);
                        //计算
                        time += item.serviceDuration;
                        price += item.price;
                        //duration
                        item.duration = item.serviceDuration;
                        item.catePid = catePObj.catePid;
                        item.catePname = catePObj.catePname;
                    }
                }

                console.log(this.productList);
                console.log(this.checkList);


                this.sendData({
                    price: price,
                    time: time,
                    productList: this.productList
                });
            }
        }
    }
</script>
<style lang="scss">

</style>
