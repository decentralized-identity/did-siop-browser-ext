const base64url = require('base64url');
const rs256 = require('jwa')('RS256');

const encodeBase64Url = function(plain){
    try{
        return base64url.encode(JSON.stringify(plain));
    }
    catch(err){
        throw new Error("Cannot encode jwt: " + err);
    }
}

const decodeBase64Url = function (encoded){
    try{
        return JSON.parse(base64url.decode(encoded));
    }
    catch(err){
        throw new Error("Cannot decode jwt: " + err);
    }
}

const signRS256 = function(header, payload, privKey){
    try{
        let unsigned = encodeBase64Url(header) + '.' + encodeBase64Url(payload);
        let signature = rs256.sign(unsigned, privKey);
        return unsigned + '.' + signature
    }
    catch(err){
        throw new Error("RS256 signning error: " + err);
    }
}

const verifyRS256 = function(jwt, pubKey){
    try {
        let input = jwt.split('.')[0] + '.' + jwt.split('.')[1];
        let signature = jwt.split('.')[2];
        return rs256.verify(input, signature, pubKey);
    } catch (err) {
        throw new Error("RS256 verification error: " + err);
    }
}


/* const verifyJWT = async function(jwt){
    try{
        let verified = undefined;
        verified = await didJWT.verifyJWT(jwt, {resolver: resolver});
        return verified;
    }
    catch(err){
        if(err.msglist){
            err.msglist.push('jwt/verifyJWT');
        }
        else{
            err.msglist = [];
        }
        throw err;
    }
}

const decodeJWT = function(jwt){
    try{
        return didJWT.decodeJWT(jwt);
    }
    catch(err){
        if(err.msglist){
            err.msglist.push('jwt/decodeJWT');
        }
        else{
            err.msglist = [];
        }
        throw err;
    }
} */

module.exports = {
    encodeBase64Url,
    decodeBase64Url,
    signRS256,
    verifyRS256,
};