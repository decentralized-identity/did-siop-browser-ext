const validator = require('../src/common/validator');

const embeddedJWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1ODQxMDA4MTksImlzcyI6ImRpZDpldGhyOjB4QjA3RWFkOTcxN2I0NEI2Y0Y0MzljNDc0MzYyYjlCMDg3N0NCQkY4MyIsInJlc3BvbnNlX3R5cGUiOiJpZF90b2tlbiIsImNsaWVudF9pZCI6Imh0dHBzOi8vbXkucnAuY29tL2NiIiwic2NvcGUiOiJvcGVuaWQgZGlkX2F1dGhuIiwic3RhdGUiOiJhZjBpZmpzbGRraiIsIm5vbmNlIjoibi0wUzZfV3pBMk1qIiwicmVzcG9uc2VfbW9kZSI6ImZvcm1fcG9zdCIsInJlZ2lzdHJhdGlvbiI6eyJqd2tzX3VyaSI6Imh0dHBzOi8vdW5pcmVzb2x2ZXIuaW8vMS4wL2lkZW50aWZpZXJzL2RpZDpldGhyOjB4QjA3RWFkOTcxN2I0NEI2Y0Y0MzljNDc0MzYyYjlCMDg3N0NCQkY4Mzt0cmFuc2Zvcm0ta2V5cz1qd2tzIiwiaWRfdG9rZW5fc2lnbmVkX3Jlc3BvbnNlX2FsZyI6WyJFUzI1NksiLCJFZERTQSIsIlJTMjU2Il19fQ.LI6KBAAVAdLRL4pfYPYbRcz1pKJ5WKVxgUp7eXntC1J6OT1WqegFqdgONshNIXXdULUhxy1C0paXc85Kgd9bWA'

const requestGood = 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request=' + embeddedJWT;

const requestBadProtocol = 'opend://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request=' + embeddedJWT;
const requestBadNoSlashes = 'openid:?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request=' + embeddedJWT;
const requestBadNoResponseType = 'openid://?response_tye=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request=' + embeddedJWT;
const requestBadIncorrectResponseType = 'openid://?response_type=id_toke&client_id=https://rp.example.com/cb&scope=openid did_authn&request=' + embeddedJWT;
const requestBadNoClientId = 'openid://?response_type=id_token&client_i=https://rp.example.com/cb&scope=openid did_authn&request=' + embeddedJWT;
const requestBadNoScope = 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openi did_authn&request=' + embeddedJWT;
const requestBadNoScopeOpenId = 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=did_authn&request=' + embeddedJWT;
const requestBadNoScopeDidAuthN = 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid&request=' + embeddedJWT;

const queryObj = {
    response_type: 'id_token',
        client_id: 'https://rp.example.com/cb',
        scope: 'openid did_authn',
        request: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1ODQxMDA4MTksImlzcyI6ImRpZDpldGhyOjB4QjA3RWFkOTcxN2I0NEI2Y0Y0MzljNDc0MzYyYjlCMDg3N0NCQkY4MyIsInJlc3BvbnNlX3R5cGUiOiJpZF90b2tlbiIsImNsaWVudF9pZCI6Imh0dHBzOi8vbXkucnAuY29tL2NiIiwic2NvcGUiOiJvcGVuaWQgZGlkX2F1dGhuIiwic3RhdGUiOiJhZjBpZmpzbGRraiIsIm5vbmNlIjoibi0wUzZfV3pBMk1qIiwicmVzcG9uc2VfbW9kZSI6ImZvcm1fcG9zdCIsInJlZ2lzdHJhdGlvbiI6eyJqd2tzX3VyaSI6Imh0dHBzOi8vdW5pcmVzb2x2ZXIuaW8vMS4wL2lkZW50aWZpZXJzL2RpZDpldGhyOjB4QjA3RWFkOTcxN2I0NEI2Y0Y0MzljNDc0MzYyYjlCMDg3N0NCQkY4Mzt0cmFuc2Zvcm0ta2V5cz1qd2tzIiwiaWRfdG9rZW5fc2lnbmVkX3Jlc3BvbnNlX2FsZyI6WyJFUzI1NksiLCJFZERTQSIsIlJTMjU2Il19fQ.LI6KBAAVAdLRL4pfYPYbRcz1pKJ5WKVxgUp7eXntC1J6OT1WqegFqdgONshNIXXdULUhxy1C0paXc85Kgd9bWA'
}

describe("Validator -> To test request validation", function () {
    test("Request parsing", async () => {
        let parsed = await validator.parseRequest(requestGood);
        expect(parsed.slashes).toBeTruthy();
        expect(parsed.protocol).toEqual('openid:');
        expect(parsed.query).toEqual(queryObj);
    });
    describe("Request params validation", function (){
        test('Request params validation - expect truthy', async () => {
            let validity = await validator.validateRequestParams(requestGood);
            expect(validity).toBeTruthy();
        });
        test('Request params validation - expect falsy', async () => {
            let validity = await validator.validateRequestParams(requestBadProtocol);
            expect(validity).toBeFalsy();

            validity = await validator.validateRequestParams(requestBadNoSlashes);
            expect(validity).toBeFalsy();

            validity = await validator.validateRequestParams(requestBadNoResponseType);
            expect(validity).toBeFalsy();

            validity = await validator.validateRequestParams(requestBadIncorrectResponseType);
            expect(validity).toBeFalsy();

            validity = await validator.validateRequestParams(requestBadNoClientId);
            expect(validity).toBeFalsy();

            validity = await validator.validateRequestParams(requestBadNoScope);
            expect(validity).toBeFalsy();

            validity = await validator.validateRequestParams(requestBadNoScopeOpenId);
            expect(validity).toBeFalsy();

            validity = await validator.validateRequestParams(requestBadNoScopeDidAuthN);
            expect(validity).toBeFalsy();
        });
    });
   
});
