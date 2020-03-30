const base64url = require('base64url');
const rs256 = require('jwa')('RS256');

const ERRORS = Object.freeze({
    BASE_64_URL_ENCODE_ERROR: 'Base64Url encode error',
    BASE_64_URL_DECODE_ERROR: 'Base64Url decode error',
    RS256_SIGNING_ERROR: 'RS256 signing error',
    RS256_VERIFICATION_ERROR: 'RS256 verification error'
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

const sign = function(header, payload, algo, privKey){
    switch(algo){
        case 'RS256': return signRS256(header, payload, privKey);
    }
}

const verify = function(jwt, algo, pubKey){
    switch(algo){
        case 'RS256': return verify(jwt, pubKey);
    }
}

module.exports = {
    encodeBase64Url,
    decodeBase64Url,
    signRS256,
    verifyRS256,
    sign,
    verify,
    ERRORS
};