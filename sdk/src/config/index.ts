export interface ContractInfo {
  proxyAddress: string;
  implAddress: string;
  version: string;
  contract: string;
  operator: string;
  fromBlock: number;
}

export interface Deployment {
  Ensoul_Factory_Upgradeable: ContractInfo;
}

export interface DeploymentFull {
  [chainId: number]: Deployment;
}

import * as deploymentData from './deployment.json';
export const DeploymentInfo: DeploymentFull = deploymentData;
