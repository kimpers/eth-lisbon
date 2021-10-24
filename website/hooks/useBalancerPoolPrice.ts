import { useCallback } from 'react';
import { Direction } from './useSPUNK';

import {
    BigNumber,
    BigNumberish,
    formatFixed,
} from '@ethersproject/bignumber';
import { SOR, SwapInfo, SwapTypes } from '@balancer-labs/sor';

export const networkId = 137;
export const providerUrl = 'https://rpc-mainnet.matic.network';
export const poolsSource = 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2';
export const tokenAddresses = {
        sPUNKs: {
            address: '0x6e2c300f8ae1b2d54006ae744f8b19d04df2f023',
            decimals: 18,
            symbol: 'sPUNKs',
        },
        sPUNKl: {
            address: '0xaf08f22fb42ef4b4fa54b5471806124c08bd2dfe',
            decimals: 18,
            symbol: 'sPUNKl',
        },
};

async function getPrice(
    tokenIn: { symbol: string; address: string; decimals: number },
    tokenOut: { symbol: string; address: string; decimals: number },
    swapAmount: BigNumberish,
    swapType: SwapTypes, //SwapExactIn==sell | SwapExactOut==buy
    queryOnChain: boolean,
    ): Promise<SwapInfo> {
        const sor = new SOR(providerUrl as any, networkId, poolsSource);

        // Will get onChain data for pools list
        await sor.fetchPools([], queryOnChain);
    
        // gasPrice is used by SOR as a factor to determine how many pools to swap against.
        // i.e. higher cost means more costly to trade against lots of different pools.
        const gasPrice = BigNumber.from('40000000000');
        // This determines the max no of pools the SOR will use to swap.
        const maxPools = 4;
    
        // This calculates the cost to make a swap which is used as an input to sor to allow it to make gas efficient recommendations.
        // Note - tokenOut for SwapExactIn, tokenIn for SwapExactOut
        const outputToken =
            swapType === SwapTypes.SwapExactOut ? tokenIn : tokenOut;
        const cost = await sor.getCostOfSwapInToken(
            outputToken.address,
            outputToken.decimals,
            gasPrice,
            BigNumber.from('35000')
        );
        console.log(`getCostOfSwapInToken: ${cost.toString()}`);
    
        const swapInfo: SwapInfo = await sor.getSwaps(
            tokenIn.address,
            tokenOut.address,
            swapType,
            swapAmount,
            { gasPrice, maxPools }
        );
    
        const amtInScaled =
            swapType === SwapTypes.SwapExactIn
                ? formatFixed(swapAmount, tokenIn.decimals)
                : formatFixed(swapInfo.returnAmount, tokenIn.decimals);
        const amtOutScaled =
            swapType === SwapTypes.SwapExactIn
                ? formatFixed(swapInfo.returnAmount, tokenOut.decimals)
                : formatFixed(swapAmount, tokenOut.decimals);
    
        const returnDecimals =
            swapType === SwapTypes.SwapExactIn
                ? tokenOut.decimals
                : tokenIn.decimals;
    
        const returnWithFees = formatFixed(
            swapInfo.returnAmountConsideringFees,
            returnDecimals
        );
    
        const costToSwapScaled = formatFixed(cost, returnDecimals);
    
        const swapTypeStr =
            swapType === SwapTypes.SwapExactIn ? 'SwapExactIn' : 'SwapExactOut';
        console.log(swapTypeStr);
        console.log(`Token In: ${tokenIn.symbol}, Amt: ${amtInScaled.toString()}`);
        console.log(
            `Token Out: ${tokenOut.symbol}, Amt: ${amtOutScaled.toString()}`
        );
        console.log(`Cost to swap: ${costToSwapScaled.toString()}`);
        console.log(`Return Considering Fees: ${returnWithFees.toString()}`);
        console.log(`Swaps:`);
        console.log(swapInfo.swaps);
        console.log(swapInfo.tokenAddresses);

        return swapInfo;
}

export const sPunkPrice = useCallback(
    async (direction: Direction, amount: BigNumberish) => {
        try {
            if (direction == 0) { //sell shortPunk tokens to the pool for long position
                var price = getPrice(tokenAddresses.sPUNKs, tokenAddresses.sPUNKl, amount, SwapTypes.SwapExactIn, true);
                return price;
            } else { //sell longPunks to the pool for short position
                var price = getPrice(tokenAddresses.sPUNKl, tokenAddresses.sPUNKs, amount, SwapTypes.SwapExactIn, true);
                return price;
            }
        } catch (err) {
            console.error('Error fetching pool price:', err);
        }
    },
    [],
);


