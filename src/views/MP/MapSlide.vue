<template>
  <div class="map-slide">
    <img class="border" src="../../assets/map/map_slidebar.png" alt="">
    <div class="content">
      <p class="num">{{ num }}</p>
      <p class="num-title">{{ title }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      num: {
        type: Number,
        default: 0
      }
    }
  }
</script>
<style lang="scss" scoped>
  .map-slide{
    width: 120px;
    min-height: 120px;
    position: absolute;
    right: 50px;
    bottom: 300px;
    z-index: 100000;
    color: red;
    display: flex;
    align-items: center;
    justify-content: center;
    .content{
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      p{
        line-height: 1.2;
      }
    }
    .border{
      position: absolute;
      left: 0;
      top: 0;
      width: 120px;
      height: 120px;
      transform-origin: 50% 50%;
      animation: rotate 10s linear infinite;
    }
  }
  @keyframes rotate {
    0% {transform: rotate(0)}
    100% {transform: rotate(360deg)}
  }
  @-webkit-keyframes rotate {
    0% {transform: rotate(0)}
    100% {transform: rotate(360deg)}
  }
</style>
