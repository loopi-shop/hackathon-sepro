import { onRequest } from 'firebase-functions/v2/https';
import express, { Request, Response } from 'express';
import cors from 'cors';
// @ts-ignore
import { ethers, network, run } from 'hardhat';
import { exec } from 'child_process';

const app = express();

app.use(cors({ origin: true }));

app.use((req, res, next) => {
    next();
});

app.post('', async (req: Request, res: Response) => {
    const {
        blockListCountryCode,
        decimals,
        duration,
        identityRegistry,
        name,
        maxAssets,
        stableToken,
        startTimestamp,
        symbol,
        yieldPercentage,
    } = req.body;

    const [deployer] = await ethers.getSigners();
    const defaultComplianceFactory = await ethers.getContractFactory('ComplianceTpft', deployer);

    const defaultCompliance = await defaultComplianceFactory.deploy(blockListCountryCode);

    console.log(`Deployed defaultCompliance at ${defaultCompliance.address}`);
    console.log(`(tx hash: ${defaultCompliance.deployTransaction.hash})`);

    await defaultCompliance.deployTransaction.wait(1);

    const params = [
        name,
        symbol,
        decimals,
        startTimestamp,
        duration,
        stableToken,
        yieldPercentage,
        maxAssets,
        identityRegistry,
        defaultCompliance.address,
        ethers.constants.AddressZero,
    ];

    console.log('Trying to deploy token with the following params:', JSON.stringify(params));

    const tokenContractFactory = await ethers.getContractFactory('FederalPublicTitlePermissioned', deployer);
    const tokenImplementation = await tokenContractFactory.deploy(...params, { gasLimit: 7000000 });

    console.log(`Deployed Token at ${tokenImplementation.address}`);
    console.log(`(tx hash: ${tokenImplementation.deployTransaction.hash})`);

    await tokenImplementation.deployTransaction.wait(1);

    verifyContract(tokenImplementation.address, params)
        .catch((error) => console.log(error));

    res.json({
        defaultCompliance: defaultCompliance.address,
        tokenImplementation: tokenImplementation.address,
    });
});

const verifyContract = async (contractAddress: string, args: any[]) => {
    const chainId = network.config.chainId!;

    if (chainId !== 137 && chainId !== 80001) return;

    console.log('Verifying contract...');

    try {
        const command = `npx hardhat verify:verify --address ${contractAddress} --constructor-args ${args.join(',')}`;

        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
            } else {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            }
        });
    } catch (error: any) {
        if (error.message.toLowerCase().includes('already verified')) {
            console.log('Already verified!');
        } else {
            console.log(error);
        }
    }
};

exports.deploy = onRequest({ memory: '512MiB', timeoutSeconds: 300 }, app);
