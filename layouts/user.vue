<script setup>
import DefaultLayout from "./default.vue";
const userStore = useUserStore();
const { userName } = storeToRefs(userStore);
</script>

<template>
  <DefaultLayout>
    <div>
      <main class="pt-18 pt-md-30 bg-neutral-120">
        <section class="position-relative">
          <picture>
            <source
              srcset="@/assets/images/profile-hero.png"
              media="(min-width: 576px)"
            />
            <img
              class="w-100 object-fit-cover"
              style="height: 384px"
              src="@/assets/images/profile-hero-sm.png"
              alt="profile-hero"
            />
          </picture>
          <div class="container">
            <div
              class="hero-content d-flex flex-column flex-md-row justify-content-center justify-content-md-start align-items-md-center gap-4 gap-md-6 mx-5 my-10 mx-md-0 my-md-0"
            >
              <img
                class="avatar"
                src="@/assets/images/avatar-6.png"
                alt="avatar"
              />
              <h1 class="text-neutral-0 fw-bold">Hello，{{ userName }}</h1>
            </div>
          </div>
        </section>

        <section class="py-10 pt-md-20 pb-md-30">
          <div class="container">
            <ul class="nav mb-10 mb-md-20 fw-bold">
              <li class="nav-item position-relative">
                <NuxtLink
                  to="/user/profile"
                  exact-active-class="text-primary-100"
                  class="nav-link px-6 py-4 text-white"
                >
                  個人資料
                </NuxtLink>
              </li>
              <li class="nav-item position-relative">
                <NuxtLink
                  to="/user/order"
                  exact-active-class="text-primary-100"
                  class="nav-link px-6 py-4 text-white"
                >
                  我的訂單
                </NuxtLink>
              </li>
            </ul>

            <slot />
          </div>
        </section>

        <picture>
          <source
            srcset="@/assets/images/deco-line-group-horizontal-full.svg"
            media="(min-width:576px)"
          />
          <img
            class="w-100"
            src="@/assets/images/deco-line-group-horizontal-sm.svg"
            alt="deco-line-group"
          />
        </picture>
      </main>
    </div>
  </DefaultLayout>
</template>

<style scoped></style>
