require("@babel/polyfill");
const { generateRequest } = require('./request');
const { validateResponse } = require('./response');

class RP {
    initialize(redirect_uri, did, rp_meta, did_doc) {
        this.redirect_uri = redirect_uri;
        this.did = did;
        this.rp_meta = rp_meta;
        this.did_doc = did_doc;
    }

    setSigningParams(signing_key, kid, algorithm) {
        this.algorithm = algorithm;
        this.signing_key = signing_key;
        this.kid = kid;
    }

    generateRequest(options = {}) {
        let rp = {
            redirect_uri: this.redirect_uri,
            did: this.did,
            did_doc: this.did_doc,
            registration: this.rp_meta,
        }

        let signing = {
            alg: this.algorithm,
            signing_key: this.signing_key,
            kid: this.kid,
        }

        return generateRequest(rp, signing, options);
    }

    generateUriRequest(request_uri) {
        let rp = {
            request_uri: this.request_uri,
        }
        return generateRequest(rp);
    }

    validateResponse(response, checkParams = {}) {
        return validateResponse(response, checkParams);
    }
}

module.exports = {
    RP,
}