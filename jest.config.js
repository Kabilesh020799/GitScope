module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: ["<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(d3|d3-[^/]+|internmap|robust-predicates|ml-matrix|delaunator)/)",
  ],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
    "\\.(svg|png|jpe?g|gif|webp)$": "<rootDir>/test/fileMock.js",
  },
};
