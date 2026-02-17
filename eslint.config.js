import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'

export default [
    {
        ignores: [
            'node_modules',
            'dist',
            'build',
            'coverage',
        ],
    },

    js.configs.recommended,

    // backend (node)
    // I think we're migrating to ts eventually(?)
    // adding a rule for js files for now so it doesn't give us cancer immediately
    {
        files: ['backend/**/*.js'],
        languageOptions: {
            globals: globals.node,
        },
    },

    // tests (jest)
    {
        files: ['tests/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.jest,
                ...globals.node, //this is bad btw (since tests folder may contain front-end tests)
            }
        },
    },

    // frontend
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            globals: globals.browser,
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react,
            'react-hooks': reactHooks,
            import: importPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,

            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/no-unused-vars': 'error',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
]