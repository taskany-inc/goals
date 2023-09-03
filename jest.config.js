/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    transform: {
        '^.+\\.(t|j)sx?$': '@swc/jest',
    },

    // Automatically clear mock calls, instances and results before every test
    clearMocks: true,

    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,

    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',

    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: 'v8',
};
