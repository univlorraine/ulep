module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
    transform: {
        '\\.(ts|tsx)$': [
            'ts-jest',
            {
                babelConfig: true,
            },
        ],
    },
    testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    coveragePathIgnorePatterns: ['<rootDir>/__tests__/mocks/'],
};
