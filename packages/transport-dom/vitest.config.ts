/// <reference types="vitest" />

import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  define: { __DEV__: mode !== 'production' },
  test: {
    include: ['src/*.test.ts'],
    browser: {
      name: 'chromium',
      provider: 'playwright',
      enabled: true,
      headless: true,
    },
  },
}));
