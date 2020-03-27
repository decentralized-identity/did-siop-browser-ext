const JWT = require('../src/common/jwt');

const testJWT = {
    header: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    payload: 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ',
    signature: 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
}
const testJWTDecoded = {
  header: {
      "alg": "HS256",
      "typ": "JWT"
  },
  payload:{
    "sub": "1234567890",
    "name": "John Doe",
    "iat": 1516239022
  }
}

describe("JWT -> To test jwt functions", function () {
    test("JWT encode", async () => {
        let encodedHeader = JWT.encodeBase64Url(testJWTDecoded.header);
        expect(encodedHeader).toEqual(testJWT.header);

        let encodedPayload = JWT.encodeBase64Url(testJWTDecoded.payload);
        expect(encodedPayload).toEqual(testJWT.payload);
    });

    test("JWT decode", async () => {
        let decodedHeader = JWT.decodeBase64Url(testJWT.header);
        expect(decodedHeader).toEqual(testJWTDecoded.header);

        let decodedPayload = JWT.decodeBase64Url(testJWT.payload);
        expect(decodedPayload).toEqual(testJWTDecoded.payload);
    });
});