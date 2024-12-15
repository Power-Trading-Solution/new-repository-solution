<script setup>
import { ref } from 'vue'
import { ethers, formatEther } from "ethers"
import { Web3 } from "web3"
const web3 = new Web3(window.ethereum);


// Адреса контрактов и ABI
const address = ref("0x...")
const balance = ref(0n)
const owner = ref("0x...")
const tokenAddress = ref("0x...") // Адрес токена, который вы хотите обменять
const swapRouterAddress = "0x5C69bEe701ef814a2B6a3EDD3B8b3D3e6C5F20C4" // Адрес Uniswap Router для Ethereum Mainnet

const abi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_unlockTime",
          "type": "uint256"
        }
      ],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "when",
          "type": "uint256"
        }
      ],
      "name": "Withdrawal",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "setUnlockTime",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unlockTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
  const lockAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

// Подключение к MetaMask и получение данных
/*const connect = () => new Promise(async () => {
  try {
    const client = new ethers.BrowserProvider(window.ethereum)
    const signer = await client.getSigner()
    address.value = await signer.getAddress()
    balance.value = await signer.provider.getBalance(address.value)
    const lockContract = new ethers.Contract(lockAddress, abi, signer)
    owner.value = await lockContract.getOwner();
  } catch (error) {
    console.error("Ошибка при подключении:", error)
    alert('Ошибка при подключении к MetaMask')
  }
})*/

async function connectMetaMask() {
    if (window.ethereum) {
        try {
            // Запрашиваем доступ к аккаунту пользователя
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            address.value = accounts[0];
            console.log("Connected account:", address.value);

            // Здесь вы можете получить другие данные, например, баланс
            balance.value = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [address.value, 'latest']
            });
            console.log("Balance:", balance);

            const client = new ethers.BrowserProvider(window.ethereum);
            const signer = await client.getSigner()

            const lockContract = new ethers.Contract(lockAddress, abi, signer);

            const owner = await lockContract.owner();
            console.log("Owner address:", owner);
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
        }
    } else {
        console.error("MetaMask is not installed!");
    }

    /*const contract = new web3.eth.Contract(abi, address);

    try {
        // Получение адреса владельца
        const owner = await contract.methods.owner().call();
        console.log("Owner address:", owner);
    } catch (error) {
        console.error("Error getting owner:", error);
    }*/
}

// Вызываем функцию подключения


// Функция для обмена токенов через Uniswap
const swapTokens = async () => {
  try {
    // Проверка, что токен и адрес контракта существуют
    if (!tokenAddress.value || tokenAddress === ref("0x...")) {
      alert('Адрес токена не указан или некорректен.')
      return
    }

    // Определяем параметры обмена
    const amountIn = ethers.parseUnits("1", 18) // Пример: 1 токен для обмена (18 десятичных знаков)
    const amountOutMin = ethers.parseUnits("0.9", 18) // Минимальное количество токенов, которые мы хотим получить (с учетом slippage)
    const path = [tokenAddress.value, lockAddress] // Путь обмена (например, токен -> ETH)
    const to = address.value // Адрес получателя (ваш адрес)
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // Дедлайн транзакции (например, 20 минут)

    // Проверка, что MetaMask подключен
    if (!window.ethereum) {
      alert('MetaMask не подключен.')
      return
    }

    const client = new ethers.BrowserProvider(window.ethereum)
    const signer = await client.getSigner()

    const router = new ethers.Contract(lockAddress, abi, signer)

    // Разрешение токенов для обмена
    const tokenContract = new ethers.Contract(tokenAddress.value, ["function approve(address spender, uint256 amount) public returns (bool)"], signer)
    await tokenContract.approve(lockAddress, amountIn)

    // Выполнение обмена
    const tx = await router.swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline)
    await tx.wait()

    alert('Токены успешно обменяны!')
  } catch (error) {
    console.error("Ошибка при обмене токенов:", error)
    alert('Ошибка при обмене токенов')
  }
}

const count = ref(0)

defineProps({
  msg: String,
})
</script>

<template>
  <div>
    <h1>you are {{ address }}</h1>
    <h2>balance: {{ formatEther(balance) }}</h2>
    <h2>owner: {{ owner }}</h2>
    <button @click="connectMetaMask">
      Connect
    </button>
    <button @click="swapTokens">
      Swap Tokens
    </button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
