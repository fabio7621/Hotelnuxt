import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday"; // 引入解析星期的插件
import "dayjs/locale/zh-tw"; // 引入繁體中文

dayjs.extend(weekday);
dayjs.locale("zh-tw");

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("timeFormat", {
    mounted(el, binding) {
      const time = dayjs(binding.value).format("M 月 D 日 dddd");
      el.innerHTML = time;
    },
  });
});