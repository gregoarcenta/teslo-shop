module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    ".*\\.e2e\\.spec\\.ts$",
    ".*\\.functional\\.spec\\.ts$",
  ],
};
