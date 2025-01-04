<script setup>
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

setTimeout(() => {
  router.go(-1);
}, 2000);
</script>

<template>
  <div class="notfundpage">
    <div class="notfund-text">
      <h1>404 - 找不到頁面</h1>
      <p>抱歉，您所尋找的頁面不存在。</p>
    </div>
  </div>
</template>

<style scoped>
.notfundpage {
  width: 100vw;
  height: 100vh;
  display: flex;
}
.notfund-text {
  margin: auto;
}
button:hover {
  background-color: #0056b3;
}
</style>
