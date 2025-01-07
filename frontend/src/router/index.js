import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../components/MainPage.vue";
import EthereumChart from "../components/EthereumChart.vue";
import InvestorPage from "../components/InvestorPage.vue";
import SwapPage from "../components/SwapPage.vue";

const routes = [
  { path: "/", component: MainPage },
  { path: "/ethereum-chart", component: EthereumChart },
  { path: "/investor-page", component: InvestorPage },
  { path: "/swap-page", component: SwapPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
