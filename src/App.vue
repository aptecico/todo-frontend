<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <div id="app">
      <NotasApp/>
  </div>
  
</template>

<script>
import NotasApp from './components/NotasApp.vue';

export default {
  name: 'App',
  components: {
    NotasApp
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}

</style>
