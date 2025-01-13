// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["@/assets/stylesheets/all.scss"],
  runtimeConfig: {
    public: {
      apiUrl: "https://nuxr3.zeabur.app",
    },
  },
  app: {
    head: {
      viewport: "width=500, initial-scale=1",
      title: "Freyja 旅館",

      meta: [
        {
          name: "description",
          content: "李承哲的Nuxt作品",
        },
        { property: "og:title", content: "李承哲的Nuxt作品" },
        {
          property: "og:description",
          content: "李承哲的Nuxt作品",
        },
      ],
    },
  },
  modules: [
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
  ],
});
