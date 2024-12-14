import Modal from "bootstrap/js/dist/modal";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("modal", Modal);
});
