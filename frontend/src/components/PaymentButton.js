import React from "react";
import Web3 from "web3";
import abi from "./ierc20Abi"

function PaymentButton({children, paymentId, amount}) {
    async function pay() {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
                paymentId = paymentId ? paymentId : '';
                const tokenAddresses = {
                    5: "0x36b2324be26AFAd03B1835b91AE018AB64689dF6", // goerli token address
                    80001: "0xFbf36eeA9D9B121B4fc35e2C02aed6e2E47486F4" // polygon mumbai token address
                }
                const recipientAddresses = {
                    5: "0x4F4B588FEA9484Ae399d44BDA234BbBc6ac7a6a6", // goerli payments recipient
                    80001: "0xFbf36eeA9D9B121B4fc35e2C02aed6e2E47486F4" //  polygon payments recipient
                }

                const tokensCount = amount;

                // Request account access if needed
                await window.ethereum.enable();
                const accounts = await web3.eth.getAccounts();
                const myAccount = accounts[0];
                const networkId = await web3.eth.net.getId();

                const contractAddress = tokenAddresses[networkId];
                const recipientAddress = recipientAddresses[networkId];

                if (contractAddress) {
                    const contract = new web3.eth.Contract(abi, contractAddress);
                    const transferData = await contract.methods.transfer(recipientAddress, tokensCount);
                    const transferDataWithPaymentId = `${transferData.encodeABI()}${web3.eth.abi.encodeParameter("string", paymentId).slice('0x'.length)}`;

                    const gasPrice = await web3.eth.getGasPrice();
                    const nonce = await web3.eth.getTransactionCount(myAccount);

                    const transaction = {
                        from: myAccount,
                        to: contractAddress,
                        data: transferDataWithPaymentId,
                        gasPrice: gasPrice,
                        nonce: nonce
                    };

                    const transactionHash = await web3.eth.sendTransaction(transaction);
                    console.log("Transaction Hash:", transactionHash);

                } else {
                    console.error("token address was not found. please check cfg");
                }

            } catch (error) {
                console.error(error);
            }
        } else {
            console.error('no wallet was found')
        }
    }

    return (
        <div>
            <button onClick={pay}>
                {children}
            </button>
        </div>
    );
}

export default PaymentButton;
