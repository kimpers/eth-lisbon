import React, { useCallback } from 'react';
import Decimal from 'decimal.js-light';
import Link from 'next/link';
import { NextPage } from 'next';
import { useWeb3React } from '@web3-react/core';

import { H1, P } from '../components/Typography';
import { PageContainer } from '../components/Layout';
import { PrimaryButton } from '../components/Buttons';
import { routes } from '../utils/routes';
import { disableEagerWalletConnectPreference } from '../utils/preferences';
import { useClearWalletSession } from '../hooks/useClearWalletSession';
import { useSPUNK, Direction } from '../hooks/useSPUNK';

const HomePage: NextPage = () => {
  const { account, library } = useWeb3React();
  const { clearSession } = useClearWalletSession();
  const spunk = useSPUNK(library, account);

  const handleDisconnectAccount = useCallback(() => {
    disableEagerWalletConnectPreference();
    clearSession();
  }, [clearSession]);
  return (
    <>
      <PageContainer style={{ position: 'relative' }} id="top">
        <H1>Hello World</H1>
        {account ? (
          <>
            <P>Account: {account}</P>
            <PrimaryButton
              style={{ maxWidth: '300px' }}
              onClick={handleDisconnectAccount}
            >
              Disconnect Wallet
            </PrimaryButton>
            {spunk && (
              <PrimaryButton
                style={{ maxWidth: '300px', marginTop: '10px' }}
                onClick={async () => {
                  const result = await spunk.mintAndSell(
                    Direction.Short,
                    new Decimal(1e18),
                  );

                  if (result) {
                    console.log(`TX SUCCESS ${result.hash}`);
                  }
                }}
              >
                SHORT 1 DAI
              </PrimaryButton>
            )}
          </>
        ) : (
          <Link passHref href={routes.LOGIN}>
            <PrimaryButton style={{ maxWidth: '300px' }}>
              Connect Wallet
            </PrimaryButton>
          </Link>
        )}
      </PageContainer>
    </>
  );
};

const MemoizedHomePage = React.memo(HomePage);
export default MemoizedHomePage;
