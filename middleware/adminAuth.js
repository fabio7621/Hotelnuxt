export default defineNuxtRouteMiddleware(async () => {
  const nuxtApp = useNuxtApp();
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl;

  if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) {
    return;
  }

  const token = useCookie("auth");

  if (!token.value) {
    return navigateTo("/account/login");
  }

  try {
    await $fetch("/user/check", {
      baseURL: apiUrl,
      method: "GET",
      headers: {
        Authorization: token.value,
      },
    });
  } catch (error) {
    token.value = null;
    return navigateTo("/account/login");
  }
});
