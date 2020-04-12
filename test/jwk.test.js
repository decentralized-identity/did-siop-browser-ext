const JWK = require('../src/common/jwk');
const NodeRSA = require('node-rsa');
var EC = require('elliptic').ec;
const base64url = require('base64url');

describe("JWK -> To test JWK functions", function (){
    describe("Retrieve public key from JWK", function () {
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
            let e = key.keyPair.e.toString(16);
            e = (e % 2 === 0) ? e : '0' + e;
            e = Buffer.from(e, 'hex').toString('base64');

            expect(n).toEqual(rsaJWK.n);
            expect(e).toEqual(rsaJWK.e);
        });
        test("ES256K", async () => {
            let ec256JWK = {
                "kty": "EC",
                "use": "sig",
                "crv": "secp256k1",
                "kid": "789456",
                "x": "vA1MdssF25DZIeLSd-SZBuzJvp1pVPZErBEGTnmZD_k",
                "y": "OhW9OTHWEzZRFfRaucIvOQ5za-I2qI1u3i8rOx38ANw",
                "alg": "ES256"
            }

            let hex = JWK.getECPublicKeyHex(ec256JWK);

            let ec = EC('secp256k1');
            let key = ec.keyFromPublic(hex, 'hex');

            expect(base64url.encode(key.getPublic().getX().toBuffer())).toEqual(ec256JWK.x);
            expect(base64url.encode(key.getPublic().getY().toBuffer())).toEqual(ec256JWK.y);
        });
        test("Wrapper", async () => {
            let rsaJWK = {
                "kty": "RSA",
                "e": "AQAB",
                "use": "sig",
                "kid": "789456",
                "alg": "RS256",
                "n": "p9YsIG-Z8Irub55l5d-TmCSCgYBIRH8TufEKNO4SqQ2OteWiNnmyHJ15xwW8B_dFcwS1-kTgjbrssGqmaCtj-CghOhBZ7xbhMdeMvGrjVRG2bCw1_hLqdpwacpzWQsDCfRd0LzjP-1vBPSRm9xZ5ar2EYS03n70yHBbpSJOxqs_H-_spfBUXmh68gFRkl7WXjQYTwu7pYodUI_NgGps-4CTTOj_kgjaVYT9YUj09zTUERzVGWNehenoVEI1fL7yAAbuxl8GqrtmIG4lbdvszsL-ROSiLJvPlo-YtefDzbzIqNfDpktbyqU6tdnbxalY5RqgUeAnDUgsWN9ajziLiiw"
            }

            let ec256JWK = {
                "kty": "EC",
                "use": "sig",
                "crv": "secp256k1",
                "kid": "789456",
                "x": "vA1MdssF25DZIeLSd-SZBuzJvp1pVPZErBEGTnmZD_k",
                "y": "OhW9OTHWEzZRFfRaucIvOQ5za-I2qI1u3i8rOx38ANw",
                "alg": "ES256"
            }

            let pem = JWK.getPublicKey(rsaJWK);
            let rsaKey = new NodeRSA();
            rsaKey.importKey(pem, 'pkcs8-public-pem');
            let n = base64url.encode(rsaKey.keyPair.n.toBuffer().slice(1));
            expect(n).toEqual(rsaJWK.n);

            let hex = JWK.getPublicKey(ec256JWK);
            let ec = EC('secp256k1');
            let ecKey = ec.keyFromPublic(hex, 'hex');
            expect(base64url.encode(ecKey.getPublic().getX().toBuffer())).toEqual(ec256JWK.x);
            expect(base64url.encode(ecKey.getPublic().getY().toBuffer())).toEqual(ec256JWK.y);
        })
    });
    describe("Generate JWK from public key", function () {
        test("RSA PEM to JWK", async () => {
            let rsaJWK = {
                "kty": "RSA",
                "e": "AQAB",
                "n": "p9YsIG-Z8Irub55l5d-TmCSCgYBIRH8TufEKNO4SqQ2OteWiNnmyHJ15xwW8B_dFcwS1-kTgjbrssGqmaCtj-CghOhBZ7xbhMdeMvGrjVRG2bCw1_hLqdpwacpzWQsDCfRd0LzjP-1vBPSRm9xZ5ar2EYS03n70yHBbpSJOxqs_H-_spfBUXmh68gFRkl7WXjQYTwu7pYodUI_NgGps-4CTTOj_kgjaVYT9YUj09zTUERzVGWNehenoVEI1fL7yAAbuxl8GqrtmIG4lbdvszsL-ROSiLJvPlo-YtefDzbzIqNfDpktbyqU6tdnbxalY5RqgUeAnDUgsWN9ajziLiiw"
            }

            let pem = JWK.getRSA256PublicKeyPem(rsaJWK);
            let newJWK = JWK.getRSAJWK(pem);

            expect(newJWK).toEqual(rsaJWK);
        });
        test("EC256K hex to JWK", async () => {
            let ec256JWK = {
                "kty": "EC",
                "crv": "secp256k1",
                "x": "vA1MdssF25DZIeLSd-SZBuzJvp1pVPZErBEGTnmZD_k",
                "y": "OhW9OTHWEzZRFfRaucIvOQ5za-I2qI1u3i8rOx38ANw",
            }

            let hex = JWK.getECPublicKeyHex(ec256JWK);
            let newJWK = JWK.getECJWK(hex);

            expect(newJWK).toEqual(ec256JWK);
        });
    });
    describe("Generate JWK thumbprint", function () {
        test("Get base64url encoded JWK thumbprint", async () => {
            let jwk = {
                "kty": "RSA",
                "n": "0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtVT86zwu1RK7aPFFxuhDR1L6tSoc_BJECPebWKRXjBZCiFV4n3oknjhMstn64tZ_2W-5JsGY4Hc5n9yBXArwl93lqt7_RN5w6Cf0h4QyQ5v-65YGjQR0_FDW2QvzqY368QQMicAtaSqzs8KJZgnYb9c7d0zgdAZHzu6qMQvRL5hajrn1n91CbOpbISD08qNLyrdkt-bFTWhAI4vMQFh6WeZu0fM4lFd2NcRwr3XPksINHaQ-G_xBniIqbw0Ls1jF44-csFCur-kEgU8awapJzKnqDKgw",
                "e": "AQAB"
            }

            let thumbprint = 'NzbLsXh8uDCcd-6MNwXF4W_7noWXFZAfHkxZsRGC9Xs';

            let sub = JWK.getBase64UrlEncodedJWKThumbprint(jwk);

            expect(sub).toEqual(thumbprint);
        });
    });
});