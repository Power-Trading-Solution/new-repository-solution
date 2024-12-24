<template>
  <header class="header">
    <div class="logo">
      <h1>Social Trading</h1>
    </div>
    <nav>
      <ul>
        <li>
          <router-link to="/">Главная</router-link>
        </li>
        <li>
          <router-link to="/ethereum-chart">Мониторинг Ethereum</router-link>
        </li>
        <li>
          <router-link to="/history-operations">История операций</router-link> <!-- Новая ссылка -->
        </li>
        <li>
          <router-link to="/about">About</router-link>
        </li>
        <li>
          <router-link to="/contact">Contact</router-link>
        </li>
      </ul>
    </nav>
    <div class="auth-buttons">
      <button @click="showLogin">Log In</button>
      <button @click="showSignUp">Sign Up</button>
    </div>
  </header>
</template>


<script>
export default {
  methods: {
    showLogin() {
      // Логика для отображения окна входа
      console.log("Show login form");
    },
    showSignUp() {
      // Логика для отображения окна регистрации
      console.log("Show sign-up form");
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #4d3291;
  color: white;
  position: fixed; /* Фиксируем хедер */
  top: 0;
  left: 0;
  width: 100%; /* Хедер занимает всю ширину */
  z-index: 1000; /* Чтобы он был сверху */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Тень под хедером */
  box-sizing: border-box; /* Чтобы отступы не выходили за пределы экрана */
  height: 80px;
}

.logo h1 {
  margin: 0;
}

nav ul {
  list-style: none;
  display: flex;
  padding: 0; /* Убираем внутренние отступы */
  margin: 0;  /* Убираем внешние отступы */
}

nav ul li {
  margin-right: 20px;
}

nav ul li a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

nav ul li a:hover {
  text-decoration: underline;
}

.auth-buttons button {
  margin-left: 10px;
  padding: 8px 16px;
  background-color: #6340bc;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.auth-buttons button:hover {
  background-color: #6340bc;
}

/* Для отступа главного контента от хедера */
body {
  padding-top: 120px; /* Увеличиваем отступ, чтобы контент не был скрыт под хедером */
}
</style>