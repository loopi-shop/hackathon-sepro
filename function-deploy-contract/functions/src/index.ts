import { onRequest } from 'firebase-functions/v2/https';
import express, { Request, Response } from 'express';
// @ts-ignore
import { ethers, network, run } from 'hardhat';
import DefaultCompliance from '../contracts/DefaultCompliance.json';
import Receivable from '../contracts/Receivable.json';

const app = express();

app.use((req, res, next) => {
    next();
});

app.post('', async (req: Request, res: Response) => {
    const [deployer] = await ethers.getSigners();
    const defaultComplianceFactory = await ethers.getContractFactoryFromArtifact(DefaultCompliance, deployer);

    const defaultCompliance = await defaultComplianceFactory.deploy();

    console.log(`Deployed defaultCompliance at ${defaultCompliance.address}`);
    console.log(`(tx hash: ${defaultCompliance.deployTransaction.hash})`);

    await defaultCompliance.deployTransaction.wait(1);

    const {
        decimals,
        endTimestamp,
        endPoolTimestamp,
        identityRegistry,
        name,
        maxAssets,
        minAssets,
        minDeposit,
        stableToken,
        startTimestamp,
        symbol,
        yieldPercentage,
    } = req.body;

    const params = [
        name,
        symbol,
        decimals,
        stableToken,
        yieldPercentage,
        [startTimestamp, endTimestamp, endPoolTimestamp, minDeposit, minAssets, maxAssets],
        identityRegistry,
        defaultCompliance.address,
        ethers.constants.AddressZero,
    ];

    console.log('Trying to deploy token with the following params:', JSON.stringify(params));

    const tokenContractFactory = await ethers.getContractFactoryFromArtifact(Receivable, deployer);
    const tokenImplementation = await tokenContractFactory.deploy(...params, { gasLimit: 7000000 });

    console.log(`Deployed Token at ${tokenImplementation.address}`);
    console.log(`(tx hash: ${tokenImplementation.deployTransaction.hash})`);

    await tokenImplementation.deployTransaction.wait(1);

    const addedAgent = await tokenImplementation.connect(deployer).addAgent(deployer.address);

    console.log(`Added agent ${deployer.address} to Token ${tokenImplementation.address}`);
    console.log(`(tx hash: ${addedAgent.hash})`);

    res.json({
        defaultCompliance: defaultCompliance.address,
        tokenImplementation: tokenImplementation.address,
    });
});

exports.deploy = onRequest(app);
