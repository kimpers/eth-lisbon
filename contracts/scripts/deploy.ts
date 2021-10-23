// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat";

// CONFIG
const longTokenAddress = "0xaf08f22fb42ef4b4fa54b5471806124c08bd2dfe";
const shortTokenAddress = "0x6e2c300f8ae1b2d54006ae744f8b19d04df2f023";
const longShortPairContractAddress =
  "0x94c32d1a283cbb0772209e545f5332bbb81c4289";
// DAI
const collateralTokenAddress = "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063";

async function main() {
  const SPunkWrapper = await hre.ethers.getContractFactory("SPunkWrapper");
  const wrapper = await SPunkWrapper.deploy(
    longShortPairContractAddress,
    collateralTokenAddress,
    longTokenAddress,
    shortTokenAddress
  );

  await wrapper.deployed();

  console.log("Wrapper deployed to:", wrapper.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
