<template>
  <div class="page-container">
    <div class="wallet-connect">
      <button v-if="!connected" class="connect-button" @click="connect">Подключить кошелек</button>
      <button v-if="connected" class="action-button" @click="callContract">Call Contract</button>
    </div>

    <div v-if="connected" class="form-container">
      <h2>Deposit Tokens</h2>
      <input v-model="tokenAddress" class="input-field" placeholder="Address of Tokens" />
      <input v-model="tokenAmount" class="input-field" placeholder="Amount of Tokens" />
      <button @click="phaseFirst" class="action-button">Deposit Tokens (Phase First)</button>
    </div>

    <div v-if="connected" class="form-container">
      <h2>Create Trust</h2>
      <input v-model="managerAddress" class="input-field" placeholder="Manager Address" />
      <input v-model="trustDuration" class="input-field" placeholder="Trust Duration (Days)" />
      <input v-model="managerCommission" class="input-field" placeholder="Manager Commission (%)" />
      <button @click="makeTrust" class="action-button">Make Trust</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ethers } from 'ethers';

const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'; // Укажите адрес контракта
const abi = [ /* Ваш ABI для контракта */ ];

export default {
  data() {
    return {
      connected: false,
      address: null,
      balance: null,
      tokenAddress: '',
      tokenAmount: '',
      managerAddress: '',
      trustDuration: '',
      managerCommission: '',
    };
  },
  methods: {
    async connect() {
      if (window.ethereum) {
        try {
          // Подключение к MetaMask
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          this.address = await signer.getAddress();
          this.balance = ethers.formatEther(await signer.provider.getBalance(this.address)); // Баланс в ETH
          this.connected = true;

          console.log("Connected address:", this.address);
          console.log("Balance:", this.balance);
        } catch (error) {
          console.error("Connection failed:", error);
        }
      } else {
        console.log("Please install MetaMask!");
      }
    },
    async callContract() {
      if (this.connected) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        // Вставьте логику для взаимодействия с контрактом
        try {
          const tx = await contract.someFunction();
          console.log("Transaction sent:", tx);
          await tx.wait();
          console.log("Transaction confirmed:", tx);
        } catch (error) {
          console.error("Error calling contract:", error);
        }
      } else {
        console.log("Please connect your wallet first.");
      }
    },
    async phaseFirst() {
      // Добавьте логику для депозита токенов
    },
    async makeTrust() {
      // Логика для создания доверия
    }
  },
};
</script>


<style scoped>
.page-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.wallet-connect {
  text-align: center;
  margin-bottom: 20px;
}

.connect-button, .action-button {
  background-color: #6a1b9a; /* Фиолетовый */
  color: white;
  border: none;
  padding: 15px 32px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 10px;
}

.connect-button:hover, .action-button:hover {
  background-color: #9c4dcc; /* Светлый фиолетовый */
}

.form-container {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 20px;
  font-size: 20px;
  color: #333;
}

.input-field {
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.input-field:focus {
  border-color: #6a1b9a; /* Фиолетовый */
  outline: none;
}
</style>
