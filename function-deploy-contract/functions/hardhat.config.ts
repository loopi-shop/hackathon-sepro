require('@nomiclabs/hardhat-ethers');

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    defaultNetwork: 'mumbai',
    networks: {
        besus: {
            url: 'http://localhost:8545',
            accounts: [process.env.PRIVATE_KEY],
        },
        hardhat: {
            allowUnlimitedContractSize: true,
        },
        local: {
            chainId: 137,
            url: 'http://localhost:8080',
            accounts: [process.env.PRIVATE_KEY],
        },
        mumbai: {
            chainId: 80001,
            url: 'https://polygon-mumbai.g.alchemy.com/v2/2k-VMVnqyahxFQyES-EljaUDRbYAxHJM',
            accounts: [process.env.PRIVATE_KEY],
        },
        polygon: {
            chainId: 137,
            url: 'https://polygon-rpc.com',
            accounts: [process.env.PRIVATE_KEY],
        },
        tenderly: {
            url: `https://rpc.tenderly.co/fork/${process.env.TENDERLY_FORK_ID ?? ''}`,
            accounts: [process.env.PRIVATE_KEY],
        },
    },
    solidity: {
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
        version: '0.8.19',
    },
};
