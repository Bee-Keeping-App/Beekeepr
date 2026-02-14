export default {
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/tests/setupEnv.js'],
    setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
    transform: {},
    verbose: true,
    testTimeout: 20000
};