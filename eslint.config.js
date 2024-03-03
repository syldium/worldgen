import eslint from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  {
    ...reactRecommended,
    plugins: {
      ...reactRecommended.plugins,
      ...jsxRuntime.plugins,
      'react-hooks': reactHooks
    },
    rules: {
      ...reactRecommended.rules,
      ...jsxRuntime.rules,
      ...reactHooks.configs.recommended.rules
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off'
    }
  }
);
