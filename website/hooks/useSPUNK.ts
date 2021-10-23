import Decimal from 'decimal.js-light';
import { useMemo, useCallback } from 'react';

import { SPunkWrapper__factory } from '../typechain';
import { getSigner } from '../utils/web3/helpers';
import {
  BALANCER_POOL_ID,
  BALANCER_VAULT_ADDRESS,
  SPUNK_WRAPPER_ADDRESS,
} from '../utils/config';

export enum Direction {
  Long = 0,
  Short = 1,
}
export const useSPUNK = (
  library: any | undefined | null,
  account: string | null | undefined,
) => {
  const mintAndSell = useCallback(
    async (direction: Direction, amount: Decimal) => {
      if (!account || !library) {
        return;
      }

      const sPunkWrapper = SPunkWrapper__factory.connect(
        SPUNK_WRAPPER_ADDRESS,
        getSigner(library, account) as any,
      );

      return sPunkWrapper.mintAndSell(
        direction,
        BALANCER_VAULT_ADDRESS,
        BALANCER_POOL_ID,
        amount.toString(),
      );
    },
    [account, library],
  );

  const result = useMemo(
    () => ({
      mintAndSell,
    }),
    [mintAndSell],
  );

  return result;
};
