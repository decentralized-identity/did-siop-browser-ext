const validateRequest = function(rqst){
    return(
        //OAuth 2.0 
        rqst.response_type === 'id_token' &&
        rqst.client_id !== undefined &&
        //OpenId Connect
        rqst.scope.includes('openid') &&
        //DID-SIOP
        rqst.scope.includes('did_authn')
    )
}

module.exports = { validateRequest };