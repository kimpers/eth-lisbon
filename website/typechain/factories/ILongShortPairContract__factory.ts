/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  ILongShortPairContract,
  ILongShortPairContractInterface,
} from "../ILongShortPairContract";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokensToCreate",
        type: "uint256",
      },
    ],
    name: "create",
    outputs: [
      {
        internalType: "uint256",
        name: "collateralUsed",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class ILongShortPairContract__factory {
  static readonly abi = _abi;
  static createInterface(): ILongShortPairContractInterface {
    return new utils.Interface(_abi) as ILongShortPairContractInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ILongShortPairContract {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ILongShortPairContract;
  }
}
