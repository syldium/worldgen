module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'react',
        'react-hooks',
        'jest'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jest/recommended',
        'prettier'
    ],
    rules: {
        '@typescript-eslint/ban-ts-comment': 'off'
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
};
