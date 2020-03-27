const JWT = require('../src/common/jwt');
const { generateKeyPairSync } = require('crypto');


const base64urlTestResource = {
    testJWT: {
        header: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        payload: 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
        signature: 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    },
    testJWTDecoded: {
        header: {
            "alg": "HS256",
            "typ": "JWT"
        },
        payload: {
            "sub": "1234567890",
            "name": "John Doe",
            "iat": 1516239022
        }
    }
}

const rs256TestResource = {
    jwtDecoded: {
        header: {
            "alg": "RS256",
            "typ": "JWT"
        },
        payload: {
            "sub": "1234567890",
            "name": "John Doe",
            "admin": true,
            "iat": 1516239022
        }
    }
}

describe("JWT -> To test jwt functions", function () {
    test("JWT encode", async () => {
        let encodedHeader = JWT.encodeBase64Url(base64urlTestResource.testJWTDecoded.header);
        expect(encodedHeader).toEqual(base64urlTestResource.testJWT.header);

        let encodedPayload = JWT.encodeBase64Url(base64urlTestResource.testJWTDecoded.payload);
        expect(encodedPayload).toEqual(base64urlTestResource.testJWT.payload);
    });

    test("JWT decode", async () => {
        let decodedHeader = JWT.decodeBase64Url(base64urlTestResource.testJWT.header);
        expect(decodedHeader).toEqual(base64urlTestResource.testJWTDecoded.header);

        let decodedPayload = JWT.decodeBase64Url(base64urlTestResource.testJWT.payload);
        expect(decodedPayload).toEqual(base64urlTestResource.testJWTDecoded.payload);
    });

    describe("JWT sign/verify", function(){
        test("RS256", async ()=>{
            let keyPair = generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            });
            let signedJWT = JWT.signRS256(rs256TestResource.jwtDecoded.header,rs256TestResource.jwtDecoded.payload, keyPair.privateKey);
            let validity = JWT.verifyRS256(signedJWT, keyPair.publicKey);
            expect(validity).toBeTruthy();
            
            keyPair = generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            });

            validity = JWT.verifyRS256(signedJWT, keyPair.publicKey);
            expect(validity).toBeFalsy();
        });
    });
});