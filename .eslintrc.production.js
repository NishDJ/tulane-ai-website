module.exports = {
  extends: ['./eslint.config.mjs'],
  rules: {
    // Relax rules for production builds
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/no-unescaped-entities': 'warn',
    '@next/next/no-img-element': 'warn',
    '@next/next/no-html-link-for-pages': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
};