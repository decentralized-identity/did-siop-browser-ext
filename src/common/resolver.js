const { Resolver } = require('did-resolver');
const ethr = require('ethr-did-resolver');
const web = require('web-did-resolver');
const { resolverRpcUrls } = require('./config');

const ethrResolver = ethr.getResolver({ rpcUrl: resolverRpcUrls.ethr});
const webResolver = web.getResolver();

const methodRegistry = {
    ...ethrResolver,
    ...webResolver
}

const resolver = function () {
    return new Resolver(methodRegistry);
}

module.exports = resolver;