export default defineNuxtPlugin(nuxtApp => {
  // 方法一 : nuxtApp.provide(輔助函式名稱,執行的輔助函式);
  // 如果只需要在插件中定義一個輔助函式，nuxtApp.provide() 更方便的方式。
  nuxtApp.provide('formatPrice', (price) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
})