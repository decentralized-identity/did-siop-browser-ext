const { resolver } = require('./resolver')();
const { signJWT, verifyJWT } = require('./jwt');
const { getPublicKey, } = require('./jwk');
const { validateRequest } = require('./validator');

module.exports = {
    resolver,
    signJWT,
    verifyJWT,
    getPublicKey,
    validateRequest,
}