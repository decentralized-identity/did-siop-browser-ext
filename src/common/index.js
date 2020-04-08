const { resolver } = require('./resolver')();
const { signJWT, verifyJWT } = require('./jwt');
const { getPublicKey, } = require('./jwk');
const { validateRequest } = require('./request');

module.exports = {
    resolver,
    signJWT,
    verifyJWT,
    getPublicKey,
    validateRequest,
}