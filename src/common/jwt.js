const didJWT = require('did-jwt');
const resolver = require('./resolver')();

const verifyJWT = async function(jwt){
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
}

module.exports = { verifyJWT, decodeJWT };