import { useState, useEffect } from 'react';

function useReferencePrices() {
  const [prices, setPrices] = useState<any>(null);
  const [latestPriceInEth, setLatestPriceInEth] = useState<number>();
  const [latestPriceInUsd, setLatestPriceInUsd] = useState<number>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Get latest prices for punks
        const res = await fetch(`/api/price-history`);
        const priceData = await res.json();
        setPrices(priceData);
        const latestEthPrice: number =
          +priceData[priceData.length - 1]?.price * 1000;
        setLatestPriceInEth(latestEthPrice);

        // Get latest ETH price
        const ethRes = await fetch(
          'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=53159740a064411a742a2c6582cdacfd85ad455c02722eb0005935b583b750cf',
        );
        const ethPriceData = await ethRes.json();
        const ethUsdPrice = ethPriceData.USD;

        if (latestPriceInEth && ethUsdPrice) {
          setLatestPriceInUsd(Math.round(ethUsdPrice * latestPriceInEth));
        }
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return {
    latestPriceInEth: latestPriceInEth,
    latestPriceInUsd: latestPriceInUsd,
    prices,
    pricesLoading: loading,
  };
}

export { useReferencePrices };
