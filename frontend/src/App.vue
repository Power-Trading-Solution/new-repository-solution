<template>
  <div id="app">
    <Header />
    <router-view /> <!-- Место для отображения текущего компонента -->
  </div>
</template>

<script>
import Header from './components/Header.vue';

export default {
  components: {
    Header
  }
}
</script>

<style>
#app {
  font-family: 'Arial', sans-serif;
  background-color: #e9ecef;
  min-height: 100vh;
  padding: 20px;
}
</style>
