const JWK = require('../src/common/jwk');
const NodeRSA = require('node-rsa');
const base64url = require('base64url');

describe("JWK key retrieval", function () {
    test("RS256", async () => {
        let rsaJWK = {
            "kty": "RSA",
            "e": "AQAB",
            "use": "sig",
            "kid": "789456",
            "alg": "RS256",
            "n": "p9YsIG-Z8Irub55l5d-TmCSCgYBIRH8TufEKNO4SqQ2OteWiNnmyHJ15xwW8B_dFcwS1-kTgjbrssGqmaCtj-CghOhBZ7xbhMdeMvGrjVRG2bCw1_hLqdpwacpzWQsDCfRd0LzjP-1vBPSRm9xZ5ar2EYS03n70yHBbpSJOxqs_H-_spfBUXmh68gFRkl7WXjQYTwu7pYodUI_NgGps-4CTTOj_kgjaVYT9YUj09zTUERzVGWNehenoVEI1fL7yAAbuxl8GqrtmIG4lbdvszsL-ROSiLJvPlo-YtefDzbzIqNfDpktbyqU6tdnbxalY5RqgUeAnDUgsWN9ajziLiiw"
        }

        let pem = JWK.getRSA256PublicKeyPem(rsaJWK);

        let key = new NodeRSA();
        key.importKey(pem, 'pkcs8-public-pem');
        let n = base64url.encode(key.keyPair.n.toBuffer().slice(1));
        
        expect(n).toEqual(rsaJWK.n);
    });
});