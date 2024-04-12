export const MUNUS_ABI = [
    {
      "type": "function",
      "name": "secrets",
      "inputs": [
        {
          "name": "",
          "type": "bytes32",
          "internalType": "bytes32"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "trampoline",
      "inputs": [
        {
          "name": "hash",
          "type": "bytes32",
          "internalType": "bytes32"
        },
        {
          "name": "payout",
          "type": "address",
          "internalType": "address payable"
        }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "event",
      "name": "DonationReceived",
      "inputs": [
        {
          "name": "receiver",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "hash",
          "type": "bytes32",
          "indexed": false,
          "internalType": "bytes32"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "SecretAlreadyUsed",
      "inputs": []
    },
    {
      "type": "error",
      "name": "TransferFailed",
      "inputs": []
    }
  ] as const;

export const ORACLE_ABI = [
  {
    "inputs": [],
    "name": "baseFee",
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
    "name": "baseFeeScalar",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "blobBaseFee",
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
    "name": "blobBaseFeeScalar",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "l1BaseFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;