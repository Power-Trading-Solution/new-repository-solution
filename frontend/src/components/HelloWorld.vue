<template>
  <div>
    <!-- connect-wallet button is visible if the wallet is not connected -->
  <button v-if="!connected" @click="connect">Connect wallet</button>
    <!-- call-contract button is visible if the wallet is connected -->
    <button v-if="connected" @click="callContract">Call contract</button>
    {{ contractResult }}
  </div>
</template>

<script>
  import { ref } from 'vue'
  import { ethers, formatEther } from "ethers"
  import { Web3 } from "web3"
  const web3 = new Web3('https://rpc2.sepolia.org');
  //web3.eth.accounts.wallet.add('ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');

  const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "manager",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokensDeposited",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "manager",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "expiry",
          "type": "uint256"
        }
      ],
      "name": "TradingEnabled",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "manager",
          "type": "address"
        }
      ],
      "name": "TradingStopped",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "manager",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "durationInDays",
          "type": "uint256"
        }
      ],
      "name": "createTrust",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "depositTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "stopTrading",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenIn",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "tokenOut",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        }
      ],
      "name": "tradeTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "trusts",
      "outputs": [
        {
          "internalType": "address",
          "name": "manager",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "expiry",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  const contractAddress = '0xe0ef94bcb8da9dfe2e4604c2e01e31d6828df6bbd48357884f67bd8c320e9f0f';
  var signer = null
  var managerSigner = null

  const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
  const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  export default {

    data() {
      return {
        connected: false,
        address: ref("0x..."),
        balance: ref(0n),
        contractResult: null,
        manager: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        //signer: null
      }
    },

    methods: {

      connect() {   
        if (window.ethereum) { 
          window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(async () => {
              const client = new ethers.BrowserProvider(window.ethereum)
              signer = await client.getSigner()
      
              this.connected = true; 
              this.address =  await signer.getAddress();
              console.log(this.address)
              this.balance = await signer.provider.getBalance(this.address)
              console.log(this.balance)
            })
            .catch(error => {
              console.log(error);
            });
        }
      },
      async callContract() {
        console.log(this.address)
        const newContract = new ethers.Contract(contractAddress, abi, this.address)
        const result = await newContract.getAddress();
        console.log(result)
        /*const duration = 7
        await newContract.connect(this.address).createTrust(this.manager, duration);
        const trust = await newContract.trusts(this.address);
        console.log(trust)*/
        web3.eth.sendTransaction({to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", value: web3.utils.toWei("7", 'ether'), gas: "499529368010000"});
        /*.then(async () => {
          
        })
        .catch(error => {
          console.log(error);
        });*/
        
      }
      
    }

 
  }
</script>



<!-- <script setup>

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
 -->

