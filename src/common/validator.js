const JWT = require('./jwt');
const Url = require('url-parse');
const $ = require('jquery');
const resolver = require('./resolver')();
const ethereumAddress = require('ethereum-checksum-address');

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
    const parsedRequest = new Url(raw, true);
    return parsedRequest;
}

const validateRequestParams = async function(request){
    let parsed = parseRequest(request);
    if (
        parsed.protocol === 'openid:' &&
        parsed.slashes === true &&
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

const getPublicKeyFromDifferentTypes = function(key){
    if (key.publicKeyBase64) return key.publicKeyBase64;
    else if (key.publicKeyBase58) return key.publicKeyBase58;
    else if (key.publicKeyHex) return key.publicKeyHex;
    else if (key.publicKeyPem) return key.publicKeyPem;
    else if (key.publicKeyJwk) return JSON.stringify(key.publicKeyJwk);
    else if (key.publicKeyPgp) return key.publicKeyPgp;
    else if (key.ethereumAddress) return ethereumAddress.toChecksumAddress(key.ethereumAddress);
    else if (key.address) return key.address;
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

        let doc = decodedPayload.doc;
        if (doc === undefined || (doc && doc.authentication.length < 1)) {
            try{
                doc = await resolver.resolve(decodedPayload.iss);
            }
            catch(err){
                doc = undefined;
            }
        }

        if (doc !== undefined && doc.authentication.length > 0) {
            for(method of doc.authentication){
                if(method.id === decodedHeader.kid){
                    publicKey = getPublicKeyFromDifferentTypes(method);
                }
                else if(method.publicKey !== undefined && method.publicKey.includes(decodedHeader.kid)){
                    for (key of doc.publicKey) {
                        if (key.id === decodedHeader.kid) {
                            publicKey = getPublicKeyFromDifferentTypes(key);
                        }
                    }
                }
                else if(method === decodedHeader.kid){
                    for (key of doc.publicKey) {
                        if (key.id === method) {
                            publicKey = getPublicKeyFromDifferentTypes(key);
                        }
                    }
                    //Other verification methods (non public key)
                }
            }
        }
        else{
            let jwks = decodedPayload.registration.jwks;
            if (jwks === undefined || jwks.keys.length < 1 && decodedPayload.registration.jwks_uri !== undefined) {
                try{
                    jwks = $.get(decodedPayload.registration.jwks_uri);
                }
                catch(err){
                    jwks = undefined;
                }
            }
            if (jwks !== undefined && jwks.keys.length > 0){
                for(jwk of jwks){
                    if(jwk.id === decodedHeader.kid){
                        //publicKey = keyFromJWK(jwk);
                    }
                }
            }
            else{
                return Promise.reject(new Error(ERRORS.JWK_ERROR));
            }
        }

        if(publicKey){
            let validity = JWT.verify(requestJWT, decodedHeader.alg, publicKey);
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

module.exports = {
    parseRequest,
    validateRequestParams,
    validateRequestJWT,
    ERRORS
};