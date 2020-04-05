const NodeRSA = require('node-rsa');
var EC = require('elliptic').ec;
const base64url = require('base64url');

const ERRORS = Object.freeze({
    INVALID_JWK: 'Invalid JWK',
    INCORRECT_ALGORITHM: 'Incorrect algorithm',
    INSUFFIENT_PARAMS: 'Insufficient parameters to retrieve key',
    INCORRECT_CURVE: 'Incorrect curve',
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

const getES256PublicKeyHex = function(jwk){
    if (jwk !== undefined) {
        if (jwk.alg == 'ES256') {
            if(jwk.crv === 'secp256k1'){
                if (jwk.x && jwk.y) {
                    let ec = new EC('secp256k1');

                    let pub = {
                        x: base64url.decode(jwk.x, 'hex'),
                        y: base64url.decode(jwk.y, 'hex')
                    }
                    return ec.keyFromPublic(pub).getPublic().encode('hex');
                } else {
                    throw new Error(ERRORS.INSUFFIENT_PARAMS);
                }
            }
            else{
                throw new Error(ERRORS.INCORRECT_CURVE);
            }
        } else {
            throw new Error(ERRORS.INCORRECT_ALGORITHM);
        }
    } else {
        throw new Error(ERRORS.INVALID_JWK);
    }
}

module.exports = {
    getRSA256PublicKeyPem,
    getES256PublicKeyHex,
    ERRORS
}