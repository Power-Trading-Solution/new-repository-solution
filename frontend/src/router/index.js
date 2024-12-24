import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../components/MainPage.vue";
import EthereumChart from "../components/EthereumChart.vue";
import HistoryOperations from "../components/HistoryOperations.vue"; // Новый компонент

const routes = [
  { path: "/", component: MainPage },
  { path: "/ethereum-chart", component: EthereumChart },
  { path: "/history-operations", component: HistoryOperations } // Добавленный маршрут
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
