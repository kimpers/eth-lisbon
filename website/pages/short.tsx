import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';

import { H3, H5, P } from '../components/Typography';
import { PageContainer } from '../components/Layout';
import { SecondaryButton } from '../components/Buttons';
import Checkout from '../components/checkout/Checkout';
import { routes } from '../utils/routes';
import { disableEagerWalletConnectPreference } from '../utils/preferences';
import { useClearWalletSession } from '../hooks/useClearWalletSession';
import { useReferencePrices } from '../hooks/useReferencePrices';
import { useImages } from '../hooks/useImages';

// TODO: Make navbar into its own component and move it to root level
const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 5px 0px;
`;

const NavActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const PriceWindow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 30px;
  gap: 10px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 40px;
`;

const TextButton = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
`;

const ShortPage = () => {
  const { account } = useWeb3React();
  const { clearSession } = useClearWalletSession();
  const { latestPriceInEth, latestPriceInUsd, pricesLoading } =
    useReferencePrices();
  const [usdPrice, setUsdPrice] = useState<string>();
  const { imageUrls, imagesLoading } = useImages();
  const inputRef = useRef<HTMLInputElement>();

  const handleDisconnectAccount = useCallback(() => {
    disableEagerWalletConnectPreference();
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    if (latestPriceInUsd && latestPriceInUsd !== NaN) {
      setUsdPrice(latestPriceInUsd.toLocaleString());
    }
  }, [latestPriceInUsd]);

  return (
    <>
      <PageContainer style={{ position: 'relative' }} id="top">
        <Navbar>
          <Link passHref href={routes.HOME}>
            <TextButton>
              <H5>Spunk</H5>
            </TextButton>
          </Link>
          {account ? (
            <NavActionRow>
              <P>{`${account.slice(0, 4)}...${account.slice(38)}`}</P>
              <SecondaryButton
                style={{ maxWidth: '300px' }}
                onClick={handleDisconnectAccount}
              >
                Disconnect Wallet
              </SecondaryButton>
            </NavActionRow>
          ) : (
            <Link passHref href={routes.LOGIN}>
              <SecondaryButton style={{ maxWidth: '300px' }}>
                Connect Wallet
              </SecondaryButton>
            </Link>
          )}
        </Navbar>
        <PriceWindow>
          <H5>Cryptopunks</H5>
          {!pricesLoading ? (
            <H3>
              {latestPriceInEth && `${latestPriceInEth} ETH`}{' '}
              {latestPriceInUsd && `($${usdPrice})`}
            </H3>
          ) : (
            <H3>Loading</H3>
          )}
          <H3></H3>
        </PriceWindow>
        <Body>
          {!imagesLoading && <img src={imageUrls[1]} />}
          <Checkout ref={inputRef.current} position="short" />
        </Body>
      </PageContainer>
    </>
  );
};

const MemoizedShortPage = React.memo(ShortPage);
export default MemoizedShortPage;
