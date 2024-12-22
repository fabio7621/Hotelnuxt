// stores/userStore.js
import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", () => {
  const userName = ref("未登入");

  const fetchUserData = async (authToken) => {
    if (!authToken) {
      userName.value = "未登入";
      return;
    }

    try {
      const { data } = await useFetch("/api/v1/user/check", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      userName.value = data.value?.result?.name || "未登入";
    } catch (err) {
      console.error("Error fetching user data:", err);
      userName.value = "未登入";
    }
  };

  return {
    userName,
    fetchUserData,
  };
});
