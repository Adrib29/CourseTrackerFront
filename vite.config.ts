import { fileURLToPath, URL } from 'node:url';

import { configDefaults, defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    environment: 'jsdom',
    clearMocks: true,
    testTimeout: 10000,
    reporters: ['default', 'json'],
    outputFile: 'results/vitest-results.json',
    sequence: {
      shuffle: true
    },
    coverage: {
      provider: 'istanbul',
      all: true,
      exclude: [...configDefaults.coverage.exclude!, 'src/main.ts', 'src/router.ts', 'src/models'],
      reporter: ['json-summary', 'text', 'html']
    }
  }
});
