const resolver = require('../src/common/resolver')();

describe("JWT -> To test resolver", function () {
    test("Verify JWT", async () => {
        let doc = await resolver.resolve('did:ethr:0xc2396b75dc474cfcdd3475ed53884fe1d0dd4d4b');
        expect(doc).toHaveProperty('@context');
        expect(doc).toHaveProperty('id');
    });
});
