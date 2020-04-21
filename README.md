# did-siop #

## Overview ##
This implements Self _Issued OpenId Connect Provider (SIOP)_ for _Decentralized Identities (DIDs)_. This is implemented  as a browser add-on and allows to integrate _Identity Wallets_ with _Relying Parties_ which uses OpenIDConnect Clients (OIDC Clients) complies the SIOP specification.

Following are the primary specifications followed by this implementation.
* [OpenID Connect Core 1.0 incorporating errata set 1](https://openid.net/specs/openid-connect-core-1_0.html#SelfIssued)
* [Self-Issued OpenID Connect Provider DID Profile](https://identity.foundation/did-siop/)

### Background ###
Even though the OIDC specifications have defined protocols to to be independent of any single or few authorization providers, currently day millions of people rely on Social Login schemes provided by companies such as Google and Facebook. SIOP-DID brings the authorization provider service under the control of true owner of the identity and its meta data. In other words, SIOP-DID replace Social Login Schemes with a software module run out of his/her browser (as an add-on) or smart phone application. Significance of this is that, identification and personal data will be under the full control of the owner of the data and will prevent unauthorized use of such data by any other party.

### Goals ###
* Being compatible with existing OIDC Clients and OIDC Providers which implements SIOP specification
* Adding validation rules for OIDC clients that have DID AuthN support to make full use of DIDs.
* Not rely on any intermediaries (private or public OPs)

### Protocol Flow ###
* User click on a button on RP Application to login to RP using SIOP DID
* This initiate a redirection to SIOP DID (in this case the browser extension) (_openid://<SIOP Request>_)
* The SIOP generate a response _<SIOP Response>_ based on the DID Method it supports. This response is signed using 'ES256K-R' (optional Encryption capabilities will be introduced later)


## See in Action ##
Follow steps below to see the SIOP in action.
Note: _Please note, the current version of SIOP DID available only as a Chrome Extension and tested on  Version 80.0.3987.163_

- Download the Chrome Extension from [this link](https://drive.google.com/file/d/1H6lrjISG3WxxYtwXA1FSowB9Q1lojOJU/view?usp=sharing)
- Manually install the downloaded extension to your browser ([steps to follow](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/)). With successful installation you will see a extension icon with a D letter in it.
- Click on the D icon to see the default attributes available for testing. Just use defaults or create/ use your own Decentralised Identity (DID) attributes to test the app.
- Browse into sample Relying Party app [https://did-siop-rp-test.herokuapp.com](https://did-siop-rp-test.herokuapp.com/)
- Click on "DID SIOP Login" button to start the authorization process
- You will navigate to a new tab and it will prompt for the confirmation to Sign in using DID-SIOP.
- Upon acceptance you will navigate to the secure area of the app and you will see the DID used for the authorization.

## Current Status ##
### Features Implemented ###

### Features NOT Implemented ###

### Development Roadmap ###

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
