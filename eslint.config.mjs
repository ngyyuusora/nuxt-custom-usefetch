// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
// @ts-ignore
import configPrettier from 'eslint-config-prettier';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const configExt = {
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
};

// @ts-ignore
export default withNuxt(pluginPrettierRecommended, configPrettier, configExt);
