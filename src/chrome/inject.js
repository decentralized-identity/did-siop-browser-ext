const { signJWT } = require('../common');

document.getElementById('did-siop-login').addEventListener('click',
    function(){
        var port = chrome.runtime.connect({name: "did-siop"});
        port.postMessage(requestGoodEmbeddedJWT);
        port.onMessage.addListener(function(msg) {
            console.log(msg);
        });
    }
);


const jwtGoodDecoded = {
    header: {
        "typ": "JWT",
        "alg": "ES256K-R",
        "kid": "did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83#owner"
    },
    payload: {
        "iss": "did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83",
        "response_type": "id_token",
        "client_id": "https://my.rp.com/cb",
        "scope": "openid did_authn",
        "state": "af0ifjsldkj",
        "nonce": "n-0S6_WzA2Mj",
        "response_mode": "form_post",
        "registration": {
            "jwks_uri": "https://uniresolver.io/1.0/identifiers/did:example:0xab;transform-keys=jwks",
            "id_token_signed_response_alg": ["ES256K", "EdDSA", "RS256"]
        }
    }
}

const keyPair = {
    privateKey: 'CE438802C1F0B6F12BC6E686F372D7D495BC5AA634134B4A7EA4603CB25F0964',
    publicKey: '0xB07Ead9717b44B6cF439c474362b9B0877CBBF83'
}

const jwtGoodEncoded = signJWT(jwtGoodDecoded.header, jwtGoodDecoded.payload, keyPair.privateKey);
const requestGoodEmbeddedJWT = 'openid://?response_type=id_token&client_id=https://rp.example.com/cb&scope=openid did_authn&request=' + jwtGoodEncoded;
