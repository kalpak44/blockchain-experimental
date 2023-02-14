# Backend Project for Retrieving Payments from Blockchain by Payment ID

This is a small Node.js backend project that allows you to retrieve payments from a blockchains by their payment ID. 

## Prerequisites

Before you can use this project, you will need to have the following:

- Node.js installed on your system
- Access to a blockchain JSON-RPC API  (you can use [alchemy](https://www.alchemy.com/)) or another you prefer
- You already have your own deployed IERC 20 token 
- You use mechanism appending payment id provided in [this frontend](../frontend)

## Installation

To install this project, simply clone the repository to your local machine and run the following command:

```shell
$ npm install
```

This will install all the required dependencies for the project.

# Usage

To use the project, you will need to first configure it with your blockchain API credentials.  Set your system environment variables:

```shell
export ETH_RPC_URL=https://your-eth-rpc/
export ETH_TOKEN_ADDRESS=token address
export ETH_RECIPIENT_ADDRESS=payments recipient address
export ETH_TX_EXPLORER=https://etherscan.io
```

Once you have configured the project, you can start the server by running the following command:

```shell
npm start
```

This will start the server on port 3000.

To retrieve payments from the blockchain by payment ID, simply send a GET request to the following endpoint:

```shell
http://localhost:3000/payments/:paymentId
```

Replace :paymentId with the ID of the payment you want to retrieve. The server will return the payment details in JSON format.
