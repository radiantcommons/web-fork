import { usePagePath } from '@/shared/utils/usePagePath.ts';

export enum PagePath {
  Home = '',
  Explore = '/explore',
  Trade = '/trade',
  Inspect = '/inspect',
  Portfolio = '/portfolio',
  Tournament = '/tournament',
  TournamentRound = '/tournament/:epoch',
  TournamentDelegator = '/tournament/delegator/:address',
  TradePair = '/trade/:primary/:numeraire',
  InspectLp = '/inspect/lp/:id',
  LpLeaderboard = '/inspect/lp-leaderboard',
}

const basePath: Partial<Record<PagePath, PagePath>> = {
  [PagePath.TradePair]: PagePath.Trade,
  '/inspect/lp/:id': PagePath.Inspect,
  '/tournament/:epoch': PagePath.Tournament,
};

// predefined query params for pages
export enum QueryParams {
  PortfolioShowShieldingTicker = 'showShieldingTicker',
}

// Used for dynamic routing when wanting to exclude the dynamic elements
export const useBasePath = (): PagePath => {
  const path = usePagePath();

  const base = basePath[path];
  if (base) {
    return base;
  }
  return path;
};

export const getTradePairPath = (
  primary: string,
  numeraire: string,
  options: { highlight?: 'liquidity' } = {},
): string => {
  const route = PagePath.TradePair.replace(':primary', primary).replace(':numeraire', numeraire);
  const query = options.highlight ? `?highlight=${options.highlight}` : '';
  return `${route}${query}`;
};

export const getPortfolioPath = (options: { showShieldingTicker?: boolean } = {}): string => {
  const route = PagePath.Portfolio;
  let query = '';

  if (options.showShieldingTicker === true) {
    query = `?${QueryParams.PortfolioShowShieldingTicker}=true`;
  }

  if (options.showShieldingTicker === false) {
    query = `?${QueryParams.PortfolioShowShieldingTicker}=false`;
  }

  return `${route}${query}`;
};
