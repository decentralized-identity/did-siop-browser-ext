const { Resolver } = require('did-resolver');
const ethr = require('ethr-did-resolver');
const web = require('web-did-resolver');
const $ = require('jquery');
const { resolverRpcUrls } = require('./config');

const ethrResolver = ethr.getResolver({ rpcUrl: resolverRpcUrls.ethr});
const webResolver = web.getResolver();

const methodRegistry = {
    ...ethrResolver,
    ...webResolver
}

const resolve = async function (did) {
    try {
        let resolverResult = await $.get('https://uniresolver.io/1.0/identifiers/' + did);
        if (resolverResult.didDocument) return resolverResult.didDocument;
    } catch (err) {
        throw new Error('Cannot resolve did document');
    }
    throw new Error('Cannot resolve did document');
}

module.exports = { resolve }