// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat";
import { BigNumber } from "bignumber.js";

const MAX_UINT256 = new BigNumber(2).pow(256).minus(20);
const erc20ABI = [
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function transfer(address recipient, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
];

// CONFIG
const balancerVault = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";
const longTokenAddress = "0xaf08f22fb42ef4b4fa54b5471806124c08bd2dfe";
const shortTokenAddress = "0x6e2c300f8ae1b2d54006ae744f8b19d04df2f023";
const longShortPairContractAddress =
  "0x94c32d1a283cbb0772209e545f5332bbb81c4289";
const collateralTokenAddress = "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063";
const balancerPoolId =
  "0x7819f1532c49388106f7762328c51ee70edd134c00020000000000000000006c";

async function main() {
  const me = "0x477cb83ee9ab01c9a46a11bfee3356df78394bed";
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [me],
  });
  const signer = hre.ethers.provider.getSigner(me);

  const SPunkWrapper = await hre.ethers.getContractFactory("SPunkWrapper");
  const wrapper = await SPunkWrapper.deploy(
    longShortPairContractAddress,
    collateralTokenAddress,
    longTokenAddress,
    shortTokenAddress
  );

  await wrapper.deployed();

  console.log("Wrapper deployed to:", wrapper.address);

  // Interaction
  const dai = new hre.ethers.Contract(collateralTokenAddress, erc20ABI, signer);
  const longToken = new hre.ethers.Contract(longTokenAddress, erc20ABI, signer);
  const shortToken = new hre.ethers.Contract(
    shortTokenAddress,
    erc20ABI,
    signer
  );
  const _wrapper = new hre.ethers.Contract(
    wrapper.address,
    SPunkWrapper.interface,
    signer
  );
  await dai.approve(wrapper.address, new BigNumber(100e18).toString());

  console.log(`Dai balance before ${(await dai.balanceOf(me)).toString()}`);
  console.log(
    `LongToken balance before ${(await longToken.balanceOf(me)).toString()}`
  );
  console.log(
    `ShortToken balance before ${(await shortToken.balanceOf(me)).toString()}`
  );
  await _wrapper.mintAndSell(
    1,
    balancerVault,
    balancerPoolId,
    new BigNumber(1e18).toString()
  );
  console.log(`Dai balance after ${(await dai.balanceOf(me)).toString()}`);
  console.log(
    `LongToken balance after ${(await longToken.balanceOf(me)).toString()}`
  );
  console.log(
    `ShortToken balance after ${(await shortToken.balanceOf(me)).toString()}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
