export const useUserStore = defineStore("userStore", () => {
  const userName = ref("");
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl;

  const fetchUserData = async (authToken) => {
    // console.log(authToken);

    try {
      const { data, error } = await useFetch("/api/v1/user/", {
        baseURL: apiUrl,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (error.value) {
        userName.value = "未登入";
        console.error("Error fetching user data:", error.value);
        return;
      }

      userName.value = data.value?.result?.name || "未登入";
    } catch (err) {
      userName.value = "未登入";
    }
  };

  return {
    userName,
    fetchUserData,
  };
});
