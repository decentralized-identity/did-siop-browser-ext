const { generateResponse, validateResponse } = require('../src/common/response');
const { verifyJWT } = require('../src/common/jwt');


describe("Response -> To test response functions", function () {
    test("Response generation and validation", async () => {
        let requestPayload = {
            "iss": "did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83",
            "response_type": "id_token",
            "client_id": "https://my.rp.com/cb",
            "scope": "openid did_authn",
            "state": "af0ifjsldkj",
            "nonce": "n-0S6_WzA2Mj",
            "response_mode": "form_post",
            "registration": {
                "jwks_uri": "https://uniresolver.io/1.0/identifiers/did:example:0xab;transform-keys=jwks",
                "id_token_signed_response_alg": ["ES256K", "ES256K-R", "EdDSA", "RS256"]
            }
        }
        let signing = {
            alg: 'ES256K-R',
            kid: "did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83#owner",
            signing_key: 'CE438802C1F0B6F12BC6E686F372D7D495BC5AA634134B4A7EA4603CB25F0964',
            public_key: '0xB07Ead9717b44B6cF439c474362b9B0877CBBF83',
        }
        let me = {
            did: 'did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83'
        }

        let response = await generateResponse(requestPayload, signing, me);

        let checkParams = {
            redirect_uri: 'https://my.rp.com/cb',
            nonce: "n-0S6_WzA2Mj",
            validBefore: Date.now() + 10000,
        }
        let validity = await validateResponse(response, checkParams);
        expect(validity).toBeTruthy();
    });
});
