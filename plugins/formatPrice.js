export default defineNuxtPlugin((nuxtApp) => {
  const formatPrice = (price) => {
    const amount = Number(price);
    if (Number.isNaN(amount)) {
      return "0";
    }

    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  nuxtApp.provide("formatPrice", formatPrice);
});
