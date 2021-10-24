import App from 'next/app';
import Head from 'next/head';
import Decimal from 'decimal.js-light';
import React, { useEffect } from 'react';
import { DefaultSeo } from 'next-seo';
import { ThemeProvider } from 'styled-components';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { WalletConnectionProviderState } from '../contexts/wallet-connection';
import { BlockWatcherProvider } from '../contexts/block-watcher';
import { ToggleThemeContext } from '../contexts/toggle-theme';
import { themes } from '../styles/theme';
import { useDarkMode } from '../hooks/useDarkMode';
import '../styles/resets.css';
import '../styles/base.css';
import 'react-medium-image-zoom/dist/styles.css';

const DEFAULT_SITE_TITLE = '';
const DEFAULT_SITE_DESCRIPTION = '';

// Set high precision for crypto decimals
Decimal.set({ precision: 80, toExpPos: 1000, rounding: Decimal.ROUND_DOWN });

const getLibrary = (provider: any) => {
  const library = new Web3Provider(provider);
  return library;
};

const DappConfig: React.FC<{}> = ({ children }) => {
  const { theme, toggleTheme } = useDarkMode();
  // Ensure decimal-js settings are correct on mount
  useEffect(() => {
    Decimal.set({ precision: 80, toExpPos: 1000 });
  }, []);
  return (
    <ThemeProvider theme={themes[theme]}>
      <ToggleThemeContext.Provider value={{ toggleTheme, theme }}>
        <style jsx global>
          {`
            body {
              background: ${theme === 'dark' ? 'black' : 'white'};
            }
          `}
        </style>
        {children}
      </ToggleThemeContext.Provider>
    </ThemeProvider>
  );
};

export default class Dapp extends App {
  render() {
    const { Component, pageProps } = this.props;

    // Workaround for https://github.com/zeit/next.js/issues/8592
    const { err } = this.props as any;
    const modifiedPageProps = { ...pageProps, err };
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <DefaultSeo
          title={DEFAULT_SITE_TITLE}
          description={DEFAULT_SITE_DESCRIPTION}
          openGraph={{
            type: 'website',
            locale: 'en_US',
            url: '',
            title: DEFAULT_SITE_TITLE,
            description: DEFAULT_SITE_DESCRIPTION,
            site_name: '',
            images: [
              {
                url: '',
                alt: '',
              },
            ],
          }}
          twitter={{
            handle: '',
            site: '',
            cardType: 'summary_large_image',
          }}
          additionalMetaTags={[
            {
              name: 'twitter:image',
              content: '',
            },
            {
              name: 'twitter:url',
              content: '',
            },
          ]}
        />
        <DappConfig>
          <Web3ReactProvider getLibrary={getLibrary}>
            <BlockWatcherProvider>
              <WalletConnectionProviderState>
                <Component {...modifiedPageProps} />
              </WalletConnectionProviderState>
            </BlockWatcherProvider>
          </Web3ReactProvider>
        </DappConfig>
      </>
    );
  }
}
