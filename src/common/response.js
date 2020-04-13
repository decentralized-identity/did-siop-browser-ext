const { getKeyFromDidDoc } = require('./util');
const { verifyKeyPair, signJWT } = require('./jwt');
const { getJWK, getBase64UrlEncodedJWKThumbprint, getKeyTypeByAlgorithm } = require('./jwk');
const etheruemPrivateKeyToPublicKey = require('ethereum-private-key-to-public-key');


const ERRORS = Object.freeze({
    UNSUPPORTED_ALGO: 'Algorithm not supported',
    KEY_MISMATCH: 'Signing key does not match kid',
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

module.exports = {
    generateResponse,
}