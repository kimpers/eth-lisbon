import Decimal from 'decimal.js-light';
import { useMemo, useCallback, useState, useEffect } from 'react';

import { IERC20__factory } from '../typechain';
import { getSigner } from '../utils/web3/helpers';
import { COLLATERAL_ADDRESS, SPUNK_WRAPPER_ADDRESS } from '../utils/config';

const ZERO = new Decimal(0);

export enum Direction {
  Long = 0,
  Short = 1,
}
export const useAllowance = (
  library: any | undefined | null,
  account: string | null | undefined,
) => {
  const [allowance, setAllowance] = useState<Decimal>(ZERO);
  const erc20 = useMemo(() => {
    if (!account || !library) {
      return undefined;
    }

    return IERC20__factory.connect(
      COLLATERAL_ADDRESS,
      getSigner(library, account) as any,
    );
  }, [account, library]);

  useEffect(() => {
    const fetchAllowance = async () => {
      if (!erc20 || !account) {
        return;
      }
      const _allowance = await erc20.allowance(account, SPUNK_WRAPPER_ADDRESS);
      setAllowance(new Decimal(_allowance.toString()));
    };

    fetchAllowance().catch((err) => console.error(err));
  }, [erc20, account]);

  const approve = useCallback(
    async (allowanceBaseUnits: Decimal) => {
      if (!erc20 || !account) {
        return undefined;
      }

      try {
        const tx = await erc20.approve(
          SPUNK_WRAPPER_ADDRESS,
          allowanceBaseUnits.toString(),
        );
        const receipt = await tx.wait(1);
        console.log(receipt.transactionHash);
        setAllowance(allowanceBaseUnits);
      } catch (err) {
        console.error(err);
        setAllowance(ZERO);
        throw err;
      }
    },
    [erc20, account, setAllowance],
  );

  const result = useMemo(
    () => ({
      allowance,
      approve,
    }),
    [allowance, approve],
  );

  return result;
};
