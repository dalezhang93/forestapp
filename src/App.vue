<!--
 * @Descripttion: 
 * @Author: sandro0618
 * @Date: 2021-07-30 15:19:50
 * @LastEditors: sandro0618
 * @LastEditTime: 2021-08-03 09:47:30
-->
<template>
  <div id="app" style="width: 100%; height: 100%; background: grey; position: relative;">
    <earth-comp></earth-comp>
  </div>
</template>

<script>
import EarthComp from './components/EarthComp.vue'

export default {
  name: 'app',
  components: {
    EarthComp
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
