import {
  BigNumber,
  BigNumberish,
  CallOverrides,
  PayableOverrides,
  Signer
} from 'ethers';
import { Provider } from '@ethersproject/providers';

export interface EnsoulFactoryClient {
  connect(
    provider: Provider | Signer,
    address: string,
    waitConfirmations?: number
  ): Promise<void>;

  address(): string;

  /* ================ VIEW FUNCTIONS ================ */

  orgs(index: BigNumberish, config?: CallOverrides): Promise<string>;

  getEnsoulAdmin(config?: CallOverrides): Promise<string>;

  /* ================ TRANSACTION FUNCTIONS ================ */

  newOrg(
    orgOwner: string,
    tokenURI: string,
    contractURI: string,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<void>;

  setEnsoulAdmin(
    ensoulAdmin: string,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<void>;
}