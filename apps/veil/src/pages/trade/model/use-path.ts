import { useAssets } from '@/shared/api/assets';
import { useParams, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

interface PathParams {
  baseSymbol: string;
  quoteSymbol: string;
  [key: string]: string; // required for useParams signature
}

interface PathQueryParams {
  highlight?: 'liquidity';
}

export const usePathSymbols = () => {
  const params = useParams<PathParams>();
  if (!params) {
    throw new Error('No symbol params in path');
  }
  return { baseSymbol: params.baseSymbol, quoteSymbol: params.quoteSymbol };
};

// Converts symbol to Metadata
export const usePathToMetadata = () => {
  const { data } = useAssets();
  const { baseSymbol, quoteSymbol } = usePathSymbols();

  return useMemo(
    () => ({
      baseSymbol,
      quoteSymbol,
      baseAsset: data.find(m => m.symbol.toLowerCase() === baseSymbol.toLowerCase()),
      quoteAsset: data.find(a => a.symbol.toLowerCase() === quoteSymbol.toLowerCase()),
    }),
    [data, baseSymbol, quoteSymbol],
  );
};

export const usePathQuery = (): PathQueryParams => {
  const searchParams = useSearchParams();
  const highlight = searchParams?.get('highlight') as PathQueryParams['highlight'];

  return {
    highlight,
  };
};
