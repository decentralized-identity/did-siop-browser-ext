const base64url = require('base64url');
const crypto = require('crypto');
const rs256 = require('jwa')('RS256');
const EC = require('elliptic').ec;
const EdDSA = require('elliptic').eddsa;
const keyToEtherAddress = require('ethereum-public-key-to-address');

const ERRORS = Object.freeze({
    BASE_64_URL_ENCODE_ERROR: 'Base64Url encode error',
    BASE_64_URL_DECODE_ERROR: 'Base64Url decode error',
    RS256_SIGNING_ERROR: 'RS256 signing error',
    RS256_VERIFICATION_ERROR: 'RS256 verification error',
    ES256k_SIGNING_ERROR: 'ES256k signing error',
    ES256K_VERIFICATION_ERROR: 'ES256K verification error',
    ES256k_R_SIGNING_ERROR: 'ES256k-R signing error',
    ES256K_R_VERIFICATION_ERROR: 'ES256K-R verification error',
    EDDSA_SIGNING_ERROR: 'EDDSA signing error',
    EDDSA_VERIFICATION_ERROR: 'EDDSA verification error',
});

const encodeBase64Url = function(plain){
    try{
        return base64url.encode(JSON.stringify(plain));
    }
    catch(err){
        let custom = new Error(ERRORS.BASE_64_URL_ENCODE_ERROR);
        custom.inner = err;
        throw custom;
    }
}

const decodeBase64Url = function (encoded){
    try{
        return JSON.parse(base64url.decode(encoded));
    }
    catch(err){
        let custom = new Error(ERRORS.BASE_64_URL_DECODE_ERROR);
        custom.inner = err;
        throw custom;
    }
}

const leftpad = function (data, size = 64){
    if (data.length === size) return data
    return '0'.repeat(size - data.length) + data
}

const signRS256 = function(header, payload, privKey){
    try{
        let unsigned = encodeBase64Url(header) + '.' + encodeBase64Url(payload);
        let signature = rs256.sign(unsigned, privKey);
        return unsigned + '.' + signature
    }
    catch(err){
        let custom = new Error(ERRORS.RS256_SIGNING_ERROR);
        custom.inner = err;
        throw custom;
    }
}

const verifyRS256 = function(jwt, pubKey){
    try {
        let input = jwt.split('.')[0] + '.' + jwt.split('.')[1];
        let signature = jwt.split('.')[2];
        return rs256.verify(input, signature, pubKey);
    } catch (err) {
        let custom = new Error(ERRORS.RS256_VERIFICATION_ERROR);
        custom.inner = err;
        throw custom;
    }
}

const signES256k = function(header, payload, privKey, recoverable){
    try{
        let ec = new EC('secp256k1');
        let sha256 = crypto.createHash('sha256');

        let unsigned = encodeBase64Url(header) + '.' + encodeBase64Url(payload);
        let hash = sha256.update(unsigned).digest('hex');

        let key = ec.keyFromPrivate(privKey);

        let ec256k_signature = key.sign(hash);

        let jose = Buffer.alloc(recoverable? 65 : 64);
        Buffer.from(leftpad(ec256k_signature.r.toString('hex')), 'hex').copy(jose, 0);
        Buffer.from(leftpad(ec256k_signature.s.toString('hex')), 'hex').copy(jose, 32);
        if(recoverable)jose[64] = ec256k_signature.recoveryParam;

        return unsigned + '.' + base64url.encode(jose);
    }
    catch (err) {
        let custom = new Error(ERRORS.ES256k_SIGNING_ERROR);
        custom.inner = err;
        throw custom;
    }
}

const verifyES256k = function(jwt, pubKey, recoverable){
    try {
        let sha256 = crypto.createHash('sha256');
        let ec = new EC('secp256k1');

        let input = jwt.split('.')[0] + '.' + jwt.split('.')[1];
        let hash = sha256.update(input).digest();

        let sigBuffer = Buffer.from(base64url.toBuffer(jwt.split('.')[2]));
        if(sigBuffer.length !== (recoverable? 65 : 64)) throw new Error('Invalid JWT');
        let signatureObj = {
            r: sigBuffer.slice(0, 32).toString('hex'),
            s: sigBuffer.slice(32, 64).toString('hex')
        }

        if (recoverable) {
            let recoveredKey = ec.recoverPubKey(hash, signatureObj, sigBuffer[64]);
            return (
                recoveredKey.encode('hex') === pubKey ||
                recoveredKey.encode('hex', true) === pubKey ||
                keyToEtherAddress(recoveredKey.encode('hex')) === pubKey
            )
        }

        let key = ec.keyFromPublic(pubKey, 'hex');

        return key.verify(hash, signatureObj);
    } catch (err) {
        let custom = new Error(ERRORS.ES256K_VERIFICATION_ERROR);
        custom.inner = err;
        throw custom;
    }
}

const signES256kRecoverable = function (header, payload, privKey) {
    try {
        return signES256k(header, payload, privKey, true)
    } catch (err) {
        let custom = new Error(ERRORS.ES256k_R_SIGNING_ERROR);
        custom.inner = err;
        throw custom;
    }
}

const verifyES256kRecoverable = function (jwt, pubKey){
    try {
        return verifyES256k(jwt, pubKey, true);
    } catch (err) {
        let custom = new Error(ERRORS.ES256K_R_VERIFICATION_ERROR);
        custom.inner = err;
        throw custom;
    }
}

const signEdDSA = function (header, payload, privKey){
    try {
        let ec = new EdDSA('ed25519');

        let unsigned = encodeBase64Url(header) + '.' + encodeBase64Url(payload);

        let key = ec.keyFromSecret(privKey);

        let edDsa_signature = key.sign(Buffer.from(unsigned));

        return unsigned + '.' + encodeBase64Url(edDsa_signature.toHex());
    } catch (err) {
        let custom = new Error(ERRORS.EDDSA_SIGNING_ERROR);
        custom.inner = err;
        throw custom;
    }
}

const verifyEdDSA = function(jwt, pubKey){
    try {
        let ec = new EdDSA('ed25519');

        let input = jwt.split('.')[0] + '.' + jwt.split('.')[1];

        let signature = jwt.split('.')[2];

        let key = ec.keyFromPublic(pubKey, 'hex');

        return key.verify(Buffer.from(input), base64url.decode(signature));
    } catch (err) {
        let custom = new Error(ERRORS.EDDSA_VERIFICATION_ERROR);
        custom.inner = err;
        throw custom;
    }
}

const sign = function(header, payload, algo, privKey){
    switch(algo){
        case 'RS256': return signRS256(header, payload, privKey);
        case 'ES256K': return signES256k(header, payload, privKey);
        case 'ES256K-R': return signES256kRecoverable(header, payload, privKey);
    }
}

const verify = function(jwt, algo, pubKey){
    switch(algo){
        case 'RS256': return verifyRS256(jwt, pubKey);
        case 'ES256K': return verifyES256k(jwt, pubKey);
        case 'ES256K-R': return verifyES256kRecoverable(jwt, pubKey);
    }
}

module.exports = {
    encodeBase64Url,
    decodeBase64Url,
    signRS256,
    verifyRS256,
    signES256k,
    verifyES256k,
    signES256kRecoverable,
    verifyES256kRecoverable,
    signEdDSA,
    verifyEdDSA,
    sign,
    verify,
    ERRORS
};