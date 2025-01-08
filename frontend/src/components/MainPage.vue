<template>
  <div class="container">
    <!-- Header with welcome message -->
    <div class="welcome">
      <h1>Добро пожаловать на платформу</h1>
      <p v-if="!connected">Подключите свой кошелек для продолжения.</p>
      <p v-if="connected">Привет, {{ address }}! Ваш баланс: {{ balance }} ETH</p>
    </div>

    <!-- Connect wallet button -->
    <div class="button-container">
      <button v-if="!connected" @click="connect" class="connect-button">Подключить кошелек</button>
    </div>
    
    <!-- User info and manager registration form -->
    <div v-if="connected" class="user-info">
      <h3>Хотите стать менеджером?</h3>
      <p>Если вы хотите добавить себя в список менеджеров, введите комиссию в процентах и нажмите "Добавить".</p>
      
      <form @submit.prevent="addUser" class="form">
        <label for="commission">Комиссия (%):</label>
        <input type="number" v-model="newCommission" id="commission" required class="input" placeholder="Введите комиссию" />
        <button type="submit" class="submit-button">Добавить</button>
      </form>

      <!-- List of users -->
      <div v-if="users.length" class="user-list">
        <h3>Список менеджеров:</h3>
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Address</th>
              <th>Комиссия (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user.address">
              <td>{{ index + 1 }}</td>
              <td>{{ user.address }}</td>
              <td>{{ user.commission }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ethers } from 'ethers';

const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_commission",
          "type": "uint256"
        }
      ],
      "name": "addUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getUsers",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "commission",
              "type": "uint256"
            }
          ],
          "internalType": "struct UserRegistry.UserInfo[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "users",
      "outputs": [
        {
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "commission",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

const contractAddress = '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44';

export default {
  data() {
    return {
      connected: false,
      address: null,
      balance: null,
      users: [],
      newCommission: 0,
    };
  },
  methods: {
    async connect() {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          this.address = await signer.getAddress();
          this.balance = ethers.formatEther(await signer.provider.getBalance(this.address)); // Баланс в ETH
          this.connected = true;

          console.log("Connected address:", this.address);
          console.log("Balance:", this.balance);

          // Загружаем список пользователей после подключения
          this.fetchUsers();
        } catch (error) {
          console.error("Connection failed:", error);
        }
      }
    },
    async fetchUsers() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      try {
        const users = await contract.getUsers();
        this.users = users.map(user => ({
          address: user.userAddress,
          commission: Number(user.commission),
        }));
        console.log("Users fetched:", this.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async addUser() {
      if (this.connected && this.newCommission >= 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
          const tx = await contract.addUser(this.address, this.newCommission);
          console.log("Transaction sent:", tx);

          await tx.wait();
          console.log("Transaction confirmed:", tx);

          this.fetchUsers();

          this.newCommission = 0;
        } catch (error) {
          console.error("Error adding user:", error);
        }
      } else {
        console.log("Invalid commission value.");
      }
    },
  },
};
</script>

<style scoped>
/* Основной контейнер */
.container {
  max-width: 900px; /* Увеличиваем ширину контейнера */
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

/* Заголовок и приветственное сообщение */
.welcome h1 {
  color: #333;
  font-size: 28px;
  text-align: center;
}

.welcome p {
  text-align: center;
  font-size: 18px;
  color: #555;
}

/* Контейнер для кнопки подключения кошелька */
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* Кнопка подключения кошелька */
.connect-button {
  padding: 12px 24px;
  font-size: 18px;
  background-color: #6f42c1; /* Фиолетовый цвет */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.connect-button:hover {
  background-color: #5a2c91; /* Темный фиолетовый при наведении */
}

/* Стиль для информации о пользователе */
.user-info {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
}

h3 {
  color: #333;
  font-size: 22px;
}

p {
  font-size: 18px;
  color: #555;
  margin-bottom: 20px;
}

.form {
  margin-top: 20px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* Стиль таблицы */
.user-list {
  margin-top: 30px;
}

.user-list table {
  width: 100%;
  border-collapse: collapse;
}

.user-list th, .user-list td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.user-list th {
  background-color: #6f42c1; /* Фиолетовый заголовок */
  color: white;
}

.user-list tr:nth-child(even) {
  background-color: #f9f9f9;
}

.user-list tr:hover {
  background-color: #f1f1f1;
}

/* Стиль для формы */
.input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input:focus {
  border-color: #6f42c1;
  outline: none;
}

.submit-button {
  background-color: #6f42c1; /* Фиолетовый цвет */
  color: white;
  width: 100%;
  padding: 12px;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #5a2c91;
}
</style>
