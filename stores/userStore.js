export const useUserStore = defineStore("userStore", () => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl;
  const LOGIN_FALLBACK_TEXT = "未登入";

  const userAll = ref({});
  const userName = ref("");
  const userId = ref("");
  const userEmail = ref("");
  const userPhone = ref("");
  const userAddress = ref("");
  const userCity = ref("");
  const userCounty = ref("");
  const userDetail = ref("");
  const userZipcode = ref("");
  const address = ref({});
  const birthday = ref("");
  const userBirthday = ref("");

  const formatBirthday = (birthdayDate) => {
    if (!birthdayDate) {
      return "";
    }

    const parsedDate = new Date(birthdayDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return `${parsedDate.getFullYear()}年${parsedDate.getMonth() + 1}月${parsedDate.getDate()}日`;
  };

  const resetUserData = () => {
    userAll.value = {};
    userName.value = LOGIN_FALLBACK_TEXT;
    userId.value = "";
    userEmail.value = "";
    userPhone.value = "";
    userAddress.value = "";
    userCity.value = "";
    userCounty.value = "";
    userDetail.value = "";
    userZipcode.value = "";
    address.value = {};
    birthday.value = "";
    userBirthday.value = "";
  };

  const setUserData = (userData = {}) => {
    const normalizedAddress = userData.address || {};

    userAll.value = userData;
    userName.value = userData.name || LOGIN_FALLBACK_TEXT;
    userId.value = userData._id || "";
    userEmail.value = userData.email || "";
    userPhone.value = userData.phone || "";

    address.value = normalizedAddress;
    userCity.value = normalizedAddress.city || "";
    userCounty.value = normalizedAddress.county || "";
    userDetail.value = normalizedAddress.detail || "";
    userZipcode.value = normalizedAddress.zipcode || "";
    userAddress.value = `${userCity.value}${userCounty.value}${userDetail.value}`;

    birthday.value = userData.birthday || "";
    userBirthday.value = formatBirthday(birthday.value);
  };

  const fetchUserData = async (authToken) => {
    if (!authToken) {
      resetUserData();
      return;
    }

    try {
      const { data, error } = await useFetch("/api/v1/user/", {
        baseURL: apiUrl,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (error.value) {
        resetUserData();
        console.error("Error fetching user data:", error.value);
        return;
      }

      setUserData(data.value?.result || {});
    } catch (err) {
      console.error("Unexpected user fetch error:", err);
      resetUserData();
    }
  };

  return {
    userAll,
    userId,
    userName,
    userEmail,
    userPhone,
    userAddress,
    userCity,
    userCounty,
    userDetail,
    userZipcode,
    fetchUserData,
    userBirthday,
    resetUserData,
  };
});
