const jwt = require('./jwt');
const Url = require('url-parse');
const $ = require('jquery');

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
                return Promise.reject(new Error('Cannot resolve request jwt'));
            }
        }
        else{
            return Promise.reject(new Error('Cannot resolve request jwt'));
        }
    }
    else{
        return Promise.reject(new Error('Bad request'));
    }
}

/* const validateRequest = async function(rqst){
    try{
        return(
            //OAuth 2.0 
            rqst.response_type === 'id_token' &&
            rqst.client_id !== undefined &&
            //OpenId Connect
            rqst.scope.includes('openid') &&
            //DID-SIOP
            rqst.scope.includes('did_authn') &&
            await validateRequestObj(rqst.request)
        )
    }
    catch(err){
        if(err.msglist){
            err.msglist.push('validator/validateRequest');
        }
        else{
            err.msglist = [];
        }
        throw err;
    }
}

const validateRequestObj = async function(requestJWT){
    try{
        let verified = await jwt.verifyJWT(requestJWT);
        if(verified){
            return (
                verified.payload.scope.includes('did_authn') &&
                (verified.payload.registration.jwks_uri === undefined || verified.payload.registration.jwks_uri.includes(verified.payload.iss))
            );
        }
        return false;
    }
    catch(err){
        if(err.msglist){
            err.msglist.push('validator/validateRequestObj');
        }
        else{
            err.msglist = [];
        }
        throw err;
    }
} */

module.exports = {
    validateRequestParams,
    parseRequest
};