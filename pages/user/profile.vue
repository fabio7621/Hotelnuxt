<script setup>
definePageMeta({
  layout: "user",
  middleware: ["auth"],
});
const { $swal } = useNuxtApp();

const isEditPassword = ref(false);
const isEditProfile = ref(false);
const checkPassword = ref();

const password = ref({
  oldPassword: "",
  newPassword: "",
});

// 取得環境變數API
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;

// 生日邏輯處理 (年月日合併成 birthday )
const birthDate = reactive({
  year: "",
  month: "",
  day: "",
});
watch(
  () => ({ ...birthDate }),
  ({ year, month, day }) => {
    if (year && month && day) {
      userData.value.birthday = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    } else {
      userData.value.birthday = "";
    }
  },
  { deep: true }
);

// 取得使用者資料
const token = useCookie("auth");
const handleFetchError = ({ response }) => {
  const { message } = response?._data || {};
  $swal.fire({
    position: "center",
    icon: "error",
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
  navigateTo("/");
};
const { data: userData } = await useFetch(`api/v1/user`, {
  baseURL: apiUrl,
  method: "GET",
  headers: {
    Authorization: token.value,
  },
  transform: (response) => response.result,
  onResponseError: handleFetchError,
});

// 更改密碼
const updatePassword = () => {
  if (checkPassword.value !== password.value.newPassword) {
    $swal.fire({
      position: "center",
      icon: "error",
      title: "兩次輸入的密碼不一致",
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    putPassword();
  }
};
const putPassword = async () => {
  const { _id, name, phone, birthday, address } = userData.value;
  try {
    await $fetch("api/v1/user", {
      baseURL: apiUrl,
      method: "PUT",
      headers: {
        Authorization: token.value,
      },
      body: {
        userId: _id,
        name: name,
        phone: phone,
        birthday: birthday,
        address: address,
        ...password.value,
      },
    });

    $swal.fire({
      position: "center",
      icon: "success",
      title: "更改成功",
      showConfirmButton: false,
      timer: 1500,
    });

    window.location.reload();
  } catch (error) {
    const message = error.response?._data.message;
    $swal.fire({
      position: "center",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

// 更改基本資料
const updateUserInfo = async () => {
  const { _id, name, phone, birthday, address } = userData.value;
  try {
    const response = await $fetch("api/v1/user", {
      baseURL: apiUrl,
      method: "PUT",
      headers: {
        Authorization: token.value,
      },
      body: {
        userId: _id,
        name: name,
        phone: phone,
        birthday: birthday,
        address: address,
        oldPassword: checkPassword.value,
        newPassword: checkPassword.value,
      },
    });

    $swal.fire({
      position: "center",
      icon: "success",
      title: "更改成功",
      showConfirmButton: false,
      timer: 1500,
    });

    window.location.reload();
  } catch (error) {
    const message = error.response?._data.message;
    $swal.fire({
      position: "center",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

// seo
useSeoMeta({
  title: () => `Freyja | 個人資料`,
  ogTitle: () => `Freyja | 個人資料`,
  twitterCard: "summary_large_image",
  twitterTitle: () => `Freyja | 個人資料`,
});
</script>

<template>
  <div class="row gap-6 gap-md-0">
    <div class="col-12 col-md-5">
      <section class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0">
        <h2 class="fs-6 fs-md-5 fw-bold">修改密碼</h2>
        <div class="d-flex flex-column gap-4 gap-md-6">
          <div class="fs-8 fs-md-7">
            <p class="mb-2 text-neutral-80 fw-medium">電子信箱</p>
            <span class="form-control pe-none p-0 text-neutral-100 fw-bold border-0">{{ userData.email }}</span>
          </div>

          <div class="d-flex justify-content-between align-items-center" :class="{ 'd-none': isEditPassword }">
            <div>
              <label class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium"> 密碼 </label>
              <input class="form-control pe-none p-0 text-neutral-100 fs-5 fs-md-3 fw-bold border-0" type="password" value="**********" />
            </div>

            <button
              class="flex-shrink-0 text-primary-100 fs-8 fs-md-7 fw-bold text-decoration-underline border-0 bg-transparent"
              type="button"
              @click="isEditPassword = !isEditPassword"
            >
              重設
            </button>
          </div>

          <div class="d-flex flex-column gap-4 gap-md-6" :class="{ 'd-none': !isEditPassword }">
            <div>
              <label for="oldPassword" class="form-label fs-8 fs-md-7 fw-bold">舊密碼</label>
              <input id="oldPassword" type="password" class="form-control p-4 fs-7 rounded-3" placeholder="請輸入舊密碼" v-model="password.oldPassword" />
            </div>

            <div>
              <label for="newPassword" class="form-label fs-8 fs-md-7 fw-bold">新密碼</label>
              <input id="newPassword" type="password" class="form-control p-4 fs-7 rounded-3" placeholder="請輸入新密碼" v-model="password.newPassword" />
            </div>

            <div>
              <label for="confirmPassword" class="form-label fs-8 fs-md-7 fw-bold">確認新密碼</label>
              <input id="confirmPassword" type="password" class="form-control p-4 fs-7 rounded-3" placeholder="請再輸入一次新密碼" v-model="checkPassword" />
            </div>
          </div>

          <button
            :class="{ 'd-none': !isEditPassword }"
            class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
            type="button"
            @click="updatePassword"
          >
            儲存設定
          </button>
        </div>
      </section>
    </div>

    <div class="col-12 col-md-7">
      <section class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0">
        <h2 class="fs-6 fs-md-5 fw-bold">基本資料</h2>
        <div class="d-flex flex-column gap-4 gap-md-6">
          <div class="fs-8 fs-md-7">
            <label
              class="form-label"
              :class="{
                'fw-bold text-neutral-100': isEditProfile,
                'fw-medium text-neutral-80': !isEditProfile,
              }"
              for="name"
            >
              姓名
            </label>
            <input
              id="name"
              name="name"
              class="form-control text-neutral-100 fw-bold"
              :class="{
                'pe-none p-0 border-0': !isEditProfile,
                'p-4': isEditProfile,
              }"
              type="text"
              v-model="userData.name"
            />
          </div>

          <div class="fs-8 fs-md-7">
            <label
              class="form-label"
              :class="{
                'fw-bold text-neutral-100': isEditProfile,
                'fw-medium text-neutral-80': !isEditProfile,
              }"
              for="phone"
            >
              手機號碼
            </label>
            <input
              id="phone"
              name="phone"
              class="form-control text-neutral-100 fw-bold"
              :class="{
                'pe-none p-0 border-0': !isEditProfile,
                'p-4': isEditProfile,
              }"
              type="tel"
              v-model="userData.phone"
            />
          </div>

          <div class="fs-8 fs-md-7">
            <label
              class="form-label"
              :class="{
                'fw-bold text-neutral-100': isEditProfile,
                'fw-medium text-neutral-80': !isEditProfile,
              }"
              for="birth"
            >
              生日
            </label>
            <span
              class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
              :class="{ 'd-none': isEditProfile }"
              v-timeFormat="userData.birthday"
            ></span>
            <div class="d-flex gap-2" :class="{ 'd-none': !isEditProfile }">
              <select id="birth" class="form-select p-4 text-neutral-80 fw-medium rounded-3" v-model="birthDate.year">
                <option v-for="year in 65" :key="year" :value="year + 1958">{{ year + 1958 }} 年</option>
              </select>
              <select class="form-select p-4 text-neutral-80 fw-medium rounded-3" v-model="birthDate.month">
                <option v-for="month in 12" :key="month" :value="month">{{ month }} 月</option>
              </select>
              <select class="form-select p-4 text-neutral-80 fw-medium rounded-3" v-model="birthDate.day">
                <option v-for="day in 30" :key="day" :value="day">{{ day }} 日</option>
              </select>
            </div>
          </div>

          <div class="fs-8 fs-md-7">
            <label
              class="form-label"
              :class="{
                'fw-bold text-neutral-100': isEditProfile,
                'fw-medium text-neutral-80': !isEditProfile,
              }"
              for="address"
            >
              地址
            </label>
            <span class="form-control pe-none p-0 text-neutral-100 fw-bold border-0" :class="{ 'd-none': isEditProfile }"
              >{{ userData.address.zipcode }}{{ userData.address.detail }}</span
            >
            <div :class="{ 'd-none': !isEditProfile }">
              <input id="zipcode" type="text" class="form-control p-4 rounded-3 mb-2" placeholder="請輸入郵遞區號" v-model="userData.address.zipcode" />
              <input id="address" type="text" class="form-control p-4 rounded-3 mb-2" placeholder="請輸入詳細地址" v-model="userData.address.detail" />
            </div>
          </div>
        </div>
        <button
          :class="{ 'd-none': isEditProfile }"
          class="btn btn-outline-primary-100 align-self-start px-8 py-4 rounded-3"
          type="button"
          @click="isEditProfile = !isEditProfile"
        >
          編輯
        </button>

        <button
          :class="{ 'd-none': !isEditProfile }"
          class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
          type="button"
          @click="updateUserInfo"
        >
          儲存設定
        </button>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rounded-3xl {
  border-radius: 1.25rem;
}

input[type="password"] {
  font: small-caption;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}
</style>
