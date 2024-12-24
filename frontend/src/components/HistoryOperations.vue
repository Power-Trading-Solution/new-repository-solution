<template>
    <div class="container">
      <h1>История операций</h1>
      <div v-if="isLoading">Загрузка...</div>
      <div v-else>
        <ul>
          <li v-for="(item, index) in operations" :key="index">
            <strong>Адрес:</strong> {{ item.addr }} |
            <strong>Баланс:</strong> {{ item.balance }} ETH
          </li>
        </ul>
      </div>
      <button @click="fetchUsers">Обновить историю</button>
    </div>
  </template>
  
  <script>
  import { ethers } from "ethers";
  
  export default {
    data() {
      return {
        provider: null,
        signer: null,
        contract: null,
        contractAddress: "0x5C69bEe701ef814a2B6a3EDD3B8b3D3e6C5F20C4",
        abi: [
          // Здесь вставьте ABI вашего контракта MyTest.sol
          {
            "inputs": [],
            "name": "getUserBalance",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "users",
            "outputs": [
              { "internalType": "address", "name": "addr", "type": "address" },
              { "internalType": "uint256", "name": "balance", "type": "uint256" },
            ],
            "stateMutability": "view",
            "type": "function",
          },
        ],
        operations: [],
        isLoading: false,
      };
    },
    methods: {
      async connectWallet() {
        if (window.ethereum) {
          this.provider = new ethers.providers.Web3Provider(window.ethereum);
          this.signer = this.provider.getSigner();
          this.contract = new ethers.Contract(
            this.contractAddress,
            this.abi,
            this.signer
          );
          console.log("Wallet connected");
        } else {
          alert("MetaMask не установлен!");
        }
      },
      async fetchUsers() {
        if (!this.contract) {
          await this.connectWallet();
        }
  
        this.isLoading = true;
        try {
          const users = [];
          // Предположим, что users() возвращает массив пользователей
          for (let i = 0; i < 10; i++) {
            const user = await this.contract.users(i);
            users.push({
              addr: user.addr,
              balance: ethers.utils.formatEther(user.balance),
            });
          }
          this.operations = users;
        } catch (error) {
          console.error("Ошибка при получении данных:", error);
        }
        this.isLoading = false;
      },
    },
    mounted() {
      this.connectWallet();
      this.fetchUsers();
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f8f8f8;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  h1 {
    color: #333;
    text-align: center;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    background-color: #42b983;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #358965;
  }
  </style>
  