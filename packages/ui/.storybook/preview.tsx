import type { Preview } from '@storybook/react';
import penumbraTheme from './penumbra-theme';
import { useState } from 'react';
import { Density } from '../src/Density';
import { Tabs } from '../src/Tabs';

import '../src/theme/theme.css';
import '../src/theme/fonts.css';
import '../src/theme/font-sizes.css';
import '../src/theme/globals.css';

/**
 * Utility component to let users control the density, for components whose
 * stories include the `density` tag.
 */
const DensityWrapper = ({ children, showDensityControl }) => {
  const [density, setDensity] = useState('sparse');

  const densityTabs = (
    <div className='flex flex-col gap-4'>
      {showDensityControl && (
        <Density sparse>
          <Tabs
            options={[
              { label: 'Sparse', value: 'sparse' },
              { label: 'Compact', value: 'compact' },
              { label: 'Slim', value: 'slim' },
            ]}
            value={density}
            onChange={setDensity}
          />
        </Density>
      )}

      {children}
    </div>
  );

  if (density === 'compact') {
    return <Density compact>{densityTabs}</Density>;
  }

  if (density === 'slim') {
    return <Density slim>{densityTabs}</Density>;
  }

  return <Density sparse>{densityTabs}</Density>;
};

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    docs: {
      theme: penumbraTheme,
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#121212' },
        { name: 'black', value: '#000000' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  decorators: [
    (Story, { title, tags }) => {
      return (
        <DensityWrapper showDensityControl={tags.includes('density')}>
          <Story />
        </DensityWrapper>
      );
    },
  ],
};

export default preview;
