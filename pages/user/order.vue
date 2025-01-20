<script setup>
definePageMeta({
  layout: "user",
  middleware: ["auth"],
});
const { $swal } = useNuxtApp();
const { $formatPrice } = useNuxtApp();
const latestBooking = computed(() => bookingList.value[bookingList.value.length - 1] || {});

// 取得環境變數API
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;

// 計算天數
const countDateDiffs = (start, end) => {
  var startDate = new Date(start);
  var endDate = new Date(end);
  return parseInt(Math.abs(startDate - endDate) / 1000 / 60 / 60 / 24);
};

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

// 取得訂單資料
const [{ data: bookingList }] = await Promise.all([
  useFetch(`api/v1/orders`, {
    baseURL: apiUrl,
    headers: {
      Authorization: token.value,
    },
    transform: (response) =>
      response?.result.filter((item) => {
        return item.status === 0;
      }),
    onResponseError: handleFetchError,
  }),
]);

// 訂單顯示筆數
const visibleCount = ref(3);
const showMoreList = () => {
  visibleCount.value += 3;
};

// 取消訂單預定
const cancelBooking = async (id) => {
  try {
    await $fetch(`api/v1/orders/${id}`, {
      baseURL: apiUrl,
      method: "DELETE",
      headers: {
        Authorization: token.value,
      },
    });

    $swal.fire({
      position: "center",
      icon: "success",
      title: "取消預定成功",
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
  title: () => `Freyja | 我的訂單`,
  ogTitle: () => `Freyja | 我的訂單`,
  twitterCard: "summary_large_image",
  twitterTitle: () => `Freyja | 我的訂單`,
});
</script>
<template>
  <div class="row gap-6 gap-md-0" v-if="bookingList">
    <div class="col-12 col-md-7">
      <div class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0" style="max-width: 730px">
        <div>
          <p class="mb-2 text-neutral-80 fs-8 fs-md-7 fw-medium">預訂參考編號： {{ latestBooking?._id }}</p>
          <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">即將來的行程</h2>
        </div>

        <img class="img-fluid rounded-3" :src="latestBooking?.roomId.imageUrl" :alt="latestBooking?.roomId.name" />

        <section class="d-flex flex-column gap-6">
          <h3 class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold">
            <p class="mb-0">
              {{ latestBooking?.roomId.name }}，{{ countDateDiffs(latestBooking?.checkInDate, latestBooking?.checkOutDate) }}
              晚
            </p>
            <span class="d-inline-block mx-4 bg-neutral-80" style="width: 1px; height: 18px" />
            <p class="mb-0">住宿人數：{{ latestBooking?.peopleNum }} 位</p>
          </h3>

          <div class="text-neutral-80 fs-8 fs-md-7 fw-bold">
            <p class="title-deco mb-2">入住：<span v-timeFormat="latestBooking?.checkInDate"></span>，15:00 可入住</p>
            <p class="title-deco mb-0">退房：<span v-timeFormat="latestBooking?.checkOutDate"></span>，12:00 前退房</p>
          </div>

          <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
            NT$
            {{ $formatPrice(latestBooking?.roomId.price * countDateDiffs(latestBooking?.checkInDate, latestBooking?.checkOutDate)) }}
          </p>
        </section>

        <hr class="my-0 opacity-100 text-neutral-40" />

        <section>
          <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">房內設備</h3>
          <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled">
            <li class="flex-item d-flex gap-2" v-for="facility in latestBooking?.roomId.facilityInfo" :key="facility.title">
              <Icon
                class="fs-5"
                :class="facility.isProvide ? 'text-primary-100' : 'text-neutral-60'"
                :icon="facility.isProvide ? 'material-symbols:check' : 'material-symbols:close'"
              />
              <p class="mb-0 text-neutral-80 fw-bold">
                {{ facility.title }}
              </p>
            </li>
          </ul>
        </section>

        <section>
          <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">備品提供</h3>
          <ul class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled">
            <li class="flex-item d-flex gap-2" v-for="amenity in latestBooking?.roomId.amenityInfo" :key="amenity.title">
              <Icon
                class="fs-5"
                :class="amenity.isProvide ? 'text-primary-100' : 'text-neutral-60'"
                :icon="amenity.isProvide ? 'material-symbols:check' : 'material-symbols:close'"
              />
              <p class="mb-0 text-neutral-80 fw-bold">
                {{ amenity.title }}
              </p>
            </li>
          </ul>
        </section>

        <div class="d-flex gap-4">
          <button
            data-bs-toggle="modal"
            data-bs-target="#cancelModal"
            class="btn btn-outline-primary-100 w-50 py-4 fw-bold"
            style="--bs-btn-hover-color: #fff"
            type="button"
          >
            取消預訂
          </button>
          <NuxtLink :to="`/rooms/${latestBooking?.roomId._id}`" class="btn btn-primary-100 text-neutral-0 w-50 py-4 fw-bold" type="button">
            查看房間詳情
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-5">
      <div class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0">
        <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">歷史訂單</h2>

        <template v-for="(booking, index) in bookingList.slice(0, visibleCount)" :key="booking._id">
          <div class="d-flex flex-column flex-lg-row gap-6">
            <img class="img-fluid object-fit-cover rounded-3" style="max-width: 120px; height: 80px" :src="booking.roomId.imageUrl" :alt="booking.name" />
            <section class="d-flex flex-column gap-4">
              <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">預訂參考編號： {{ booking._id }}</p>
              <h3 class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold">
                {{ booking.roomId.name }}
              </h3>
              <div class="text-neutral-80 fw-medium">
                <p class="mb-2">
                  住宿天數：
                  {{ countDateDiffs(booking.checkInDate, booking.checkOutDate) }}
                  晚
                </p>
                <p class="mb-0">住宿人數： {{ booking.peopleNum }} 位</p>
              </div>
              <div class="text-neutral-80 fs-8 fs-md-7 fw-medium">
                <p class="title-deco mb-2">入住：</p>
                <p><span v-timeFormat="booking.checkInDate"></span>，15:00可入住</p>
                <p class="title-deco mb-0">退房：</p>
                <p><span v-timeFormat="booking.checkOutDate"></span>，12:00前退房</p>
              </div>
              <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
                NT$
                {{ $formatPrice(booking.roomId.price * countDateDiffs(booking.checkInDate, booking.checkOutDate)) }}
              </p>
            </section>
          </div>
          <hr class="my-0 opacity-100 text-neutral-40" v-if="visibleCount < bookingList.length" />
        </template>

        <button
          class="btn btn-outline-primary-100 py-4 fw-bold"
          style="--bs-btn-hover-color: #fff"
          type="button"
          @click="showMoreList"
          v-if="visibleCount < bookingList.length"
        >
          查看更多
        </button>
      </div>
    </div>
  </div>

  <div class="row" v-else>
    <div class="col-12">
      <div class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0" style="max-width: 730px">
        <h1>目前沒有訂單</h1>
        <NuxtLink to="/room"> 點我前往訂房 </NuxtLink>
      </div>
    </div>
  </div>

  <div id="cancelModal" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered align-items-end align-items-md-center m-0 mx-md-auto h-100">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div class="modal-body mx-auto my-10 my-md-15 text-neutral-80 fs-8 fs-md-6 fw-bold">確定要取消此房型的預訂嗎？</div>
        <div class="modal-footer d-flex gap-4">
          <button type="button" class="btn btn-outline-primary-100 flex-grow-1 m-0 py-4 fw-bold" style="--bs-btn-hover-color: #fff" data-bs-dismiss="modal">
            關閉視窗
          </button>
          <button type="button" class="btn btn-primary-100 flex-grow-1 m-0 py-4 text-white fw-bold" @click="cancelBooking(latestBooking?._id)">確定取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "bootstrap/scss/mixins/breakpoints";

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px,
);

.rounded-3xl {
  border-radius: 1.25rem;
}

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  --color: #bf9d7d;
  content: "";
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: var(--color);
  border-radius: 10px;
  margin-right: 0.75rem;
}

.title-deco:nth-child(2)::before {
  --color: #909090;
}

.flex-item {
  max-width: 97px;
  width: 100%;
  white-space: nowrap;
}

.modal {
  backdrop-filter: blur(10px);

  @include media-breakpoint-down(md) {
    backdrop-filter: none;
  }
}

.modal-header {
  @include media-breakpoint-down(md) {
    border-bottom: 0 !important;
  }
}

.modal-content {
  @include media-breakpoint-down(md) {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
}
</style>
