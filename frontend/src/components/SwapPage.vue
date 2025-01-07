<template>
    <div class="page-container">
      <div class="wallet-connect">
        <button v-if="!connected" class="connect-button" @click="connect">Подключить кошелек</button>
      </div>
  
      <div v-if="connected" class="form-container">
        <h2>Swap Tokens</h2>
        <button @click="phaseSecond" class="action-button">Phase Second: Swap Tokens</button>
        <button @click="phaseThird" class="action-button">Phase Third: Stop Trading</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { ethers } from 'ethers';
  
  // Замените на ваш ABI и адрес контракта
  const contractAddress = '0xYourContractAddress';
  const abi = [/* Ваш ABI для контракта */];
  
  export default {
    data() {
      return {
        connected: false,
        address: null,
        balance: null,
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
      async phaseSecond() {
        if (this.connected) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(contractAddress, abi, signer);
  
          try {
            // Логика для второго этапа: обмен токенов
            const tx = await contract.swapTokens();
            console.log("Transaction sent:", tx);
            await tx.wait();
            console.log("Transaction confirmed:", tx);
          } catch (error) {
            console.error("Error in phaseSecond:", error);
          }
        } else {
          console.log("Please connect your wallet first.");
        }
      },
      async phaseThird() {
        if (this.connected) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(contractAddress, abi, signer);
  
          try {
            // Логика для третьего этапа: остановить торговлю
            const tx = await contract.stopTrading();
            console.log("Transaction sent:", tx);
            await tx.wait();
            console.log("Transaction confirmed:", tx);
          } catch (error) {
            console.error("Error in phaseThird:", error);
          }
        } else {
          console.log("Please connect your wallet first.");
        }
      }
    }
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
  </style>
  