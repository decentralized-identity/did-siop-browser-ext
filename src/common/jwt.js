const didJWT = require('did-jwt');
const { Resolver } = require('did-resolver');
const { getResolver } = require('ethr-did-resolver');

const providerConfig = { rpcUrl: "https://rinkeby.infura.io/v3/7063b610c6f34907b0dd0cdab07f397b"};

const verifyJWT = async function(jwt){
    try{
        let resolver = new Resolver(getResolver(providerConfig));
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