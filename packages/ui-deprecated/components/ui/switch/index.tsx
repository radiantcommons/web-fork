'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '../../../lib/utils';

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  ref?: React.Ref<HTMLButtonElement>; // Switch root is a button
}

const Switch = ({ className, ref, ...props }: SwitchProps) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-[26px] w-[47px] xl:h-[30px] xl:w-[60px] shrink-0 cursor-pointer items-center rounded-full border-0 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-text-linear data-[state=unchecked]:bg-background',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-[23px] w-6 xl:h-[27px] xl:w-[30px] rounded-full bg-muted shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[21px] xl:data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-[2px]',
      )}
    />
  </SwitchPrimitives.Root>
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
