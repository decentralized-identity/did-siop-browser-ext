const JWT = require('../src/common/jwt');
const { ERRORS } = require('../src/common/validator');
const { generateKeyPairSync } = require('crypto');

const jwtGoodDecoded = {
    header: {
        "typ": "JWT",
        "alg": "ES256K",
        "kid": "did:example:0xab#key-1"
    },
    payload: {
        "iss": "did:example:0xab",
        "response_type": "id_token",
        "client_id": "https://my.rp.com/cb",
        "scope": "openid did_authn",
        "state": "af0ifjsldkj",
        "nonce": "n-0S6_WzA2Mj",
        "response_mode": "form_post",
        "registration": {
            "jwks_uri": "https://uniresolver.io/1.0/identifiers/did:example:0xab;transform-keys=jwks",
            "id_token_signed_response_alg": ["ES256K", "EdDSA", "RS256"]
        }
    }
}

const keyPair = generateKeyPairSync('rsa', {
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

const jwtGoodEncoded = JWT.signRS256(jwtGoodDecoded.header, jwtGoodDecoded.payload, keyPair.privateKey);
const jwt_uri = 'http://localhost/requestJWT';

const getBadRequestJWT = function(jwt, isPayload, property, value = null){
    let newJWT = JSON.parse(JSON.stringify(jwt));
    if(isPayload){
        if(value === null){
            delete newJWT.payload[property];
        }
        else{
            newJWT.payload[property] = value;
        }
    }
    else{
         if (value === null) {
             delete newJWT.header[property];
         } else {
             newJWT.header[property] = value;
         }
    }
    return JWT.signRS256(newJWT.header, newJWT.payload, keyPair.privateKey);
}

const jwts = {
    jwtGoodDecoded,
    jwtGoodEncoded,
    bad:{
        jwtBadNoKid: getBadRequestJWT(jwtGoodDecoded, false, 'kid'),
        jwtBadNoIss: getBadRequestJWT(jwtGoodDecoded, true, 'iss'),
        jwtBadNoScope: getBadRequestJWT(jwtGoodDecoded, true, 'scope'),
        jwtBadIncorrectScope: getBadRequestJWT(jwtGoodDecoded, true, 'scope', 'openid'),
        jwtBadNoRegistration: getBadRequestJWT(jwtGoodDecoded, true, 'registration'),
    }
}

const queryObj = {
    response_type: 'id_token',
    client_id: 'https://rp.example.com/cb',
    scope: 'openid did_authn',
    request: jwtGoodEncoded
}

const requests = {
    good: {
        requestGoodEmbeddedJWT : 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request=' + jwtGoodEncoded,
        requestGoodUriJWT : 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request_uri=' + jwt_uri
    },
    bad:{
        requestBadProtocol : 'opend://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request=' + jwtGoodEncoded,
        requestBadNoSlashes : 'openid:?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request=' + jwtGoodEncoded,
        requestBadNoResponseType : 'openid://?response_tye=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request=' + jwtGoodEncoded,
        requestBadIncorrectResponseType : 'openid://?response_type=id_toke&client_id=https://rp.example.com/cb&scope=openid did_authn&request=' + jwtGoodEncoded,
        requestBadNoClientId : 'openid://?response_type=id_token&client_i=https://rp.example.com/cb&scope=openid did_authn&request=' + jwtGoodEncoded,
        requestBadNoScope : 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openi did_authn&request=' + jwtGoodEncoded,
        requestBadNoScopeOpenId : 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=did_authn&request=' + jwtGoodEncoded,
        requestBadNoScopeDidAuthN : 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid&request=' + jwtGoodEncoded,
        requestBadNoJWT : 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request=',
        requestBadNoJWTUri : 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request_uri=',
        requestBadIncorrectJWTUri : 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request_uri=http://localhost/incorrectRequestJWT',

    }
}

const errors = {
    badRequestError : new Error(ERRORS.BAD_REQUEST_ERROR),
    noJWTError : new Error(ERRORS.JWT_RESOLVE_ERROR),
}

module.exports = {
    jwts,
    queryObj,
    requests,
    errors
}