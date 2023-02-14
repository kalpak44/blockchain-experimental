const Web3 = require("web3");
const abi = require("./ierc20Abi");
const express = require('express')
const app = express()
const port = 3000

require('dotenv').config()

const contractDeployments = [
    {
        network: 'eth',
        url: process.env.ETH_RPC_URL,
        address: process.env.ETH_TOKEN_ADDRESS,
        recipient: process.env.ETH_RECIPIENT_ADDRESS,
        txExplorer: process.env.ETH_TX_EXPLORER
    },
     {
         network: 'polygon',
         url: process.env.POLYGON_RPC_URL,
         address: process.env.POLYGON_TOKEN_ADDRESS,
         recipient: process.env.POLYGON_RECIPIENT_ADDRESS,
         txExplorer: process.env.POLYGON_TX_EXPLORER
     },
     {
         network: 'bsc',
         url: process.env.BSC_RPC_URL,
         address: process.env.BSC_TOKEN_ADDRESS,
         recipient: process.env.BSC_RECIPIENT_ADDRESS,
         txExplorer: process.env.BSC_TX_EXPLORER
     },
]


app.get('/payments/:id', async (req, res) => {
    const id = req.params.id;
    if(!id) {
        return res.status(400).send({status: 400, message: "please provide id as a path parameter"})
    }

    const payments = [];
    const blockchains = contractDeployments.filter(n=> n.url && n.network && n.recipient && n.address && n.txExplorer);
    if(blockchains.length === 0){
        return res.status(500).send({status: 500, message: "application is not configured properly"})
    }

    for (let blockchain of blockchains) {
        try {
            const web3 = new Web3(new Web3.providers.HttpProvider(blockchain.url));
            const contract = new web3.eth.Contract(abi, blockchain.address);
            const events = await contract.getPastEvents("Transfer", {
                filter: {to: blockchain.recipient},
                fromBlock: 0,
                toBlock: "latest"
            });

            for (let event of events) {
                const transaction = await web3.eth.getTransaction(event.transactionHash);
                const inputData = transaction.input;
                const paymentId = web3.utils.hexToAscii('0x' + inputData.substring(inputData.length - 64)).replace(/\0/g, '');

                if (paymentId && paymentId  === id) {
                    const blockNumber = await web3.eth.getBlockNumber();
                    const block = await web3.eth.getBlock(blockNumber);
                    payments.push({
                        txId: event.transactionHash,
                        txIdUrl: `${blockchain.txExplorer}/tx/${event.transactionHash}`,
                        blockHash: transaction.blockHash,
                        blockNumber: transaction.blockNumber,
                        network: blockchain.network,
                        isValid: event.returnValues.to === blockchain.recipient,
                        sender: event.returnValues.from,
                        tokensAmount: event.returnValues.value,
                        paymentId: paymentId,
                        validationsCount: blockNumber - transaction.blockNumber + 1,
                        validatedAt: new Date(block.timestamp  * 1000)
                    });
                }
            }

        } catch (e) {
            console.log(e)
            return res.status(500).send({status: 500, message: e.message})
        }
    }
    if (payments.length === 0) {
        return res.status(404).send({status: 404, message: `payment '${id}' was not found`});
    } else {
        res.status(200).send({
            status: 200,
            data: payments
        })
    }
})


app.get('/health', async (req, res) => {
    try {
        const healthChecks = []
        for (let node of contractDeployments) {
            try {
                const web3 = new Web3(new Web3.providers.HttpProvider(node.url));
                const contract = new web3.eth.Contract(abi, node.address);

                healthChecks.push({
                    symbol: await contract.methods.symbol().call(),
                    network: node.network,
                    address: node.address,
                    status: 'UP'
                })
            } catch (e) {
                healthChecks.push({network: node.network, address: node.address, status: 'DOWN', message: e.message})
            }
        }
        if (healthChecks.length === 0 && contractDeployments.length !== 0) {
            for (let node of contractDeployments) {
                const web3 = new Web3(new Web3.providers.HttpProvider(node.url));
                const contract = new web3.eth.Contract(abi, node.address);
                await contract.methods.symbol().call()
            }
        }
        return res.status(200).send(healthChecks)
    } catch (e) {
        console.error(e)
        return res.status(500).send({status: 500, message: e.message})
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})