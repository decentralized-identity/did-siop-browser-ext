const { validateRequest, parseRequest } = require('../common/request');
const { generateResponse } = require('../common/response');
const ERROR_RESPONSES = require('../common/response.errors');
const { encodeBase64Url, verifyKeyPair } = require('../common/jwt');
const { validateDidDoc, getKeyFromDidDoc } = require('../common/util');
const resolver = require('../common/resolver');

chrome.runtime.onInstalled.addListener(function(){
    let did = 'did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83';
    localStorage.setItem('did_siop_user_did', did);

    let signing = {
        alg: 'ES256K-R',
        kid: 'did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83#owner',
        signing_key: 'CE438802C1F0B6F12BC6E686F372D7D495BC5AA634134B4A7EA4603CB25F0964',
    }
    localStorage.setItem('did_siop_singing_info', JSON.stringify(signing));
});

chrome.tabs.onCreated.addListener(function(){
    chrome.tabs.query({ active: true, lastFocusedWindow: true}, tabs => {
        let request = tabs[0].pendingUrl;
        if (parseRequest(request).url === 'openid://') {
            if (confirm('Sign in using did-siop?')){
                validateRequest(request).then(decodedRequest => {
                        let me = getME();
                        let signing = getSingingInfo();
                        if(me && signing){
                            generateResponse(decodedRequest.payload, signing, me).then(response => {
                                    let uri = decodedRequest.payload.client_id + '#' + response;
                                    chrome.tabs.update(tabs[0].id, {
                                        url: uri,
                                    });
                                    console.log('Sent response to ' + decodedRequest.payload.client_id + ' with id_token: ' + response);
                            })
                            .catch(err => {
                                    alert(err);
                            });
                        }
                        else{
                            alert('User or signing information is not set please set them first');
                        }
                })
                .catch(err => {
                    let uri = parseRequest(request).query.client_id;
                    if (uri) {
                        uri = uri + '#' + encodeBase64Url(ERROR_RESPONSES[err.message].response);
                        chrome.tabs.update(tabs[0].id, {
                            url: uri,
                        });
                    } else {
                        alert('Error: invalid redirect url');
                    }
                });
            }
            else{
                let uri = parseRequest(request).query.client_id;
                if(uri){
                    uri = uri + '#' + encodeBase64Url(ERROR_RESPONSES.access_denied.response);
                    chrome.tabs.update(tabs[0].id, {
                        url: uri,
                    });
                }
                else{
                    alert('Error: invalid redirect url');
                }
            }
        }
    });
});

const getME = function(){
    return {
        did: localStorage.getItem('did_siop_user_did'),
        did_doc: localStorage.getItem('did_siop_user_did'), 
    }
}

const getSingingInfo = function(){
    return JSON.parse(localStorage.getItem('did_siop_singing_info'));
}