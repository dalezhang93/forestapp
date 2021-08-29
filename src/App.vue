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
