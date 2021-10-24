import React, { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';
import { H5, P } from '../components/Typography';
import { SecondaryButton } from '../components/Buttons';
import { ThemeToggler } from '../components/ThemeToggler';
import { ConnectWalletMenu } from '../components/ConnectWalletMenu';
import { routes } from '../utils/routes';
import { disableEagerWalletConnectPreference } from '../utils/preferences';
import { useClearWalletSession } from '../hooks/useClearWalletSession';

const FullPageFlex = styled.div`
  /* Header height is 99px */
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  display: flex;
  flex: 1;
  min-height: 100%;
  max-width: 1440px;
  margin: auto;
  flex-direction: column;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    align-items: center;
  }
`;

// TODO: Make navbar into its own component and move it to root level
const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 5px 0px;
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

const NavActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const LoginPage = () => {
  const { account } = useWeb3React();
  const router = useRouter();

  const { clearSession } = useClearWalletSession();
  const handleDisconnectAccount = useCallback(() => {
    disableEagerWalletConnectPreference();
    clearSession();
  }, [clearSession]);

  const handleLogin = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <FullPageFlex>
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
      <ConnectWalletMenu onLogin={handleLogin} />
    </FullPageFlex>
  );
};

export default LoginPage;
