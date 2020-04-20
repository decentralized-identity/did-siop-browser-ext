const resolver = require('../src/common/resolver');

describe("Resolver -> To test resolver", function () {
    test("Resolve did document", async () => {
        let doc = await resolver.resolve('did:ethr:0xc2396b75dc474cfcdd3475ed53884fe1d0dd4d4b');
        expect(doc).toHaveProperty('@context');
        expect(doc).toHaveProperty('id');
    });
});
