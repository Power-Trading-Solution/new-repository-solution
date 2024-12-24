import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import MainPage from './components/MainPage.vue';
import EthereumChart from './components/EthereumChart.vue';
import HistoryOperations from "./components/HistoryOperations.vue";

// Настройка маршрутов
const routes = [
  { path: '/', component: MainPage },
  { path: '/ethereum-chart', component: EthereumChart },
  { path: "/history-operations", component: HistoryOperations },
];

// Создание маршрутизатора
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Инициализация приложения
createApp(App).use(router).mount('#app');
