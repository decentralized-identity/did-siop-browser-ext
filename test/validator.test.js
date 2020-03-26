const validator = require('../src/common/validator');
const nock = require('nock');

const jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1ODQxMDA4MTksImlzcyI6ImRpZDpldGhyOjB4QjA3RWFkOTcxN2I0NEI2Y0Y0MzljNDc0MzYyYjlCMDg3N0NCQkY4MyIsInJlc3BvbnNlX3R5cGUiOiJpZF90b2tlbiIsImNsaWVudF9pZCI6Imh0dHBzOi8vbXkucnAuY29tL2NiIiwic2NvcGUiOiJvcGVuaWQgZGlkX2F1dGhuIiwic3RhdGUiOiJhZjBpZmpzbGRraiIsIm5vbmNlIjoibi0wUzZfV3pBMk1qIiwicmVzcG9uc2VfbW9kZSI6ImZvcm1fcG9zdCIsInJlZ2lzdHJhdGlvbiI6eyJqd2tzX3VyaSI6Imh0dHBzOi8vdW5pcmVzb2x2ZXIuaW8vMS4wL2lkZW50aWZpZXJzL2RpZDpldGhyOjB4QjA3RWFkOTcxN2I0NEI2Y0Y0MzljNDc0MzYyYjlCMDg3N0NCQkY4Mzt0cmFuc2Zvcm0ta2V5cz1qd2tzIiwiaWRfdG9rZW5fc2lnbmVkX3Jlc3BvbnNlX2FsZyI6WyJFUzI1NksiLCJFZERTQSIsIlJTMjU2Il19fQ.LI6KBAAVAdLRL4pfYPYbRcz1pKJ5WKVxgUp7eXntC1J6OT1WqegFqdgONshNIXXdULUhxy1C0paXc85Kgd9bWA'
const jwt_uri = 'http://localhost/requestJWT';
const queryObj = {
    response_type: 'id_token',
    client_id: 'https://rp.example.com/cb',
    scope: 'openid did_authn',
    request: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1ODQxMDA4MTksImlzcyI6ImRpZDpldGhyOjB4QjA3RWFkOTcxN2I0NEI2Y0Y0MzljNDc0MzYyYjlCMDg3N0NCQkY4MyIsInJlc3BvbnNlX3R5cGUiOiJpZF90b2tlbiIsImNsaWVudF9pZCI6Imh0dHBzOi8vbXkucnAuY29tL2NiIiwic2NvcGUiOiJvcGVuaWQgZGlkX2F1dGhuIiwic3RhdGUiOiJhZjBpZmpzbGRraiIsIm5vbmNlIjoibi0wUzZfV3pBMk1qIiwicmVzcG9uc2VfbW9kZSI6ImZvcm1fcG9zdCIsInJlZ2lzdHJhdGlvbiI6eyJqd2tzX3VyaSI6Imh0dHBzOi8vdW5pcmVzb2x2ZXIuaW8vMS4wL2lkZW50aWZpZXJzL2RpZDpldGhyOjB4QjA3RWFkOTcxN2I0NEI2Y0Y0MzljNDc0MzYyYjlCMDg3N0NCQkY4Mzt0cmFuc2Zvcm0ta2V5cz1qd2tzIiwiaWRfdG9rZW5fc2lnbmVkX3Jlc3BvbnNlX2FsZyI6WyJFUzI1NksiLCJFZERTQSIsIlJTMjU2Il19fQ.LI6KBAAVAdLRL4pfYPYbRcz1pKJ5WKVxgUp7eXntC1J6OT1WqegFqdgONshNIXXdULUhxy1C0paXc85Kgd9bWA'
}

const requestGoodEmbeddedJWT = 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request=' + jwt;
const requestGoodUriJWT = 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request_uri=' + jwt_uri;

const requestBadProtocol = 'opend://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request=' + jwt;
const requestBadNoSlashes = 'openid:?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request=' + jwt;
const requestBadNoResponseType = 'openid://?response_tye=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request=' + jwt;
const requestBadIncorrectResponseType = 'openid://?response_type=id_toke&client_id=https://rp.example.com/cb&scope=openid did_authn&request=' + jwt;
const requestBadNoClientId = 'openid://?response_type=id_token&client_i=https://rp.example.com/cb&scope=openid did_authn&request=' + jwt;
const requestBadNoScope = 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openi did_authn&request=' + jwt;
const requestBadNoScopeOpenId = 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=did_authn&request=' + jwt;
const requestBadNoScopeDidAuthN = 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid&request=' + jwt;
const requestBadNoJWT = 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request=';
const requestBadNoJWTUri = 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request_uri=';
const requestBadIncorrectJWTUri = 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request_uri=http://localhost/incorrectRequestJWT';

const badRequestError = new Error('Bad request');
const noJWTError = new Error('Cannot resolve request jwt');

describe("Validator -> To test request validation", function () {
    test("Request parsing", async () => {
        let parsed = validator.parseRequest(requestGoodEmbeddedJWT);
        expect(parsed.slashes).toBeTruthy();
        expect(parsed.protocol).toEqual('openid:');
        expect(parsed.query).toEqual(queryObj);
    });
    describe("Request params validation", function (){
        beforeAll(()=>{
            nock('http://localhost').get('/requestJWT').reply(200, jwt).get('/incorrectRequestJWT').reply(404,'Not found');
        });

        test('Request params validation - expect truthy', async () => {
            let returnedJWT = await validator.validateRequestParams(requestGoodEmbeddedJWT);
            expect(returnedJWT).toEqual(jwt);

            returnedJWT = undefined;
            returnedJWT = await validator.validateRequestParams(requestGoodUriJWT);
            expect(returnedJWT).toEqual(jwt);
        });

        test('Request params validation - expect falsy', async () => {
            let validityPromise = validator.validateRequestParams(requestBadProtocol);
            await expect(validityPromise).rejects.toEqual(badRequestError);

            validityPromise = validator.validateRequestParams(requestBadNoSlashes);
            await expect(validityPromise).rejects.toEqual(badRequestError);

            validityPromise = validator.validateRequestParams(requestBadNoResponseType);
            await expect(validityPromise).rejects.toEqual(badRequestError);

            validityPromise = validator.validateRequestParams(requestBadIncorrectResponseType);
            await expect(validityPromise).rejects.toEqual(badRequestError);

            validityPromise = validator.validateRequestParams(requestBadNoClientId);
            await expect(validityPromise).rejects.toEqual(badRequestError);

            validityPromise = validator.validateRequestParams(requestBadNoScope);
            await expect(validityPromise).rejects.toEqual(badRequestError);

            validityPromise = validator.validateRequestParams(requestBadNoScopeOpenId);
            await expect(validityPromise).rejects.toEqual(badRequestError);

            validityPromise = validator.validateRequestParams(requestBadNoScopeDidAuthN);
            await expect(validityPromise).rejects.toEqual(badRequestError);

            validityPromise = validator.validateRequestParams(requestBadNoJWT);
            await expect(validityPromise).rejects.toEqual(noJWTError);

            validityPromise = validator.validateRequestParams(requestBadNoJWTUri);
            await expect(validityPromise).rejects.toEqual(noJWTError);

            validityPromise = validator.validateRequestParams(requestBadIncorrectJWTUri);
            await expect(validityPromise).rejects.toEqual(noJWTError);
        });
    });
   
});
