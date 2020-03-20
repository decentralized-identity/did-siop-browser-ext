const { Resolver} = require('did-resolver');
const { getResolver} = require('ethr-did-resolver');

const providerConfig = { rpcUrl: "https://rinkeby.infura.io/v3/7063b610c6f34907b0dd0cdab07f397b"};

const resolver = function () {
    return new Resolver(getResolver(providerConfig));
}

module.exports = resolver;