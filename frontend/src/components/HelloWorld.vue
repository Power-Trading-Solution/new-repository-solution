<template>
  <div>
      <!-- connect-wallet button is visible if the wallet is not connected -->
    <button v-if="!connected" @click="connect">Connect wallet</button>
      <!-- call-contract button is visible if the wallet is connected -->
    <button v-if="connected" @click="callContract">Call contract</button>

    <div v-if="connected">
        <input v-model="tokenAddress" placeholder="Address of tokens" />
        <input v-model="tokenAmount" placeholder="Amount of tokens" /> 
        <button @click="phaseFirst">Deposit tokens (phase first)</button>
    </div>
    
    <div v-if="connected">
      <input v-model="managerAddress" placeholder="Manager address" />
      <input v-model="trustDuration" placeholder="Trust duration" />
      <input v-model="managerCommission" placeholder="Manager commission (%)" />
      <button  @click="makeTrust">Make trust</button>
    </div>
    
    <button v-if="connected" @click="phaseSecond">Phase second</button>
    <button v-if="connected" @click="phaseThird">Phase third</button>
  </div>
</template>

<script>
  import { ref } from 'vue'
  import { ethers, formatEther } from "ethers"
  import { Web3 } from "web3"
  const web3 = new Web3('http://127.0.0.1:8545');
  //web3.eth.accounts.wallet.add('ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');

  const abiManager = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "router1",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "t0",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "t1",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "t2",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "t3",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "t4",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_tokenUSDS",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
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
          "indexed": false,
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokensReceived",
      "type": "event"
    },
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
          "name": "user",
          "type": "address"
        }
      ],
      "name": "TradingStarted",
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
        },
        {
          "internalType": "uint256",
          "name": "_commission",
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
          "internalType": "uint256",
          "name": "durationInDays",
          "type": "uint256"
        }
      ],
      "name": "startTrading",
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
        },
        {
          "internalType": "address",
          "name": "manager",
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
        },
        {
          "internalType": "uint256",
          "name": "amountOutMin",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
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
          "internalType": "uint256",
          "name": "commission",
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

  const managerContractAddress = '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6';
  const tokenFirstAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
  const tokenSecondAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';

  const tokenABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "initialSupply",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_tokensPerLETH",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_tokensPerUSDS",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_tokensPerMTS",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_tokensPerATT",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_tokensPerATF",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_tokensPerLTF",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "allowance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientAllowance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "needed",
          "type": "uint256"
        }
      ],
      "name": "ERC20InsufficientBalance",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "ERC20InvalidSpender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
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
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
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
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "buyTokens",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokensPerATF",
          "type": "uint256"
        }
      ],
      "name": "setTokensPerATF",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokensPerATT",
          "type": "uint256"
        }
      ],
      "name": "setTokensPerATT",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokensPerLETH",
          "type": "uint256"
        }
      ],
      "name": "setTokensPerLETH",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokensPerLTF",
          "type": "uint256"
        }
      ],
      "name": "setTokensPerLTF",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokensPerMTS",
          "type": "uint256"
        }
      ],
      "name": "setTokensPerMTS",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokensPerUSDS",
          "type": "uint256"
        }
      ],
      "name": "setTokensPerUSDS",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokensPerATF",
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
      "name": "tokensPerATT",
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
      "name": "tokensPerLETH",
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
      "name": "tokensPerLTF",
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
      "name": "tokensPerMTS",
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
      "name": "tokensPerUSDS",
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
      "name": "totalSupply",
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
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const ERC20_ABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "initialSupply",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "allowance",
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
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
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
      "name": "balanceOf",
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
      "name": "totalSupply",
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
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];


  var signer = null
  //var managerSigner = null
  var provider

  //const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
  //const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  export default {

    data() {
      return {
        connected: false,
        address: ref("0x..."),
        balance: ref(0n),
        contractResult: null,
        //manager: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293B",
        tokenAddress: '',
        tokenAmount: '',
        managerAddress: '',
        trustDuration: null,
        managerCommission: null,
        managerContract: null
        //signer: null
      }
    },

    methods: {

      connect() {   
        if (window.ethereum) { 
          window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(async () => {

              provider = new ethers.BrowserProvider(window.ethereum)
              signer = await provider.getSigner()
              this.connected = true; 

              this.address = signer.address;
              console.log(this.address)
              this.balance = await signer.provider.getBalance(this.address)
              console.log(this.balance)

              this.managerContract = new ethers.Contract(managerContractAddress, abiManager, signer)
            })
            .catch(error => {
              console.log(error);
            });
        }
      },
      async callContract() {
        const newContract = new ethers.Contract(tokenFirstAddress, tokenABI, signer)

        const recipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"

        const amount = ethers.parseUnits('10', 18);

        //const accounts = await web3.eth.getAccounts();

        //console.log(accounts)
        

        const tx = await newContract.transfer(recipient, amount);
        console.log('Транзакция отправлена:', tx.hash);
    
        await tx.wait();
        console.log('Транзакция подтверждена!');
        
      },
      async makeTrust() {
        ;

        const result1 = await this.managerContract.trusts(this.address);
        console.log(result1)

        const manager = this.managerAddress;
        const commission = parseInt(this.managerCommission);
        const duration = parseInt(this.trustDuration);
        await this.managerContract.createTrust(manager, duration, commission); 
        const result2 = await this.managerContract.trusts(this.address);
      
    
      },
      async phaseFirst() {

        //const token = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
        //const amount = ethers.parseUnits("8", 18);
        //const amount = web3.utils.toWei(8, 'ether');

        //const managerContract = new ethers.Contract(managerContractAddress, abiManager, signer)
        const tokenContractSigner = new ethers.Contract(token, ERC20_ABI, signer)

        const token = this.tokenAddress;
        const amount = web3.utils.toWei(this.tokenAmount.trim(), 'ether');

        //const approveTx = await tokenContractSigner.approve(managerAddress, amount);
        //await approveTx.wait(); // Ждем подтверждения транзакции

        const tx = await this.managerContract.depositTokens(token, amount)
        await tx.wait(); 

        //const managerBalance = await managerContract.getContractBalance(managerAddress)
        //const managerBalance = await signer.provider.getBalance(managerAddress)
              //console.log(this.balance)

        const tokenContractProvider = new ethers.Contract(token, ERC20_ABI, provider)
        const managerBalance = await tokenContractProvider.balanceOf(managerContractAddress);
        console.log(managerBalance)

      },
      async phaseSecond() {
        const amountIn = web3.utils.toWei(5, 'ether');
        const amountOut = web3.utils.toWei(1000, 'ether');

        const token1 = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
        //const managerContract = new ethers.Contract(managerContractAddress, abiManager, signer);

        const tokenContractSigner = new ethers.Contract(token1, ERC20_ABI, signer)

        /*const tokenContract = new web3.eth.Contract(ERC20_ABI, token1);
        await tokenContract.methods.approve("0xa513E6E4b8f2a923D98304ec87F64353C4D5C853", amountIn).call();*/
        const approveTx = await tokenContractSigner.approve("0xa513E6E4b8f2a923D98304ec87F64353C4D5C853", amountIn);
        await approveTx.wait(); // Ждем подтверждения транзакции
        
        const tradeResultPleaseWork = await this.managerContract.tradeTokens(tokenFirstAddress, tokenSecondAddress, amountIn, amountOut, '0x976EA74026E726554dB657fA54763abd0C3a0aa9');
      },
      phaseThird() {
        //const managerContract = new ethers.Contract(managerContractAddress, abiManager, signer);
        this.managerContract.stopTrading('0x976EA74026E726554dB657fA54763abd0C3a0aa9', this.address);
      }
      
    }

 
  }
</script>