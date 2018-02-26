<template>
    <div>
        <ul v-myclick="clickNum"
                :data-need="needNum"
                class="clearfix">

            <li v-for="n in 24" v-bind:num="n"
                :class="{'used' : disabledTime.indexOf(n+16) !== -1 }"
                @click="chose(n-1)"
            >{{showTime[n-1]}}</li>
        </ul>
    </div>
</template>
<script>

    export default {
        name: 'timeBox',
        props: ['useTime','costTime','curTime'],
        data(){
            return{
                disabledTime: this.useTime,
                showTime: [
                    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
                    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
                    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
                    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
                ],
                clickNum: "",//点击的块数
                needNum: "", //需要的块数
                baseNum: 17,
                flag: true
            }

        },
        created(){
            if(this.costTime){
                this.needNum = Math.ceil(this.costTime/30);
            }
        },
        methods: {
            chose(n){
                this.clickNum = n ;
            },
            sendMessage(){
                let sum = this.needNum + this.clickNum;
                let startTime = this.showTime[this.clickNum];
                let endTime = this.showTime[sum];
                if(sum  === 24) endTime = '20:00';
                let showTime = startTime + "至" + endTime;
                let date = new Date(this.curTime);
                let sTime = date.getFullYear() + '-' + (date.getMonth()+1)
                    + '-' + date.getDate() + ' ' + startTime;
                let eTime = date.getFullYear() + '-' + (date.getMonth()+1)
                    + '-' + date.getDate() + ' ' + endTime;
                if(!startTime) showTime = '';
                this.$emit('choose-time',new Date(sTime).getTime() , new Date(eTime).getTime(),showTime);
            }
        },
        watch: {
            'costTime' : function(){
                if(this.costTime){
                    this.needNum = Math.ceil(this.costTime/30);
                }

                if(this.costTime === 0){
                    this.needNum = 0;
                    this.clickNum = '';
                    console.log(this.needNum);
                }
            },
            'useTime' : function(){
                this.disabledTime = this.useTime;
            }
        },
        directives: {
            "myclick" : {
                update: function(el, binding,vnode){
                    //el.children[0].value  需要的块数
                    //binding.value 被点击块
                    let needNum = parseInt(el.dataset.need);
                    let chooseNum = parseInt(binding.value);
                    let sum = needNum + chooseNum;
                    let children = el.children;

                    if(needNum === '' || needNum === undefined || chooseNum === undefined || chooseNum === null){
                        return false;
                    }
                    //
                    for(let i = 0 ; i < 24; i++){
                        children[i].className = children[i].className.replace("choose","");;
                    }

                    if(sum > 24 ){
                        for(let i = 0 ; i < 24; i++){
                            children[i].className = children[i].className.replace("choose","");;
                        }
                        return false;
                    }

                    for(let i = chooseNum ; i < sum ; i++){
                        if(children[i].className.indexOf('used') !== -1) {
                            for(let i = 0 ; i < 24; i++){
                                children[i].className = children[i].className.replace("choose","");;
                            }
                            alert("该段时间不可用请重新选择时间");
                            return false;
                        }
                        children[i].className += 'choose';
                    }
//                    children[1].value = !children[1].value;
                    vnode.context.sendMessage();
                }
            }
        }
    }
</script>
<style lang="scss" scoped="scoped">
    ul{
        width: 50%;
        padding-left: 120px;
        li{
            width: 106px;
            height: 32px;
            line-height: 30px;
            font-size: 18px;
            float: left;
            text-align: center;
            border: 1px solid #efefef;
            text-align: center;
            background-color: #fff;
        }

        li:hover{
            cursor: pointer;
        }
    }
    .choose{
        background-color: #20A0FF;
    }
    .used{
        background-color: #efefef;
    }
</style>
