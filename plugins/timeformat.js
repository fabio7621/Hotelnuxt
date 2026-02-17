import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import "dayjs/locale/zh-tw";

dayjs.extend(weekday);
dayjs.locale("zh-tw");

export default defineNuxtPlugin((nuxtApp) => {
  const EMPTY_DATE_TEXT = "--";

  nuxtApp.vueApp.directive("timeFormat", {
    mounted(el, binding) {
      if (!binding.value) {
        el.innerHTML = EMPTY_DATE_TEXT;
        return;
      }

      const time = dayjs(binding.value).format("M 月 D 日 dddd");
      el.innerHTML = time;
    },
  });
});
