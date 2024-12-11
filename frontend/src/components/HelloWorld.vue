<script setup>
import { ref } from 'vue'
import { ethers, formatEther } from "ethers"

// Адреса контрактов и ABI
const address = ref("0x...")
const balance = ref(0n)
const owner = ref("0x...")
const tokenAddress = ref("0x...") // Адрес токена, который вы хотите обменять
const swapRouterAddress = "0x5C69bEe701ef814a2B6a3EDD3B8b3D3e6C5F20C4" // Адрес Uniswap Router для Ethereum Mainnet

const abi = [
  // ABI для контракта
  {
    "constant": false,
    "inputs": [
      {
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "name": "path",
        "type": "address[]"
      },
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactTokensForTokens",
    "outputs": [
      {
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

const lockAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

// Подключение к MetaMask и получение данных
const connect = () => new Promise(async () => {
  try {
    const client = new ethers.BrowserProvider(window.ethereum)
    const signer = await client.getSigner()
    address.value = await signer.getAddress()
    balance.value = await signer.provider.getBalance(address.value)
    const lockContract = new ethers.Contract(lockAddress, abi, signer)
    owner.value = await lockContract.owner()
  } catch (error) {
    console.error("Ошибка при подключении:", error)
    alert('Ошибка при подключении к MetaMask')
  }
})

// Функция для обмена токенов через Uniswap
const swapTokens = async () => {
  try {
    // Проверка, что токен и адрес контракта существуют
    if (!tokenAddress.value || tokenAddress.value === "0x...") {
      alert('Адрес токена не указан или некорректен.')
      return
    }

    // Определяем параметры обмена
    const amountIn = ethers.utils.parseUnits("1", 18) // Пример: 1 токен для обмена (18 десятичных знаков)
    const amountOutMin = ethers.utils.parseUnits("0.9", 18) // Минимальное количество токенов, которые мы хотим получить (с учетом slippage)
    const path = [tokenAddress.value, "0x5C69bEe701ef814a2B6a3EDD3B8b3D3e6C5F20C4"] // Путь обмена (например, токен -> ETH)
    const to = address.value // Адрес получателя (ваш адрес)
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // Дедлайн транзакции (например, 20 минут)

    // Проверка, что MetaMask подключен
    if (!window.ethereum) {
      alert('MetaMask не подключен.')
      return
    }

    const client = new ethers.BrowserProvider(window.ethereum)
    const signer = await client.getSigner()

    const router = new ethers.Contract(swapRouterAddress, abi, signer)

    // Разрешение токенов для обмена
    const tokenContract = new ethers.Contract(tokenAddress.value, ["function approve(address spender, uint256 amount) public returns (bool)"], signer)
    await tokenContract.approve(swapRouterAddress, amountIn)

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
    <button @click="connect">
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
