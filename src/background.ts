/// <reference types="chrome"/>
/// <reference types="firefox-webext-browser"/>

import { Provider, ERROR_RESPONSES} from 'did-siop';
import * as queryString from 'query-string';

let provider: Provider;
let signingInfoSet: any[] = [];

enum TASKS{
    CHANGE_DID,
    ADD_KEY,
    REMOVE_KEY,
    PROCESS_REQUEST,
}

let env: any;

if(chrome){
    env = chrome;
}
else if(browser){
    env = browser;
}
else{
    console.log('DID-SIOP ERROR: No runtime detected');
}

const checkSigning = async function(){
    try{
        if(!provider){
            provider = new Provider();
            let did = localStorage.getItem('did_siop_user_did');
            await provider.setUser(did);
        }

        if(signingInfoSet.length < 1){
            signingInfoSet = JSON.parse(localStorage.getItem('did_siop_singing_info_set'));
            if(!signingInfoSet){
                signingInfoSet = [];
            }
            else{
                signingInfoSet.forEach(info => {
                    provider.addSigningParams(info.key, info.kid, info.format, info.alg);
                })
            }
        }
    }
    catch(err){
        throw err;
    }
}

env.runtime.onInstalled.addListener( async function(){
    let did = 'did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83';
    let signingInfoSet = [
        {
            alg: 'ES256K-R',
            kid: 'did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83#owner',
            key: 'CE438802C1F0B6F12BC6E686F372D7D495BC5AA634134B4A7EA4603CB25F0964',
            format: 'HEX',
        },
    ];
    localStorage.setItem('did_siop_user_did', did);
    localStorage.setItem('did_siop_singing_info_set', JSON.stringify(signingInfoSet));
    checkSigning();
});

env.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(!sender.tab){
        switch(request.task){
            case TASKS.CHANGE_DID: {
                changeDID(request.did)
                .then(result => {
                    sendResponse({result: result});
                })
                .catch(err => {
                    sendResponse({err: err. message});
                });
                break;
            }
            case TASKS.ADD_KEY: {
                addKey(request.keyInfo)
                .then(result => {
                    sendResponse({result: result});
                })
                .catch(err => {
                    sendResponse({err: err. message});
                });
                break;
            }
            case TASKS.REMOVE_KEY: {
                removeKey(request.kid)
                .then(result => {
                    sendResponse({result: result});
                })
                .catch(err => {
                    sendResponse({err: err. message});
                });
                break;
            }
        }
    }
    else{
        switch(request.task){
            case TASKS.PROCESS_REQUEST: {
                processRequest(request.did_siop, request.confirmation);
            }
        }
    }
    return true;
});

const changeDID = async function(did: string): Promise<string>{
    try{
        let newProvider = new Provider();
        await newProvider.setUser(did);
        provider = newProvider;
        localStorage.setItem('did_siop_user_did', did);
        localStorage.removeItem('did_siop_singing_info_set');
        signingInfoSet = [];
        return 'Identity changed successfully';
    }
    catch(err){
        return Promise.reject(err);
    }
}

const addKey = async function(keyInfo: any): Promise<string>{
    try{
        provider.addSigningParams(keyInfo.key, keyInfo.kid, keyInfo.format,  keyInfo.alg);
        signingInfoSet.push({
          alg: keyInfo.alg,
          kid: keyInfo.kid,
          key: keyInfo.key,
          format: keyInfo.format,
        });
        localStorage.setItem('did_siop_singing_info_set', JSON.stringify(signingInfoSet));
        return 'New key added successfully';
    }
    catch(err){
        return Promise.reject(err);
    }
}

const removeKey = async function(kid: string): Promise<string>{
    try{
        provider.removeSigningParams(kid);
        signingInfoSet = signingInfoSet.filter(key => {
            return key.kid !== kid;
        })
        localStorage.setItem('did_siop_singing_info_set', JSON.stringify(signingInfoSet));
        return 'Key removed successfully';
      }
    catch(err){
        return err.message;
    }
}

const processRequest = async function(request: string, confirmation: any){
    if (queryString.parseUrl(request).url === 'openid://') {
        try{
            await checkSigning();
            if (confirmation){
                provider.validateRequest(request).then(decodedRequest => {
                    provider.generateResponse(decodedRequest.payload).then(response => {
                        let uri = decodedRequest.payload.client_id + '#' + response;
                        env.tabs.create({
                            url: uri,
                        });
                        console.log('Sent response to ' + decodedRequest.payload.client_id + ' with id_token: ' + response);
                    })
                    .catch(err => {
                        alert(err.message);
                    })
                })
                .catch(err => {
                    let uri = queryString.parseUrl(request).query.client_id;
                    if (uri) {
                        uri = uri + '#' + provider.generateErrorResponse(err.message);
                        env.tabs.create({
                            url: uri,
                        });
                    } else {
                        alert('Error: invalid redirect url');
                    }
                });
            }
            else{
                let uri = queryString.parseUrl(request).query.client_id;
                if (uri) {
                    uri = uri + '#' + provider.generateErrorResponse(ERROR_RESPONSES.access_denied.err.message);
                    env.tabs.create({
                        url: uri,
                    });
                } else {
                    alert('Error: invalid redirect url');
                }
            }
        }
        catch(err){
            alert(err.message);
        }
    }
}