import { createApp } from 'vue'; // Импортируем функцию для создания приложения
import App from './App.vue'; // Основной компонент приложения
import router from './router'; // Роутер, который мы настроили

// Создаем и монтируем Vue приложение
createApp(App)
  .use(router) // Подключаем роутер
  .mount('#app'); // Монтируем приложение в элемент с id "app"
