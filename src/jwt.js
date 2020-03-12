const didJWT = require('did-jwt');

const verifyJWT = function(jwt){

}

const decodeJWT = function(jwt){
    return didJWT.decodeJWT(jwt);
}

module.exports = { verifyJWT, decodeJWT };