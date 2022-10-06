import {expect} from 'chai';
import {ethers, getNamedAccounts, upgrades} from 'hardhat';
import {Signer} from 'ethers';
import pino from 'pino';
import {EtherEnsoulFactoryClient} from '../sdk/dist';
import {EnsoulFactoryUpgradeable} from '../sdk/src/typechain';

const Logger = pino();
const contractName = 'Ensoul';

describe(`test ${contractName}`, function () {
  let deployer: Signer;
  let accountA: Signer;

  before('setup accounts', async () => {
    const NamedAccounts = await getNamedAccounts();
    deployer = await ethers.getSigner(NamedAccounts.deployer);
    accountA = await ethers.getSigner(NamedAccounts.accountA);
  });

  describe(`test sdk`, function () {
    const contractClient = new EtherEnsoulFactoryClient();

    beforeEach(`deploy and init ${contractName}`, async () => {
      const Contract = await ethers.getContractFactory(`${contractName}`);
      const contractResult = await upgrades.deployProxy(
        Contract.connect(deployer),
        [],
        {
          kind: 'uups',
        }
      );
      await contractClient.connect(deployer, contractResult.address, 1);
      await contractClient.newOrg(await deployer.getAddress(), 'https://', 'https://');
      
    });

    it('check init data', async function () {
      expect(await contractClient.implementationVersion()).to.be.equal('1.0.0');
      expect(await contractClient.getEnsoulAdmin()).eq(
        await deployer.getAddress()
      );
    });

    it('check newOrg', async function () {
      await contractClient.newOrg(
        await deployer.getAddress(),
        'https://',
        'https://'
      );
      expect(contractClient.orgs(0)).not.NaN;
      contractClient.connect(accountA, contractClient.address());
      await expect(
        contractClient.newOrg(
          await deployer.getAddress(),
          'https://',
          'https://'
        )
      ).revertedWith(`ERR_NOT_ENSOUL_ADMIN`);
    });

    it('check setEnsoulAdmin', async function () {
      await contractClient.setEnsoulAdmin(await accountA.getAddress());
      expect(await contractClient.getEnsoulAdmin()).eq(
        await accountA.getAddress()
      );
      await expect(
        contractClient.setEnsoulAdmin(await accountA.getAddress())
      ).revertedWith(`ERR_NOT_ENSOUL_ADMIN`);
    });
  });

  describe(`test contract`, function () {
    let contract: EnsoulFactoryUpgradeable;

    beforeEach('deploy and init contract', async () => {
      const Contract = await ethers.getContractFactory(contractName);
      contract = (await upgrades.deployProxy(Contract.connect(deployer), [], {
        kind: 'uups',
      })) as EnsoulFactoryUpgradeable;
    });

    it('check upgardeable', async function () {
      const Contract = await ethers.getContractFactory(contractName);
      await expect(
        upgrades.upgradeProxy(contract.address, Contract.connect(accountA), {
          kind: 'uups',
        })
      ).revertedWith(`ERR_NOT_ENSOUL_ADMIN`);
      await upgrades.upgradeProxy(
        contract.address,
        Contract.connect(deployer),
        {
          kind: 'uups',
        }
      );
    });
  });
});
