/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    preset: "jest-puppeteer",
    snapshotSerializers: ["jest-serializer-html"],
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
};
