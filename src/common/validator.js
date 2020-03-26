const jwt = require('./jwt');
const Url = require('url-parse');

const parseRequest = function(raw){
    const parsedRequest = new Url(raw, true);
    return parsedRequest;
}

const validateRequestParams = async function(request){
    let parsed = parseRequest(request);
    return (
        parsed.protocol === 'openid:' &&
        parsed.slashes === true &&
        parsed.query.response_type === 'id_token' &&
        (parsed.query.client_id !== undefined && parsed.query.client_id !== '') &&
        (parsed.query.scope !== undefined && parsed.query.scope.indexOf('openid did_authn') > -1)
    );
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