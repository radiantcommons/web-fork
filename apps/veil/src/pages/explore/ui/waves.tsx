'use client';

import Waves from './penumbra-waves.svg';
import cn from 'clsx';

export const PenumbraWaves = () => {
  return (
    <Waves
      className={cn(
        'pointer-events-none fixed top-0 left-0 -z-1 h-[100vw] w-screen -translate-y-[70%] scale-150',
        'desktop:left-[10vw] desktop:h-[80vw] desktop:w-[80vw] desktop:-translate-y-3/4 desktop:scale-100',
      )}
    />
  );
};
