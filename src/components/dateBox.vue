<template>
    <div class="date-box">
        <el-form-item label="请选择服务时间">
            <el-radio-group v-model="checked" size="big" :max="1" @change="selectDate">
                    <el-radio-button
                                     v-for="data in dateList"
                                     :label="data.date"
                                     :key="data.date"
                                     :disabled="data.isFull === 1">
                        {{data.weekInfo +"(" + data.dateStr+")"}}
                    </el-radio-button>
            </el-radio-group>
        </el-form-item>
    </div>
</template>
<script>
    export default {
        name: 'dateBox',
        props: ['dateList'],
        data(){
            return{
                checked: "",
            }
        },
        created(){

        },
    methods: {
            selectDate(){
                this.$emit('date-select',this.checked);
            }
        },
        watch: {

        }

    }
</script>
<style lang="scss">
.date-box{
    background-color: #efefef;
}
</style>
