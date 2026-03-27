export default {
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/backend/__tests__/setupEnv.js'],
    setupFilesAfterEnv: ['<rootDir>/backend/__tests__/setupTests.js'],
    testMatch: ['<rootDir>/backend/**/__tests__/**/*.test.js'],
    transform: {},
    verbose: true,
    testTimeout: 20000,
    collectCoverage: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        'backend/**/*.js',
        '!backend/__tests__/**',
        '!backend/**/__tests__/**',
        '!backend/server.js',
    ],
    coverageThreshold: {
        global: {
            branches: 40,
            functions: 40,
            lines: 40,
            statements: 40,
        },
    },
};