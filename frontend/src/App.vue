<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import About from './components/About.vue'
</script>

<!-- <template> -->
  <!-- <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a> -->
    <!-- <v-btn to="/about" name="about">About</v-btn> -->
    <!-- <router-link to="/about" class="button">About</router-link> -->
    <!-- <router-view></router-view> -->

  <!-- </div> -->
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <!-- <router-view></router-view> -->
  <!-- <router-link to="/about" class="button">About</router-link> -->


<!-- </template> -->

<template>
    <router-link to="/about" class="button">About</router-link>
    <router-view></router-view>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
