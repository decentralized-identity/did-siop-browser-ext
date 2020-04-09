const { validateDidDoc } = require('../src/common/util');

const resources = {
    didGood: "did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83",
    didDocGood: {
        "@context": "https://w3id.org/did/v1",
        "id": "did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83",
        "authentication": [{
            "type": "Secp256k1SignatureAuthentication2018",
            "publicKey": ["did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83#owner"]
        }],
        "publicKey": [{
            "id": "did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83#owner",
            "type": "Secp256k1VerificationKey2018",
            "ethereumAddress": "0xb07ead9717b44b6cf439c474362b9b0877cbbf83",
            "owner": "did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83"
        }]
    }
}

describe("util -> To test utility functions", function () {
    test("Validate DID Document", async () => {
        let didGood = resources.didGood;
        let didDocGood = resources.didDocGood;

        let validity = validateDidDoc(didGood, didDocGood);
        expect(validity).toBeTruthy();

        validity = validateDidDoc(didGood);
        expect(validity).toBeFalsy();

        validity = validateDidDoc('abcd', didDocGood);
        expect(validity).toBeFalsy();

        let didDocBadNoContext = JSON.parse(JSON.stringify(didDocGood));
        didDocBadNoContext["@context"] = '';
        validity = validateDidDoc(didGood, didDocBadNoContext);
        expect(validity).toBeFalsy();

        let didDocBadNoAuthentication = JSON.parse(JSON.stringify(didDocGood));;
        didDocBadNoAuthentication.authentication = [];
        validity = validateDidDoc(didGood, didDocBadNoAuthentication);
        expect(validity).toBeFalsy();
    });
});