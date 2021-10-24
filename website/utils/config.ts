export const WEB3_APP_DISPLAY_NAME = '';

export const PRODUCTION_ROOT_URL = '';
export const PRODUCTION_ROOT_URLS = [PRODUCTION_ROOT_URL];

export const SUPPORTED_CHAIN_IDS = [137];
export const DEFAULT_CHAIN_ID = 137;

export const POLL_BLOCK_NUMBER_INTERVAL_MS = 60 * 1000;
export const ALCHEMY_RPC_KEY_MAINNET =
  process.env.NEXT_PUBLIC_ALCHEMY_RPC_KEY_MAINNET;

export const COLLATERAL_TOKEN_SYMBOL = 'DAI';

export const YAM_PUNK_PRICE_URL =
  'https://api.yam.finance/degenerative/upunks/price-history';

export const ALCHEMY_RPC_URL_MAINNET_HTTP = `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_RPC_KEY_MAINNET}`;
export const ALCHEMY_RPC_URL_MAINNET_WSS = `wss://eth-mainnet.ws.alchemyapi.io/v2/${ALCHEMY_RPC_KEY_MAINNET}`;

export const ALCHEMY_RPC_KEY_KOVAN =
  process.env.NEXT_PUBLIC_ALCHEMY_RPC_KEY_KOVAN;

export const ALCHEMY_RPC_URL_KOVAN_HTTP = `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_RPC_KEY_KOVAN}`;
export const ALCHEMY_RPC_URL_KOVAN_WSS = `wss://eth-kovan.ws.alchemyapi.io/v2/${ALCHEMY_RPC_KEY_KOVAN}`;

export const ALCHEMY_RPC_KEY_POLYGON =
  process.env.NEXT_PUBLIC_ALCHEMY_RPC_KEY_POLYGON;

export const ALCHEMY_RPC_POLYGON_HTTP = `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_RPC_KEY_POLYGON}`;
export const ALCHEMY_RPC_POLYGON_WSS = `wss://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_RPC_KEY_POLYGON}`;

export const ALCHEMY_RPC_KEY_ROPSTEN =
  process.env.NEXT_PUBLIC_ALCHEMY_RPC_KEY_KOVAN;
export const ALCHEMY_RPC_URL_ROPSTEN_HTTP = `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_RPC_KEY_ROPSTEN}`;

export const RPC_POLLING_INTERVAL = 8000;

export const DEFAULT_SCRIPT_LOAD_DEFER_TIME_IN_MS = 1200;

export const BALANCER_VAULT_ADDRESS =
  '0xBA12222222228d8Ba445958a75a0704d566BF2C8';
export const BALANCER_POOL_ID =
  '0x7819f1532c49388106f7762328c51ee70edd134c00020000000000000000006c';

export const SPUNK_WRAPPER_ADDRESS =
  '0xD98E5b1a0Aa8627625E89e12f158830BE25e1fbf';

export const isProductionUrl = (): boolean => {
  const currentRootUrl = window.location.origin;
  const [isProductionUrl] = PRODUCTION_ROOT_URLS.map((url) =>
    currentRootUrl.includes(url),
  ).filter((x) => !!x);
  return isProductionUrl || false;
};

export const DEFER_MODULES_TIMINGS = {
  ALCHEMY_RPC: 2000,
  LIMIT_ORDER_WATCHER: 4000,
  LOG_EVENT_WATCHER: 20000,
};

export const getAlchemyRpcKey = (chainId?: number): string => {
  switch (chainId) {
    case undefined:
      return getAlchemyRpcKey(DEFAULT_CHAIN_ID);
    case 1:
      return ALCHEMY_RPC_KEY_MAINNET!;
    case 3:
      return ALCHEMY_RPC_KEY_ROPSTEN!;
    case 42:
      return ALCHEMY_RPC_KEY_KOVAN!;
    case 137:
      return ALCHEMY_RPC_KEY_POLYGON!;
  }
  throw new Error(`unsupported chainId: ${chainId}`);
};
