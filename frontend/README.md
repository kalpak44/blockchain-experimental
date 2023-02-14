# Frontend Project for Creating Payments on Blockchain

This is a small frontend project that allows you to create payments on a blockchain with the click of a button. 

# Prerequisites

Before you can use this project, you will need to have the following:

- Node.js installed on your system
- You already have your own deployed IERC 20 token

# Installation

To install this project, simply clone the repository to your local machine and run the following command:

```shell
$ npm install
```

This will install all the required dependencies for the project.

# Usage

To use the project, you will need to first configure it with configuring your token address in [[PaymentButton.js](src/components/PaymentButton.js)]

Once you have configured the project, you can start the server by running the following command:

```shell
npm start
```

This will start the server on port 3000.

By opening any browse you will se a button. On click event it will create a payment with id and tokens amount configured in props.

example:

```javascript
<PaymentButton paymentId='my-payment-id' amount={1000000}>Pay</PaymentButton>
```
