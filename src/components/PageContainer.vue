<template>
    <div class="page-container">
        <header class="tab-row">
            <span class="tab">{{title}}</span>
        </header>
        <div class="page-content">
            <el-button v-if="showBackBtn" class="back-btn" icon="el-icon-arrow-left" type="plain" @click="$router.back()">返回</el-button>
            <slot></slot>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'PageContainer',
    props: {
      title: {
        required: true,
        type: String,
      },
      showBackBtn:{
        type:Boolean,
        default:false,
      }
    }
  }
</script>
<style scoped>

    .page-container{
        padding-top: 15px;
        position: relative;
    }

    .tab-row{
        border-bottom: 1px solid #d1dbe5;
    }
    .tab {
        bottom: -1px;
        position: relative;
        padding: 0 30px;
        border: 1px solid #d1dbe5;
        border-bottom-color: #fff;
        border-radius: 4px 4px 0 0;
        display: inline-block;
        line-height: 40px;
        font-size: 18px;
        color: #616d80;
    }

    .page-content{
        border: 1px solid #d1dbe5;
        border-top: 0;
    }

    .back-btn{
        margin: 28px 0 28px 42px;
        color: #616d80;
    }
</style>
