const JWT = require('../src/common/jwt');
const { generateKeyPairSync } = require('crypto');
const EC = require('elliptic').ec;


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

const es256kTestResource = {
    jwtDecoded: {
        header: {
            "alg": "ES256K",
            "typ": "JWT"
        },
        payload: {
            "sub": "1234567890",
            "name": "John Doe",
            "admin": true,
            "iat": 1516239022
        }
    },
    privateKey: '04418834408F4485404C428460C1D008040410827D0A97D1DF3CE0ED3BC5F0C7091045E9D41D135649DBBD315727C18EACFB15BA801C1814AE0410002A85100D080011362C69A8D266C546CE0B60E95E1872D834B913B56BF8610AAE2C4A19C1C72AD41D4BA3D3FF90E4377A10DD9DA3C38CD628626740199389D41B74217513FD8ABC',
    publicKey: '0428c0da3e1c15e84876625d366eab8dd20c84288bcf6a71a0699209fc656dcfeb4633d7eff3dc63be7d7ada54fcb63cd603e5ac0a1382de19a73487dbc8e177e9',
    publicKeyWrong: '0428c0da3e1c15e84876625d366eab8dd20c84288bcf6a71a0699209fc646dcfeb4633d7eff3dc63be7d7ada54fcb63cd603e5ac0a1382de19a73487dbc8e177e9',

}

const es256kRecoverableResources = {
    jwtDecoded: {
        header: {
            "alg": "ES256K-R",
            "typ": "JWT"
        },
        payload: {
            "sub": "1234567890",
            "name": "John Doe",
            "admin": true,
            "iat": 1516239022
        }
    },
    privateKey: 'CE438802C1F0B6F12BC6E686F372D7D495BC5AA634134B4A7EA4603CB25F0964',
    publicKey: '0xB07Ead9717b44B6cF439c474362b9B0877CBBF83',
    publicKeyWrong: '0428c0da3e1c15e84876625d366eab8dd20c84288bcf6a71a0699209fc646dcfeb4633d7eff3dc63be7d7ada54fcb63cd603e5ac0a1382de19a73487dbc8e177e9',

}

const edDsaTestResources = {
     jwtDecoded: {
             header: {
                 "alg": "EdDSA",
                 "typ": "JWT"
             },
             payload: {
                 "sub": "1234567890",
                 "name": "John Doe",
                 "admin": true,
                 "iat": 1516239022
             }
         },
    privateKey: '1498b5467a63dffa2dc9d9e069caf075d16fc33fdd4c3b01bfadae6433767d93',
    publicKey: 'b7a3c12dc0c8c748ab07525b701122b88bd78f600c76342d27f25e5f92444cde',
    publicKeyWrong: 'b7a3c12dc0c8c748ab07525b701122b88bd78f600c76342d27f24e5f92444cde',

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
        test("ES256k", async ()=>{
            let signature = JWT.signES256k(es256kTestResource.jwtDecoded.header, es256kTestResource.jwtDecoded.payload, es256kTestResource.privateKey);
            
            let validity = JWT.verifyES256k(signature, es256kTestResource.publicKey);
            expect(validity).toBeTruthy();

            validity = JWT.verifyES256k(signature, es256kTestResource.publicKeyWrong);
            expect(validity).toBeFalsy();
        });
        test("ES256k-R", async () => {
            let signature = JWT.signES256kRecoverable(es256kRecoverableResources.jwtDecoded.header, es256kRecoverableResources.jwtDecoded.payload, es256kRecoverableResources.privateKey);

            let validity = JWT.verifyES256kRecoverable(signature, es256kRecoverableResources.publicKey);
            expect(validity).toBeTruthy();

            validity = JWT.verifyES256kRecoverable(signature, es256kRecoverableResources.publicKeyWrong);
            expect(validity).toBeFalsy();
        });
        test("EdDSA", async () =>{
            let signature = JWT.signEdDSA(edDsaTestResources.jwtDecoded.header, edDsaTestResources.jwtDecoded.payload, edDsaTestResources.privateKey);

            let validity = JWT.verifyEdDSA(signature, edDsaTestResources.publicKey);
            expect(validity).toBeTruthy();

            validity = JWT.verifyEdDSA(signature, edDsaTestResources.publicKeyWrong);
            expect(validity).toBeFalsy();
        });
        test('Wrappers', async () =>{
            try {
                let rsaKeyPair = generateKeyPairSync('rsa', {
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
                let signature = JWT.signJWT(rs256TestResource.jwtDecoded.header, rs256TestResource.jwtDecoded.payload, rsaKeyPair.privateKey);
                let validity = JWT.verifyJWT(signature, 'RS256', rsaKeyPair.publicKey);
                expect(validity).toBeTruthy();

                signature = JWT.signJWT(es256kTestResource.jwtDecoded.header, es256kTestResource.jwtDecoded.payload, es256kTestResource.privateKey);
                validity = JWT.verifyJWT(signature, 'ES256K', es256kTestResource.publicKey);
                expect(validity).toBeTruthy();

                signature = JWT.signJWT(es256kRecoverableResources.jwtDecoded.header, es256kRecoverableResources.jwtDecoded.payload, es256kRecoverableResources.privateKey);
                validity = JWT.verifyJWT(signature, 'ES256K-R', es256kRecoverableResources.publicKey);
                expect(validity).toBeTruthy();

                signature = JWT.signJWT(edDsaTestResources.jwtDecoded.header, edDsaTestResources.jwtDecoded.payload, edDsaTestResources.privateKey);
                validity = JWT.verifyJWT(signature, 'EdDSA', edDsaTestResources.publicKey);
                expect(validity).toBeTruthy();
            } catch (err) {
                let errors = []
                while(err){
                    errors.push(err.message);
                    err = err.inner;
                }
                console.log(errors);
                throw new Error('Test failed');
            }
        })
    });
});