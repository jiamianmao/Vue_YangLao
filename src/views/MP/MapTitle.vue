<template>
  <div class="map-title">
    <h2>{{ title }}</h2>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>
<style lang="scss" scoped>
  .map-title{
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    text-align: center;
    color: #677cc3;
    line-height: 50px;
    font-size: 30px;
  }
</style>
