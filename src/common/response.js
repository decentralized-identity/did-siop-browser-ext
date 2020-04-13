const { getKeyFromDidDoc } = require('./util');
const { verifyKeyPair, signJWT, verifyJWT, decodeBase64Url } = require('./jwt');
const { getJWK, getBase64UrlEncodedJWKThumbprint, getKeyTypeByAlgorithm, getPublicKey } = require('./jwk');
const etheruemPrivateKeyToPublicKey = require('ethereum-private-key-to-public-key');


const ERRORS = Object.freeze({
    UNSUPPORTED_ALGO: 'Algorithm not supported',
    KEY_MISMATCH: 'Signing key does not match kid',
    MALFORMED_JWT_ERROR: 'Malformed response jwt',
    NON_SIOP_FLOW: 'Response jwt is not compatible with SIOP flow',
    INCORRECT_AUDIENCE: 'Incorrect audience',
    INCORRECT_NONCE: 'Incorrect nonce',
    NO_ISSUED_TIME: 'No iat in jwt',
    NO_EXPIRATION: 'No exp in jwt',
    JWT_VALIDITY_EXPIRED: 'JWT validity has expired',
    INVALID_JWK_THUMBPRINT: 'Invalid sub (sub_jwk thumbprint)',
    INVALID_SIGNATURE_ERROR: 'Invalid signature error',
});

//requestPayload = payload of the request
//signing = signing info { alg, kid, signing_key(private key),  }
//me = end user info { did, did_doc } 
const generateResponse = async function(requestPayload = {}, signing = {}, me = {}){
    try {
        let payload = {
            iss: 'https://self-issued.me',
        }
    
        let header = {
            typ: 'JWT',
        }
    
        if (requestPayload.registration.id_token_signed_response_alg.includes(signing.alg)){
            header.alg = signing.alg;
        }
        else{
            Promise.reject(ERRORS.UNSUPPORTED_ALGO);
        }
    
        let publicKey = await getKeyFromDidDoc(me.did, signing.kid, me.did_doc);
        if(verifyKeyPair(signing.signing_key, publicKey, signing.alg)){
            header.kid = signing.kid;
        }
        else{
            Promise.reject(ERRORS.KEY_MISMATCH);
        }
        if (signing.alg === 'ES256K-R') publicKey = etheruemPrivateKeyToPublicKey(signing.signing_key);

        payload.did = me.did;
        if(me.did_doc) payload.did_doc = me.did_doc;
        if(requestPayload.client_id) payload.aud = requestPayload.client_id;

        let kty = getKeyTypeByAlgorithm(signing.alg);
        payload.sub_jwk = getJWK(publicKey, kty);
        payload.sub = getBase64UrlEncodedJWKThumbprint(payload.sub_jwk);

        if (requestPayload.nonce) payload.nonce = requestPayload.nonce;
        if (requestPayload.state) payload.state = requestPayload.state;

        payload.iat = Date.now();
        payload.exp = Date.now() + 1000;

        return signJWT(header, payload, signing.signing_key);
    } catch (err) {
        Promise.reject(err);
    }
    

}

// checkParams { redirect_uri, nonce, validBefore, isExpirable }
const validateResponse = async function(response, checkParams = {}){
    let decodedHeader;
    let decodedPayload;
    try {
        decodedHeader = decodeBase64Url(response.split('.')[0]);
        decodedPayload = decodeBase64Url(response.split('.')[1]);
    } catch (err) {
        throw err;
    }

    if(
        (decodedHeader.kid !== undefined && decodedHeader.kid !== '') &&
        (decodedPayload.iss !== undefined && decodedPayload.iss !== '') &&
        (decodedPayload.aud !== undefined && decodedPayload.aud !== '') &&
        (decodedPayload.did !== undefined && decodedPayload.did !== '') &&
        (decodedPayload.sub !== undefined && decodedPayload.sub !== '') &&
        (decodedPayload.sub_jwk !== undefined && decodedPayload.sub_jwk !== '')
    ){
        if (!decodedPayload.iss === 'https://self-isued.me') return Promise.reject(new Error(ERRORS.NON_SIOP_FLOW));

        if (!decodedPayload.aud === checkParams.redirect_uri) return Promise.reject(new Error(ERRORS.INCORRECT_AUDIENCE));

        if (decodedPayload.nonce && (decodedPayload.nonce !== checkParams.nonce)) return Promise.reject(new Error(ERRORS.INCORRECT_NONCE)); 
        
        if (decodedPayload.nonce && (decodedPayload.nonce != checkParams.nonce)) return Promise.reject(new Error(ERRORS.INCORRECT_NONCE));

        if(checkParams.validBefore){
            if(decodedPayload.iat){
                if (decodedPayload.iat + checkParams.validBefore <= Date.now()) return Promise.reject(new Error(ERRORS.JWT_VALIDITY_EXPIRED));
            }
            else{
                return Promise.reject(new Error(ERRORS.NO_ISSUED_TIME));
            }
        }

        if(checkParams.isExpirable){
            if (decodedPayload.iat) {
                if (decodedPayload.exp <= Date.now()) return Promise.reject(new Error(ERRORS.JWT_VALIDITY_EXPIRED));
            } else {
                return Promise.reject(new Error(ERRORS.NO_EXPIRATION));
            }
        }

        let publicKey;

        try {
            publicKey = await getKeyFromDidDoc(decodedPayload.iss, decodedHeader.kid, decodedPayload.did_doc);
        } catch (err) {
            publicKey = getPublicKey(decodedPayload.sub_jwk);
        }

        let jwkThumbprint = getBase64UrlEncodedJWKThumbprint(decodedPayload.sub_jwk);
        if (jwkThumbprint !== decodedPayload.sub) return Promise.reject(new Error(ERRORS.INVALID_JWK_THUMBPRINT));

        let verificationAlg = (decodedHeader.alg)? decodedHeader.alg : "RS256";

        let validity = verifyJWT(response, verificationAlg, publicKey);
        
        if(validity) return {
            decodedHeader,
            decodedPayload
        }

        return Promise.reject(new Error(ERRORS.INVALID_SIGNATURE_ERROR));
    }
    else {
        return Promise.reject(new Error(ERRORS.MALFORMED_JWT_ERROR));
    }
}

module.exports = {
    generateResponse,
    validateResponse,
}