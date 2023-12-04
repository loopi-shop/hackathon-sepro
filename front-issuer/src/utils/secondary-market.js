import {ethers} from "ethers";
import secondaryMarket from '../abis/secondary-market.json';
import {JsonRpcProvider} from "ethers";
import investmentsRepository from "../repositories/investments.repository";
import {addDays, format} from "date-fns";

const getExpirationDate = (tpf) => {
  if (tpf?.startTimestamp) {
    const expirationDate = addDays(tpf.startTimestamp, tpf.durationDays);
    return format(expirationDate, 'dd/MM/yyyy');
  }
};

class SecondaryMarket {
  getProvider() {
    if (!this.provider) {
      this.provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL, Number(process.env.NEXT_PUBLIC_CHAIN_ID))
    }

    return this.provider;
  }

  getContract() {
    if (!this.contract) {
      this.contract = new ethers.Contract(process.env.NEXT_PUBLIC_SECONDARY_MARKET, secondaryMarket, this.getProvider());
    }

    return this.contract;
  }

  async getInvestment(publicKey) {
    if(!this.investments) {
      this.investments = {};
    }

    if(!this.investments[publicKey]) {
      this.investments[publicKey] = await investmentsRepository.findOneByPublicKey(publicKey);
    }

    return this.investments[publicKey];
  }

  /**
   * @return {Promise<{internalId: string, quantity: string, isCanceled: boolean, isSold: boolean, yield: number, name: string, sellPrice: string, seller: string, expirationDate: string}[]>}
   */
  async listOrders() {
    const contract = this.getContract();
    const listingIds = Number(await contract.listingIds());
    console.info('Secondary market size of list', listingIds);
    const listPromise = [];

    for (let i = 0; i < listingIds; i++) {
      listPromise.push(contract.listings(i))
    }

    /**
     * @type {{
     *   internalId: string,
     *   quantity: string,
     *   isCanceled: boolean,
     *   isSold: boolean,
     *   yield: number,
     *   name: string,
     *   sellPrice: string,
     *   seller: string,
     *   expirationDate: string,
     * }[]}
     */
    const list = await Promise.all((await Promise.all(listPromise)).map(async (order) => {
      // In this object (order), destructor doesn't work
      const internalId = order[0];
      const token = order[1];
      const amount = order[2];
      const price = order[3];
      const seller = order[4];
      const isSold = order[5];
      const isCanceled = order[6];

      if (isSold || isCanceled) {
        return undefined;
      }

      const investment = await this.getInvestment(token);
      if(!investment) {
        return undefined;
      }

      const quantity = (amount / 10n ** BigInt(investment.decimals)).toString();

      return {
        internalId: internalId.toString(),
        name: 'Symbol01',
        expirationDate: getExpirationDate(investment),
        yield: investment.yield,
        quantity,
        sellPrice: (price / 10n ** 6n).toString(),
        isSold,
        isCanceled,
        seller,
      }
    }));

    console.info('Secondary market list', list);
    return list.filter(order => order !== undefined);
  }

  createOrder() {

  }

  cancelOrder() {

  }

  acceptOrder() {

  }
}

export default new SecondaryMarket();