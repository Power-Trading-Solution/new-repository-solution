<script setup>
import { ref } from 'vue'
import {ethers, formatEther} from "ethers"

const address = ref("0x...")
const balance = ref(0n)
const owner = ref("0x...")

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
  const lockAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

const connect = () => new Promise(async () => {
  const client = new ethers.BrowserProvider(window.ethereum)
  const signer = await client.getSigner()
  address.value = await signer.getAddress()
  balance.value = await signer.provider.getBalance(address.value)
  const lockContract = new ethers.Contract(lockAddress, abi, signer)
  owner.value = await lockContract.owner()
})

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
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>