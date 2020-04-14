const JWT = require('./jwt');
const JWK = require('./jwk');
const queryString = require('query-string');
const $ = require('jquery');
const { getKeyFromDidDoc, getKeyFromJWKS } = require('./util');

const ERRORS = Object.freeze({
    BAD_REQUEST_ERROR: 'Bad request error',
    JWT_RESOLVE_ERROR: 'Jwt resolve error',
    MALFORMED_JWT_ERROR: 'Malformed jwt error',
    VERIFICATION_KEY_ERROR: 'Public key error',
    JWK_ERROR: 'JWK error',
    JWT_VERIFICATION_ERROR: 'Jwt verification error',
    INVALID_SIGNATURE_ERROR: 'Invalid signature error'
});

const parseRequest = function(raw){
    return queryString.parseUrl(raw);
}

const validateRequestParams = async function(request){
    let parsed = parseRequest(request);
    if (
        parsed.url === 'openid://' &&
        parsed.query.response_type === 'id_token' &&
        (parsed.query.client_id !== undefined && parsed.query.client_id !== '') &&
        (parsed.query.scope !== undefined && parsed.query.scope.indexOf('openid did_authn') > -1)
    ){
        if (parsed.query.request !== undefined && parsed.query.request !== '') return parsed.query.request;
        if (parsed.query.request_uri !== undefined && parsed.query.request_uri !== '') {
            try{
                let requestJWT = await $.get(parsed.query.request_uri);
                return requestJWT;
            }
            catch(err){
                let custom = new Error(ERRORS.JWT_RESOLVE_ERROR);
                custom.inner = err;
                return Promise.reject(custom);
            }
        }
        else{
            let custom = new Error(ERRORS.JWT_RESOLVE_ERROR);
            return Promise.reject(custom);
        }
    }
    else{
        let custom = new Error(ERRORS.BAD_REQUEST_ERROR);
        return Promise.reject(custom);
    }
}

const validateRequestJWT = async function(requestJWT){
    let decodedHeader;
    let decodedPayload;
    try{
        decodedHeader = JWT.decodeBase64Url(requestJWT.split('.')[0]);
        decodedPayload = JWT.decodeBase64Url(requestJWT.split('.')[1]);
    }
    catch(err){
        throw err;
    }

    if(
        (decodedHeader.kid !== undefined && decodedHeader.kid !== '') &&
        (decodedPayload.iss !== undefined && decodedPayload.iss !== '') &&
        (decodedPayload.scope !== undefined && decodedPayload.scope.indexOf('did_authn') > -1) &&
        (decodedPayload.registration !== undefined && decodedPayload.registration !== '')
    ){
        let publicKey;

        try {
            publicKey = await getKeyFromDidDoc(decodedPayload.iss, decodedHeader.kid, decodedPayload.did_doc);
        } catch (err) {
            let jwk = await getKeyFromJWKS(decodedPayload.jwks, decodedPayload.jwks_uri, decodedHeader.kid);
            publicKey = JWK.getPublicKey(jwk);
        }

        if(publicKey){
            let validity = JWT.verifyJWT(requestJWT, decodedHeader.alg, publicKey);
            if(validity){
                return {
                    header: decodedHeader,
                    payload: decodedPayload
                }
            }
            else {
                return Promise.reject(ERRORS.INVALID_SIGNATURE_ERROR);
            }
        }
        else{
            return Promise.reject(new Error(ERRORS.VERIFICATION_KEY_ERROR));
        }
    }
    else{
        return Promise.reject(new Error(ERRORS.MALFORMED_JWT_ERROR));
    }
}

const validateRequest = async function(request){
    try{
        let requestJWT = await validateRequestParams(request);
        let jwtDecoded = await validateRequestJWT(requestJWT);
        return jwtDecoded;
    }
    catch(err){
        throw err;
    }

}

//options = Request optional fields { state, nonce, response_mode }
//rp = Relying party info { redirect_uri, request_uri, did, did_doc, registration: {} }
//signing = signing info { alg, signing_key, kid }
const generateRequest = async function ( rp = {}, signing = {}, options = {}) {
    const url = 'openid://';
    const query = {
        response_type: 'id_token',
        client_id: rp.redirect_uri,
        scope: 'openid did_authn',
    }

    if(rp.request_uri){
        query.request_uri = rp.request_uri;
    }
    else{
        let jwtHeader = {
            alg: signing.alg,
            type: 'JWT',
            kid: signing.kid
        }

        let jwtPayload = {
            iss: rp.did,
            responce_type: 'id_token',
            scope: 'openid did_authn',
            client_id: rp.redirect_uri,
            registration: rp.registration,
            ...options
        }

        if (rp.did_doc) jwtPayload.did_doc = rp.did_doc;

        let jwt = JWT.signJWT(jwtHeader, jwtPayload, signing.signing_key);

        query.request = jwt;
    }

    return queryString.stringifyUrl({
        url,
        query
    });
}

module.exports = {
    parseRequest,
    validateRequestParams,
    validateRequestJWT,
    validateRequest,
    generateRequest,
    ERRORS
};