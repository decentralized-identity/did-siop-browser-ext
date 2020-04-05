const NodeRSA = require('node-rsa');
const base64url = require('base64url');

const ERRORS = Object.freeze({
    INVALID_JWK: 'Invalid JWK',
    INCORRECT_ALGORITHM: 'Incorrect algorithm',
    INSUFFIENT_PARAMS: 'Insufficient parameters to retrieve key',
});

const getRSA256PublicKeyPem = function(jwk){
    if(jwk !== undefined){
        if(jwk.alg == 'RS256') {
            if (jwk.n && jwk.e) {
                const key = new NodeRSA();
                key.importKey({
                    n: base64url.toBuffer(jwk.n),
                    e: base64url.toBuffer(jwk.e)
                }, 'components-public');
                return key.exportKey('pkcs8-public-pem');
            }
            else{
                throw new Error(ERRORS.INSUFFIENT_PARAMS);
            }
        } else {
            throw new Error(ERRORS.INCORRECT_ALGORITHM);
        }
    }
    else{
        throw new Error(ERRORS.INVALID_JWK);
    }
}

module.exports = {
    getRSA256PublicKeyPem,
    ERRORS
}