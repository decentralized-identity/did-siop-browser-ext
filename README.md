# did-siop #

## Overview ##
This implements Self Issued OpenIdConnect Provider (SIOP) for Decentralized Identities (DIDs). This is implemented  as a browser add-on and allows to integrate Identity Wallets with Relying Parties which uses OpenIDConnect Clients (OIDC Clients) which complies the SIOP specification.

Following are the primary specifications followed by this implementation.
* [OpenID Connect Core 1.0 incorporating errata set 1](https://openid.net/specs/openid-connect-core-1_0.html#SelfIssued)
* [Self-Issued OpenID Connect Provider DID Profile](https://identity.foundation/did-siop/)


# How to test
* Load ***dist>chrome*** folder into chrome extensions using developer mode
* Use ***did-siop.bundle.js*** in ***dist>lib*** to communicate with the extension from client apps/pages.
  * Include ***did-siop.bundle.js*** in any html page using script tag.
  * Create new instance using ***const siop_rp = new DID_SIOP.RP()***.
  * Initialize ***siop_rp.initialize(rp_redirect_uri, rp_did, rp_meta_data_object)***.
  * Set signing parameters ***siop_rp.setSigningParams(rp_private_key, rp_public_key_uri, algorithm)***.
    * Algorithms supported : RS256, ES256K, ES256K-R, EdDSA
  * Create request ***siop_rp.generateRequest().then(request => {}).catch(err => {})***.
  * Note: Since Chrome does not load urls with custom protocols in ***window.location.href***, the request needed to be loaded using ***window.open(new URL(request))***.
  * When the request is loaded to new page, the extension will capture it and asks for user confirmation.
  * Upon confirmation, extension will redirect the page to url provided as ***rp_redirect_uri*** with the response JWT as a fragment.
  * To validate, capture the response fragment in the callback page and use ***siop_rp.validateResponse(response).then(decodedJWT => {}).catch(err => {})*** to validate the response.
