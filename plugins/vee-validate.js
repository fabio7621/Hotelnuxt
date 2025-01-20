import { defineRule, configure } from "vee-validate";
import { required, min, email } from "@vee-validate/rules";

import { localize, setLocale } from "@vee-validate/i18n";
import zhTW from "@vee-validate/i18n/dist/locale/zh_TW.json";

export default defineNuxtPlugin((nuxtApp) => {
  defineRule("required", required);
  defineRule("email", email);
  defineRule("min", min);

  // 自訂驗證規則
  defineRule("isPhone", (value) => {
    const phoneNumberRegex = /^(09)[0-9]{8}$/;
    return phoneNumberRegex.test(value) ? true : "需要正確的電話號碼";
  });
  defineRule("username", (value) => {
    const regex = /^[a-zA-Z\u4e00-\u9fff]{2,}$/;
    return (
      regex.test(value) ||
      "使用者名稱只能包含字母或中文，且至少需要兩個字元"
    );
  });
  // 設定多國語系與驗證訊息
  configure({
    // 載入繁體中文的設定檔，產生繁體中文的驗證訊息
    generateMessage: localize({ zh_TW: zhTW }), 
    validateOnInput: true, // 輸入文字時立即進行驗證
  });
  
  // 設定預設語言為繁體中文
  setLocale("zh_TW");
});