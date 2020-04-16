const JWT = require('./jwt');
const JWK = require('./jwk');
const queryString = require('query-string');
const $ = require('jquery');
const { getKeyFromDidDoc, getKeyFromJWKS } = require('./util');
const ERROR_RESPONSES  = require('./response.errors');

const RESPONSE_TYPES = ['id_token',];
const SUPPORTED_SCOPES = ['openid', 'did_authn',];
const REQUIRED_SCOPES = ['openid', 'did_authn',];

const parseRequest = function(raw){
    return queryString.parseUrl(raw);
}

const validateRequestParams = async function(request){
    let parsed = parseRequest(request);

    
    if (
        parsed.url !== 'openid://' ||
        (parsed.query.client_id === undefined || parsed.query.client_id.match(/^ *$/)) ||
        (parsed.query.response_type === undefined || parsed.query.response_type.match(/^ *$/))
    ) return Promise.reject(ERROR_RESPONSES.invalid_request.err);
    
    if (parsed.query.scope !== undefined){
        let requestedScopes = parsed.query.scope.split(' ');
        if (!(requestedScopes.every(s => SUPPORTED_SCOPES.includes(s))) || !(REQUIRED_SCOPES.every(s => requestedScopes.includes(s))))
            return Promise.reject(ERROR_RESPONSES.invalid_scope.err);
    }
    else return Promise.reject(ERROR_RESPONSES.invalid_request.err);

    if(!RESPONSE_TYPES.includes(parsed.query.response_type)) return Promise.reject(ERROR_RESPONSES.unsupported_response_type.err);

    if (parsed.query.request === undefined){
        if (parsed.query.request_uri === undefined) {
             return Promise.reject(ERROR_RESPONSES.invalid_request.err);
        }
        else{
            if (parsed.query.request_uri.match(/^ *$/)) return Promise.reject(ERROR_RESPONSES.invalid_request_uri.err)
            try {
                let requestJWT = await $.get(parsed.query.request_uri);
                return requestJWT? requestJWT : Promise.reject(ERROR_RESPONSES.invalid_request_uri.err);
            } catch (err) {
                return Promise.reject(ERROR_RESPONSES.invalid_request_uri.err);
            }
        }
    }
    else{
        if (parsed.query.request.match(/^ *$/)) return Promise.reject(ERROR_RESPONSES.invalid_request_object.err);
        return parsed.query.request;
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
        return Promise.reject(ERROR_RESPONSES.invalid_request_object.err);
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
            try {
                let jwk = await getKeyFromJWKS(decodedPayload.jwks, decodedPayload.jwks_uri, decodedHeader.kid);
                publicKey = JWK.getPublicKey(jwk);
            } catch (err) {
                publickey = undefined;
            }
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
                return Promise.reject(ERROR_RESPONSES.invalid_request_object.err);
            }
        }
        else{
            return Promise.reject(ERROR_RESPONSES.invalid_request_object.err);
        }
    }
    else{
        return Promise.reject(ERROR_RESPONSES.invalid_request_object.err);
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
            response_type: 'id_token',
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
    generateRequest
};