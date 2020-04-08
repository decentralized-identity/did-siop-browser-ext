const validator = require('../src/common/request');
const nock = require('nock');
const resources = require('./request.test.resources');


describe("Validator -> To test request validation", function () {
    test("Request parsing", async () => {
        let parsed = validator.parseRequest(resources.requests.good.requestGoodEmbeddedJWT);
        expect(parsed.slashes).toBeTruthy();
        expect(parsed.protocol).toEqual('openid:');
        expect(parsed.query).toEqual(resources.queryObj);
    });
    describe("Request params validation", function (){
        beforeAll(()=>{
            nock('http://localhost').get('/requestJWT').reply(200, resources.jwts.jwtGoodEncoded).get('/incorrectRequestJWT').reply(404,'Not found');
        });

        test('Request params validation - expect truthy', async () => {
            let returnedJWT = await validator.validateRequestParams(resources.requests.good.requestGoodEmbeddedJWT);
            expect(returnedJWT).toEqual(resources.jwts.jwtGoodEncoded);

            returnedJWT = undefined;
            returnedJWT = await validator.validateRequestParams(resources.requests.good.requestGoodUriJWT);
            expect(returnedJWT).toEqual(resources.jwts.jwtGoodEncoded);
        });

        test('Request params validation - expect falsy', async () => {
            let validityPromise = validator.validateRequestParams(resources.requests.bad.requestBadProtocol);
            await expect(validityPromise).rejects.toEqual(resources.errors.badRequestError);

            validityPromise = validator.validateRequestParams(resources.requests.bad.requestBadNoSlashes);
            await expect(validityPromise).rejects.toEqual(resources.errors.badRequestError);

            validityPromise = validator.validateRequestParams(resources.requests.bad.requestBadNoResponseType);
            await expect(validityPromise).rejects.toEqual(resources.errors.badRequestError);

            validityPromise = validator.validateRequestParams(resources.requests.bad.requestBadIncorrectResponseType);
            await expect(validityPromise).rejects.toEqual(resources.errors.badRequestError);

            validityPromise = validator.validateRequestParams(resources.requests.bad.requestBadNoClientId);
            await expect(validityPromise).rejects.toEqual(resources.errors.badRequestError);

            validityPromise = validator.validateRequestParams(resources.requests.bad.requestBadNoScope);
            await expect(validityPromise).rejects.toEqual(resources.errors.badRequestError);

            validityPromise = validator.validateRequestParams(resources.requests.bad.requestBadNoScopeOpenId);
            await expect(validityPromise).rejects.toEqual(resources.errors.badRequestError);

            validityPromise = validator.validateRequestParams(resources.requests.bad.requestBadNoScopeDidAuthN);
            await expect(validityPromise).rejects.toEqual(resources.errors.badRequestError);

            validityPromise = validator.validateRequestParams(resources.requests.bad.requestBadNoJWT);
            await expect(validityPromise).rejects.toEqual(resources.errors.noJWTError);

            validityPromise = validator.validateRequestParams(resources.requests.bad.requestBadNoJWTUri);
            await expect(validityPromise).rejects.toEqual(resources.errors.noJWTError);

            validityPromise = validator.validateRequestParams(resources.requests.bad.requestBadIncorrectJWTUri);
            await expect(validityPromise).rejects.toEqual(resources.errors.noJWTError);
        });
    });
    describe("Request jwt validation", function(){
        test("Request jwt validation - expect truthy", async ()=>{
            try {
                let validity = await validator.validateRequestJWT(resources.jwts.jwtGoodEncoded);
                expect(validity).toBeTruthy();
            } catch (err) {
                let errors = []
                while (err) {
                    errors.push(err.message);
                    err = err.inner;
                }
                console.log(errors);
                throw new Error('Test failed');
            }
        });
        test("Request jwt validation - expect falsy", async () => {
            let validityPromise = validator.validateRequestJWT(resources.jwts.bad.jwtBadNoKid);
            await expect(validityPromise).rejects.toEqual(resources.errors.malformedJWTError);

            validityPromise = validator.validateRequestJWT(resources.jwts.bad.jwtBadNoIss);
            await expect(validityPromise).rejects.toEqual(resources.errors.malformedJWTError);

            validityPromise = validator.validateRequestJWT(resources.jwts.bad.jwtBadNoScope);
            await expect(validityPromise).rejects.toEqual(resources.errors.malformedJWTError);

            validityPromise = validator.validateRequestJWT(resources.jwts.bad.jwtBadIncorrectScope);
            await expect(validityPromise).rejects.toEqual(resources.errors.malformedJWTError);

            validityPromise = validator.validateRequestJWT(resources.jwts.bad.jwtBadNoRegistration);
            await expect(validityPromise).rejects.toEqual(resources.errors.malformedJWTError);
        });
    });
   
});
