import React, { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';

import { H3, H4, H5, P, PSecondary } from '../components/Typography';
import { PageContainer } from '../components/Layout';
import { SecondaryButton } from '../components/Buttons';
import { ThemeToggler } from '../components/ThemeToggler';
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

const ActionRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 40px;
  padding: 20px;
`;

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left !important;
  gap: 5px;
  box-shadow: 0px 1px 2px #0f0e39, inset 0px 4px 9px rgba(255, 255, 255, 0.25);

  :hover {
    opacity: 0.7;
    cursor: pointer;
  }
`;

const LinkButton = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
`;

const HomePage: NextPage = () => {
  const { account } = useWeb3React();
  const { clearSession } = useClearWalletSession();
  const { latestPriceInEth, latestPriceInUsd, pricesLoading } =
    useReferencePrices();
  const [usdPrice, setUsdPrice] = useState<string>();
  const { imageUrls, imagesLoading } = useImages();

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
            <LinkButton>
              <H5>Spunk</H5>
            </LinkButton>
          </Link>
          <NavActionRow>
            {account ? (
              <>
                <P>{`${account.slice(0, 4)}...${account.slice(38)}`}</P>
                <SecondaryButton
                  style={{ maxWidth: '300px' }}
                  onClick={handleDisconnectAccount}
                >
                  Disconnect Wallet
                </SecondaryButton>
              </>
            ) : (
              <Link passHref href={routes.LOGIN}>
                <SecondaryButton style={{ maxWidth: '300px' }}>
                  Connect Wallet
                </SecondaryButton>
              </Link>
            )}
            <ThemeToggler />
          </NavActionRow>
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
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <P>Choose your position</P>
        </div>
        <ActionRow>
          <Link passHref href={routes.LONG}>
            <LinkButton>
              <ActionContainer>
                {imagesLoading ? <div /> : <img src={imageUrls[0]} />}
                <div style={{ padding: '15px' }}>
                  <H4 style={{ paddingBottom: '10px' }}>Long</H4>
                  <PSecondary>I think prices will go up</PSecondary>
                </div>
              </ActionContainer>
            </LinkButton>
          </Link>
          <ActionContainer>
            <Link passHref href={routes.SHORT}>
              <LinkButton>
                <ActionContainer>
                  {imagesLoading ? <div /> : <img src={imageUrls[1]} />}
                  <div style={{ padding: '15px' }}>
                    <H4 style={{ paddingBottom: '10px' }}>Short</H4>
                    <PSecondary>I think prices will go down</PSecondary>
                  </div>
                </ActionContainer>
              </LinkButton>
            </Link>
          </ActionContainer>
        </ActionRow>
      </PageContainer>
    </>
  );
};

const MemoizedHomePage = React.memo(HomePage);
export default MemoizedHomePage;
