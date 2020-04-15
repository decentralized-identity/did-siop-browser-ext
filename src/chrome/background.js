const { validateRequest, parseRequest } = require('../common/request');
const { generateResponse } = require('../common/response');

chrome.runtime.onStartup.addListener(function() {
    chrome.tabs.onCreated.addListener(function(){
        chrome.tabs.query({ active: true, lastFocusedWindow: true}, tabs => {
            let request = tabs[0].pendingUrl;
            if (parseRequest(request).url === 'openid://' && confirm('Sign in using did-siop?')) {
                validateRequest(request).then(decodedRequest => {
                    generateResponse(decodedRequest.payload, signing, me).then( response => {
                        let uri = decodedRequest.payload.client_id + '#' + response;
                        chrome.tabs.update(tabs[0].id, {
                            url: uri,
                        });
                        console.log('Sent response to ' + decodedRequest.payload.client_id + ' with id_token: ' + response);
                    })
                    .catch(err => {
                        console.log(err);
                    });
                })
                .catch(err => {
                    console.log(err);
                });
            }
        });
    });
});

const signing = {
    alg: 'ES256K-R',
    kid: 'did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83#owner',
    signing_key: 'CE438802C1F0B6F12BC6E686F372D7D495BC5AA634134B4A7EA4603CB25F0964'
}

const me = {
    did: 'did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83'
}