import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Transactions from "../views/Transactions.vue";
import Budget from "../views/Budget.vue";
import Goals from "../views/Goals.vue";
import Attendance from "../views/Attendance.vue";
import Reports from "../views/Reports.vue";
import Settings from "../views/Settings.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/dashboard" },
    { path: "/dashboard", component: Dashboard },
    { path: "/transactions", component: Transactions },
    { path: "/budget", component: Budget },
    { path: "/goals", component: Goals },
    { path: "/attendance", component: Attendance },
    { path: "/reports", component: Reports },
    { path: "/settings", component: Settings },
  ],
});

export default router;
