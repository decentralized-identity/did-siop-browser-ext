/// <reference types="chrome"/>

import { Provider } from 'did-siop';

let provider: Provider;

chrome.runtime.onInstalled.addListener( async function(){
    let did = 'did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83';
    let signingInfoSet = [{
        alg: 'ES256K-R',
        kid: 'did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83#owner',
        key: 'CE438802C1F0B6F12BC6E686F372D7D495BC5AA634134B4A7EA4603CB25F0964',
        format: 'HEX',
    }];
    localStorage.setItem('did_siop_user_did', did);
    localStorage.setItem('did_siop_singing_info_set', JSON.stringify(signingInfoSet));
});

chrome.tabs.onCreated.addListener(async function(){
    chrome.tabs.query({ active: true, lastFocusedWindow: true}, async (tabs) => {
        let request = tabs[0].pendingUrl;
        if (request.split('://')[0] === 'openid') {
            try{
                await checkProvider();
                if (confirm('Sign in using did-siop?')){
                    provider.validateRequest(request).then(decodedRequest => {
                        provider.generateResponse(decodedRequest.payload).then(response => {
                            let uri = decodedRequest.payload.client_id + '#' + response;
                            chrome.tabs.update(tabs[0].id, {
                                url: uri,
                            });
                            console.log('Sent response to ' + decodedRequest.payload.client_id + ' with id_token: ' + response);
                        })
                        .catch(err => {
                            alert(err.message);
                        })
                    })
                    .catch(err => {
                        alert(err.message);
                    });
                }
                else{
                    console.log('no siop');
                }
            }
            catch(err){
                alert(err.message);
            }
        }
    });
});

const checkProvider = async function(){
    try{
        if(!provider){
            provider = new Provider();
            let did = localStorage.getItem('did_siop_user_did');
            await provider.setUser(did);
            
            let signingInfoSet = JSON.parse(localStorage.getItem('did_siop_singing_info_set'));
            if(!signingInfoSet) signingInfoSet = [];

            signingInfoSet.forEach(info => {
                provider.addSigningParams(info.key, info.kid, info.format, info.alg);
            })
        }
    }
    catch(err){
        throw err;
    }
}