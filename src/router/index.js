/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router";
// import { routes } from 'vue-router/auto-routes'

/////// Auto Routes
// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes,
// })

/////// Manual Routes
const router = createRouter({
  history: createWebHistory("/ctg/"), // ต้องใส่เพื่อให้ path ถูกต้องเมื่อเอาขึ้น server
  duplicateNavigationPolicy: "ignore",
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("@/pages/login.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("@/pages/index.vue"),
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: () => import("@/pages/dashboard.vue"),
        },
        {
          path: "/department",
          name: "department",
          component: () => import("@/pages/department.vue"),
        },
        {
          path: "/employee",
          name: "employee",
          component: () => import("@/pages/employee.vue"),
        },
        {
          path: "/productType",
          name: "productType",
          component: () => import("@/pages/productType.vue"),
        },
        {
          path: "/metalType",
          name: "metalType",
          component: () => import("@/pages/metalType.vue"),
        },
        {
          path: "/unitType",
          name: "unitType",
          component: () => import("@/pages/unitType.vue"),
        },
        {
          path: "/customer",
          name: "customer",
          component: () => import("@/pages/customer.vue"),
        },
      ],
    },
  ],
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (localStorage.getItem("vuetify:dynamic-reload")) {
      console.error("Dynamic import error, reloading page did not fix it", err);
    } else {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
