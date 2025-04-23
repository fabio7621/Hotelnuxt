export default defineNuxtRouteMiddleware(async () => {
  const nuxtApp = useNuxtApp();
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl;
  const token = useCookie("auth");

  if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) {
    return;
  }

  if (!token.value) {
    return navigateTo("/account/login");
  }

  try {
    await $fetch("/api/v1/user/check", {
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
