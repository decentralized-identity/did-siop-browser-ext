const NodeRSA = require('node-rsa');
var EC = require('elliptic').ec;
const EdDSA = require('elliptic').eddsa;
const base64url = require('base64url');
const crypto = require('crypto');

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

const getRSAJWK = function(publicKeyPEM){
    let key = new NodeRSA();
    key.importKey(publicKeyPEM, 'pkcs8-public-pem');
    let n = base64url.encode(key.keyPair.n.toBuffer().slice(1));
    let e = key.keyPair.e.toString(16);
    e = (e%2===0)? e: '0'+e;
    e = Buffer.from(e, 'hex').toString('base64');
    return{
        e,
        kty: 'RSA',
        n,
    }
}

const getECJWK = function(publicKeyHex){
    let ec = new EC('secp256k1');
    let key = ec.keyFromPublic(publicKeyHex, 'hex');
    let x = base64url.encode(key.getPublic().getX().toBuffer());
    let y = base64url.encode(key.getPublic().getY().toBuffer());
    return {
        crv: 'secp256k1',
        kty: 'EC',
        x,
        y,
    }
}

const getJWK = function(key, kty){
    if (kty) {
        switch (kty) {
            case 'RSA':
                return getRSAJWK(key);
            case 'EC':
                return getECJWK(key);
            default:
                throw new Error(ERRORS.INCORRECT_ALGORITHM);
        }
    } else {
        throw new Error(ERRORS.INCORRECT_ALGORITHM);
    }
}

const getBase64UrlEncodedThumbprint = function (jwk) {
    let lexicallyOrderedJWK;

    switch(jwk.kty){
        case 'RSA': {
            lexicallyOrderedJWK = {
                e: jwk.e,
                kty: jwk.kty,
                n: jwk.n,
            };
            break;
        }
        case 'EC': {
            lexicallyOrderedJWK = {
                crv: jwk.crv,
                kty: jwk.kty,
                x: jwk.x,
                y: jwk.y,
            };
            break;
        }
        default: throw new Error(ERRORS.INVALID_JWK);
    }

    let sha256 = crypto.createHash('sha256');
    let hash = sha256.update(JSON.stringify(lexicallyOrderedJWK)).digest();
    return base64url.encode(hash);
}

module.exports = {
    getRSA256PublicKeyPem,
    getECPublicKeyHex,
    getPublicKey,
    getRSAJWK,
    getECJWK,
    getJWK,
    getBase64UrlEncodedThumbprint,
    ERRORS,
}