import { defineBeamUiConfig } from '@onbeam/styled-system/config';

export default defineBeamUiConfig({
  include: [
    './node_modules/@onbeam/ui/dist/panda.buildinfo.json',
    './node_modules/@onbeam/features/dist/panda.buildinfo.json',
    './src/**/*.{ts,tsx}',
  ],
});
