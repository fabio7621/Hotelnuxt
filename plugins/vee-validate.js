import { defineRule, configure } from "vee-validate";
import { required, min, email } from "@vee-validate/rules";

import { localize, setLocale } from "@vee-validate/i18n";
import zhTW from "@vee-validate/i18n/dist/locale/zh_TW.json";

export default defineNuxtPlugin(() => {
  const PHONE_PATTERN = /^(09)[0-9]{8}$/;
  const USERNAME_PATTERN = /^[a-zA-Z\u4e00-\u9fff]{2,}$/;

  defineRule("required", required);
  defineRule("email", email);
  defineRule("min", min);

  defineRule("isPhone", (value) => {
    return PHONE_PATTERN.test(value) || "需要正確的電話號碼";
  });

  defineRule("username", (value) => {
    return USERNAME_PATTERN.test(value) || "使用者名稱只能包含字母或中文，且至少需要兩個字元";
  });

  configure({
    generateMessage: localize({ zh_TW: zhTW }),
    validateOnInput: true,
  });

  setLocale("zh_TW");
});
