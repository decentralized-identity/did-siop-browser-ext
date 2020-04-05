const NodeRSA = require('node-rsa');
var EC = require('elliptic').ec;
const EdDSA = require('elliptic').eddsa;
const base64url = require('base64url');

const ERRORS = Object.freeze({
    INVALID_JWK: 'Invalid JWK',
    INCORRECT_ALGORITHM: 'Incorrect algorithm type',
    INSUFFIENT_PARAMS: 'Insufficient parameters to retrieve key',
    INCORRECT_CURVE: 'Incorrect curve',
});

const getRSA256PublicKeyPem = function(jwk){
    if(jwk !== undefined){
        if(jwk.kty == 'RSA') {
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

const getECPublicKeyHex = function(jwk){
    if (jwk !== undefined) {
        if (jwk.kty == 'EC') {
            let ec;
            if(jwk.crv === 'secp256k1'){
                ec = new EC('secp256k1');
            }
            else if (jwk.crv === 'secp256k1') {
                ec = new EdDSA('ed25519');
            }
            else{
                throw new Error(ERRORS.INCORRECT_CURVE);
            }

            if (jwk.x && jwk.y) {
                let pub = {
                    x: base64url.decode(jwk.x, 'hex'),
                    y: base64url.decode(jwk.y, 'hex')
                }
                return ec.keyFromPublic(pub).getPublic().encode('hex');
            } else {
                throw new Error(ERRORS.INSUFFIENT_PARAMS);
            }

        } else {
            throw new Error(ERRORS.INCORRECT_ALGORITHM);
        }
    } else {
        throw new Error(ERRORS.INVALID_JWK);
    }
}

const getPublicKey = function(jwk){
    if(jwk.kty){
        switch(jwk.kty){
            case 'RSA': return getRSA256PublicKeyPem(jwk);
            case 'EC': return getECPublicKeyHex(jwk);
        }
    }
    else{
        throw new Error(ERRORS.INCORRECT_ALGORITHM);
    }
}

module.exports = {
    getRSA256PublicKeyPem,
    getECPublicKeyHex,
    getPublicKey,
    ERRORS,
}