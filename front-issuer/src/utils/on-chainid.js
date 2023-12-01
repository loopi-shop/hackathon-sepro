import { ethers } from 'ethers';
import { IdentitySDK } from '@onchain-id/identity-sdk';
import {arrayify} from './ethersjs-bytes';
import KycManagerAbi from '../abis/kyc-manager-abi.json';

/**
 * @param publicKey {string}
 * @param countryCode {number}
 *
 * @return {Promise<{clientIdentityAddress: string, transactionHash: string}>}
 */
export const deployOnChain = async (publicKey, countryCode) => {
  console.info(`Configuring OnChain id to ${publicKey}`);
  const signer = new ethers.Wallet(
    process.env.NEXT_PUBLIC_ADM_PRIVATE_KEY,
    new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
  );

  const clientIdentityAddress = IdentitySDK.Identity.computeDeploymentAddress({
    factory: process.env.NEXT_PUBLIC_IDENTITY_FACTORY_ADDRESS,
    unprefixedSalt: publicKey,
    implementationAuthority: process.env.NEXT_PUBLIC_IDENTITY_IMPLEMENTATION_AUTHORITY_ADDRESS,
  });

  const claimClient = {
    data: ethers.hexlify(ethers.toUtf8Bytes('LoopiPay KYC approved')),
    issuer: process.env.NEXT_PUBLIC_CLAIM_ISSUER_ADDRESS,
    topic: IdentitySDK.utils.enums.ClaimType.KYC,
    scheme: IdentitySDK.utils.enums.ClaimScheme.SOME,
    identity: clientIdentityAddress,
    signature: '',
  };

  console.info('Creating claim client signature');

  claimClient.signature = await signer.signMessage(
    arrayify(
      ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ['address', 'uint256', 'bytes'],
          [claimClient.identity, claimClient.topic, claimClient.data],
        ),
      ),
    ),
  );

  const kycManager = new ethers.Contract(process.env.NEXT_PUBLIC_KYC_MANAGER_ADDRESS ?? '', KycManagerAbi, signer);

  const approveKycInput = [
    publicKey,
    publicKey,
    [
      IdentitySDK.utils.encodeAndHash(['address'], [await signer.getAddress()]),
      IdentitySDK.utils.encodeAndHash(['address'], [await kycManager.getAddress()]),
    ],
    countryCode,
    claimClient.topic,
    claimClient.scheme,
    claimClient.issuer,
    claimClient.signature,
    claimClient.data,
    '',
    {
      gasLimit: 3000000,
    },
  ]

  const transaction = await kycManager.approveKyc(...approveKycInput);

  const { hash: transactionHash } = transaction;

  console.info(`Transaction [${transactionHash}] sent to blockchain`, transaction);

  const response = { clientIdentityAddress, transactionHash };

  console.info('User KYC successfully created', response);

  const transactionResult = await transaction.wait(1);
  if(!transactionResult.status) {
    console.info('Transaction Result', transactionResult);
    throw Error('Envio de KYC Falhou, para mais detalhes consulte a transação.');
  }

  return response;
}