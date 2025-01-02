<template>
    <div>
      <h1>Список доступных аккаунтов</h1>
      <ul>
        <li v-for="(account, index) in accounts" :key="index">
          {{ account }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ethers } from "ethers";
  
  export default {
    data() {
      return {
        accounts: [], // Массив для хранения аккаунтов
      };
    },
    methods: {
      async getAccounts() {
        // Проверка, поддерживает ли браузер Ethereum (например, MetaMask)
        if (window.ethereum) {
          try {
            // Запрашиваем доступ к аккаунтам пользователя
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = provider.getSigner();
            const accounts = await provider.listAccounts();
            
            this.accounts = accounts; // Обновляем список аккаунтов в data
          } catch (error) {
            console.error("Ошибка при получении аккаунтов:", error);
          }
        } else {
          alert("Ethereum не найден. Пожалуйста, установите MetaMask.");
        }
      },
    },
    mounted() {
      this.getAccounts(); // Загружаем аккаунты при монтировании компонента
    },
  };
  </script>
  
  <style scoped>
  /* Стили для компонента */
  h1 {
    font-size: 2rem;
    margin-bottom: 10px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    padding: 5px 0;
  }
  </style>
  