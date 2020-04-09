const ethereumAddress = require('ethereum-checksum-address');

const getPublicKeyFromDifferentTypes = function (key) {
    if (key.publicKeyBase64) return key.publicKeyBase64;
    else if (key.publicKeyBase58) return key.publicKeyBase58;
    else if (key.publicKeyHex) return key.publicKeyHex;
    else if (key.publicKeyPem) return key.publicKeyPem;
    else if (key.publicKeyJwk) return JSON.stringify(key.publicKeyJwk);
    else if (key.publicKeyPgp) return key.publicKeyPgp;
    else if (key.ethereumAddress) return ethereumAddress.toChecksumAddress(key.ethereumAddress);
    else if (key.address) return key.address;
}

const validateDidDoc = function(did, doc){
    return (
        doc &&
        doc['@context'] === 'https://w3id.org/did/v1' &&
        doc.id == did &&
        doc.authentication &&
        doc.authentication.length > 0
    );
}

module.exports = {
    getPublicKeyFromDifferentTypes,
    validateDidDoc,
}