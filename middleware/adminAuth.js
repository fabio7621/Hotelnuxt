export default defineNuxtRouteMiddleware(async () => {
  const nuxtApp = useNuxtApp();
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl;
  const LOGIN_PAGE_PATH = "/account/login";
  const USER_CHECK_ENDPOINT = "/api/v1/user/check";

  if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) {
    return;
  }

  const token = useCookie("auth");

  if (!token.value) {
    return navigateTo(LOGIN_PAGE_PATH);
  }

  try {
    await $fetch(USER_CHECK_ENDPOINT, {
      baseURL: apiUrl,
      method: "GET",
      headers: {
        Authorization: token.value,
      },
    });
  } catch (error) {
    token.value = null;
    return navigateTo(LOGIN_PAGE_PATH);
  }
});
