<template>
    <main class="main-page">
      <section class="wallet-info">
        <h2>Wallet Info</h2>
        <div class="info">
          <p><strong>Address:</strong> {{ address }}</p>
          <p><strong>Balance:</strong> {{ formattedBalance }} ETH</p>
          <p><strong>Owner:</strong> {{ owner }}</p>
        </div>
      </section>
    </main>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { ethers, formatEther } from 'ethers'
  
  const address = ref('')
  const balance = ref(0)
  const owner = ref('')
  
  const formattedBalance = computed(() => {
    return formatEther(balance.value)
  })
  
  // Функция для подключения к MetaMask и получения данных
  const connect = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed!')
      return
    }
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      // Получаем адрес кошелька
      address.value = await signer.getAddress()
      
      // Получаем баланс
      balance.value = await signer.provider.getBalance(address.value)
      
      // Получаем владельца (для примера, используем контракт)
      const contractAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'  // Пример адреса контракта
      const abi = [
        {
          "constant": true,
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }
      ]
      const contract = new ethers.Contract(contractAddress, abi, signer)
      owner.value = await contract.owner()
    } catch (error) {
      console.error('Error connecting to MetaMask:', error)
    }
  }
  
  onMounted(() => {
    if (window.ethereum) {
      // Подключаемся при монтировании, если MetaMask доступен
      connect()
    }
  })
  </script>
  
  <style scoped>

  .main-page {
    padding: 20px;
    background-color: #090612;
  }
  
  .info {
    padding: 20px;
    background-color: #090612;
  }

  .wallet-info {
    background-color: #090612;
    padding: 20px;
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .wallet-info h2 {
    color: white;
    margin-top: 0;
  }
  
  .wallet-info .info {
    color: white;
    font-size: 1.1em;
  }
  
  .wallet-info .info p {
    color: white;
    margin: 10px 0;
  }
  </style>
  