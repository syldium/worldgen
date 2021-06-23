module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: ["<rootDir>/src/test/**/*.ts(x)?"],
  transform: {
    "^.+\\.tsx?$": [
        "esbuild-jest",
        { sourcemap: true }
    ]
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"]
};