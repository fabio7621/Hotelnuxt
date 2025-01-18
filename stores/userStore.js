export const useUserStore = defineStore("userStore", () => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl;

  const userName = ref("");
  const userId = ref("");
  const userEmail = ref("");
  const userPhone = ref("");
  const userAddress = ref({});
  const userCity = ref({});
  const userCounty = ref({});
  const userDetail = ref({});
  const userZipcode = ref({});
  const address = ref({});
  const birthday = ref("");
  const userBirthday = ref("");
  // email
  // phone
  // birthday
  // "address": {
  //   "zipcode": 802,
  //   "detail": "文山路23號",
  //   "city": "高雄市",
  //   "county": "苓雅區"
  // },
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
      userId.value = data.value?.result?.id;
      userEmail.value = data.value?.result?.email;
      userPhone.value = data.value?.result?.phone;

      address.value = data.value?.result?.address;
      userAddress.value = `${address.value.city || ""}${
        address.value.county || ""
      }${address.value.detail || ""}`;
      userCity.value = `${address.value.city}`;
      userCounty.value = `${address.value.county}`;
      userDetail.value = `${address.value.detail}`;
      userZipcode.value = `${address.value.zipcode}`;

      birthday.value = data.value?.result?.birthday;
      const date = new Date(birthday.value); // 將字串轉為 Date 物件
      userBirthday.value = `${date.getFullYear()}年${
        date.getMonth() + 1
      }月${date.getDate()}日`;
    } catch (err) {
      userName.value = "未登入";
    }
  };

  return {
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
  };
});
