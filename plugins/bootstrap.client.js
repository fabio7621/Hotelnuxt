// import Collapse from "bootstrap/js/dist/collapse";
// import Dropdown from "bootstrap/js/dist/dropdown";
// import Modal from "bootstrap/js/dist/modal";
// import Tooltip from "bootstrap/js/dist/tooltip";
// import Popover from "bootstrap/js/dist/popover";
// import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";

// export default defineNuxtPlugin((nuxtApp) => {
//   nuxtApp.hook("app:mounted", () => {
//     const tooltipTriggerList = document.querySelectorAll(
//       '[data-bs-toggle="tooltip"]'
//     );
//     const tooltipList = [...tooltipTriggerList].map(
//       (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
//     );
//   });

//   return {
//     provide: {
//       bootstrap: {
//         Collapse,
//         Dropdown,
//         Modal,
//         Tooltip,
//         Popover,
//       },
//     },
//   };
// });
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("bootstrap", bootstrap);
});
