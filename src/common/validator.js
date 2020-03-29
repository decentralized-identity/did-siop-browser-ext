const JWT = require('./jwt');
const Url = require('url-parse');
const $ = require('jquery');

const ERRORS = Object.freeze({
    JWT_RESOLVE_ERROR: 'Jwt resolve error',
    BAD_REQUEST_ERROR: 'Bad request error'
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
        return true;
    }
    return false;
}

module.exports = {
    parseRequest,
    validateRequestParams,
    validateRequestJWT,
    ERRORS
};