/** @type import('@jest/types/build/Config').InitialOptions */
module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: ["<rootDir>/src/test/**/*.ts(x)?"],
  transform: {
    "^.+\\.tsx?$": [
        "esbuild-jest",
        { sourcemap: true, target: 'es2020' }
    ]
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"]
};