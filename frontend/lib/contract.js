export const contractAddress = "0x71AB918c48046B6b8195e347b9ECFEedC9028272";
export const contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "subscriber",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "serviceName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "paymentTime",
          "type": "uint256"
        }
      ],
      "name": "PaymentLogged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "subscriber",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "serviceName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "nextPaymentDue",
          "type": "uint256"
        }
      ],
      "name": "Subscribed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "subscriber",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "serviceName",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "cancelTime",
          "type": "uint256"
        }
      ],
      "name": "SubscriptionCancelled",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_serviceName",
          "type": "string"
        }
      ],
      "name": "cancelSubscription",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMySubscriptions",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "serviceName",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "duration",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "nextPaymentDue",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "active",
              "type": "bool"
            }
          ],
          "internalType": "struct SubscriptionManager.Subscription[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_serviceName",
          "type": "string"
        }
      ],
      "name": "logPayment",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_serviceName",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_duration",
          "type": "uint256"
        }
      ],
      "name": "subscribe",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "subscriptions",
      "outputs": [
        {
          "internalType": "string",
          "name": "serviceName",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "duration",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "nextPaymentDue",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]