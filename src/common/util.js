const ethereumAddress = require('ethereum-checksum-address');
const resolver = require('./resolver')();

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

const getKeyFromDidDoc = async function (did, kid, doc) {
    if(!validateDidDoc(did, doc)){
        let resolvedDoc = await resolver.resolve(did);
        if(validateDidDoc(did, resolvedDoc)){
            doc = resolvedDoc;
        }
        else{
            throw new Error('Invalid DID or Document');
        }
    }

    for(method of doc.authentication){
        if(method.id === kid) return getPublicKeyFromDifferentTypes(method);

        if(method.publicKey && method.publicKey.includes(kid)){
            for(pub of doc.publicKey){
                if(pub.id === kid) return getPublicKeyFromDifferentTypes(pub);
            }
        }

        if(method === kid){
            for (pub of doc.publicKey) {
                if (pub.id === kid) return getPublicKeyFromDifferentTypes(pub);
            }
            //Implement other verification methods here
        }
    }
    throw new Error('No public key matching kid');

}

module.exports = {
    getPublicKeyFromDifferentTypes,
    validateDidDoc,
    getKeyFromDidDoc,
}