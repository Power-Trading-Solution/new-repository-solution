<!-- <template>
  <div>
  <button v-if="!connected" @click="connect">Connect wallet</button>
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
</script> -->


<template>
  <div>
    <button v-if="!connected" @click="connect">Connect wallet</button>
    <button v-if="connected" @click="callContract">Call contract</button>
    <p>Connected Address: {{ address }}</p>
    <button v-if="connected" @click="getAccounts">Show All Accounts</button>
    <div v-if="accounts.length">
      <p>Available Accounts:</p>
      <pre>{{ accounts }}</pre>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ethers } from 'ethers';

export default {
  data() {
    return {
      connected: false,
      address: null,
      accounts: [], // To store all accounts
      contractResult: null,
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
          this.connected = true;
          console.log("Connected address:", this.address);
        } catch (error) {
          console.error("Connection failed:", error);
        }
      }
    },
    async getAccounts() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        try {
          const accounts = await provider.listAccounts();
          this.accounts = accounts;
          console.log("Available accounts:", accounts);
        } catch (error) {
          console.error("Failed to fetch accounts:", error);
        }
      }
    },
    async callContract() {
      // Your logic for interacting with contracts
    }
  }
};
</script>
