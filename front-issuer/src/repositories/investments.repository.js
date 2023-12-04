import { AbstractRepository } from "./abstract.repository";
import {getDocs, query, where} from "firebase/firestore";

/**
 * @typedef TPF
 * @property {string} id
 * @property {string} symbol
 * @property {string} name
 * @property {string} contractAddress
 * @property {number} decimals
 * @property {Date} startTimestamp CreatedAt
 * @property {number} durationDays
 * @property {string} asset Address of BRLX
 * @property {number} yield Integer with **X** decimals
 * @property {number} maxAssets Max tokens issued
 * @property {string} minimumValue Min tokens
 * @property {string} _identityRegistry address
 * @property {string} _compliance address
 * @property {string} _onchainId address
 */

const MIN_VALUE = '1000.000000'; // BRLX

class InvestmentsRepository extends AbstractRepository {
  COLLECTION_NAME = 'investments';

  /**
   * @param {Omit<TPF, "id">} tpf
   * @returns {Promise<TPF>}
   */
  async create(tpf) {
    /**
     * @type {TPF}
     */
    const tpfPrepared = {
      ...tpf,
      minimumValue: tpf?.minimumValue ?? MIN_VALUE,
      id: tpf.symbol,
    }
    const output = await super.create(tpfPrepared.id, tpfPrepared);
    return {
      id: output.id,
      symbol: output.symbol,
      name: output.name,
      decimals: output.decimals,
      startTimestamp: this.firebaseTimeStampToDate(output.startTimestamp),
      durationDays: output.durationDays,
      asset: output.asset,
      yield: output.yield,
      maxAssets: output.maxAssets,
      _identityRegistry: output._identityRegistry,
      _compliance: output._compliance,
      _onchainId: output._onchainId,
      minimumValue: output.minimumValue,
      contractAddress: output.contractAddress,
    }
  }

  async list() {
    const output = await super.list();
    return output.map((tpf) => ({
      id: tpf.id,
      symbol: tpf.symbol,
      name: tpf.name,
      decimals: tpf.decimals,
      startTimestamp: this.firebaseTimeStampToDate(tpf.startTimestamp),
      durationDays: tpf.durationDays,
      asset: tpf.asset,
      yield: tpf.yield,
      maxAssets: tpf.maxAssets,
      _identityRegistry: tpf._identityRegistry,
      _compliance: tpf._compliance,
      _onchainId: tpf._onchainId,
      minimumValue: tpf.minimumValue ?? MIN_VALUE,
      contractAddress: tpf.contractAddress,
    }));
  }

  async findOneByContractAddress(contractAddress) {
    const q = query(this.getCollection(), where('contractAddress', '==', contractAddress));
    const docs = await getDocs(q);
    return docs.docs?.shift()?.data();
  }
}

export default new InvestmentsRepository();