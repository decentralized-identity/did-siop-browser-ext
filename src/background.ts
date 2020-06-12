/// <reference types="chrome"/>
/// <reference types="firefox-webext-browser"/>

import { Provider, ERROR_RESPONSES} from 'did-siop';
import * as queryString from 'query-string';
import { keys, TASKS } from './globals';

let provider: Provider;
let signingInfoSet: any[] = [];

let runtime: any;
let tabs: any;

try{
    runtime = browser.runtime;
    tabs = browser.tabs;
}
catch(err){
    try{
        runtime = chrome.runtime;
        tabs = chrome.tabs;
    }
    catch(err){
        console.log('DID-SIOP ERROR: No runtime detected');
    }
}

const checkSigning = async function(){
    try{
        if(!provider){
            provider = new Provider();
            let did = localStorage.getItem(keys.userDID);
            await provider.setUser(did);
        }

        if(signingInfoSet.length < 1){
            signingInfoSet = JSON.parse(localStorage.getItem(keys.signingInfoSet));
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

runtime.onInstalled.addListener( async function(){
    let did = 'did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83';
    let signingInfoSet = [
        {
            alg: 'ES256K-R',
            kid: 'did:ethr:0xB07Ead9717b44B6cF439c474362b9B0877CBBF83#owner',
            key: 'CE438802C1F0B6F12BC6E686F372D7D495BC5AA634134B4A7EA4603CB25F0964',
            format: 'HEX',
        },
    ];
    localStorage.setItem(keys.userDID, did);
    localStorage.setItem(keys.signingInfoSet, JSON.stringify(signingInfoSet));
    checkSigning();
});

runtime.onMessage.addListener(function(request, sender, sendResponse) {
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
                processRequest(request.did_siop, request.confirmation)
                .then(result=>{
                    sendResponse({result: result});
                })
                .catch(err=>{
                    sendResponse({err:err.message});
                });
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
        localStorage.setItem(keys.userDID, did);
        signingInfoSet = [];
        localStorage.setItem(keys.signingInfoSet, JSON.stringify(signingInfoSet));
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
        localStorage.setItem(keys.signingInfoSet, JSON.stringify(signingInfoSet));
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
        localStorage.setItem(keys.signingInfoSet, JSON.stringify(signingInfoSet));
        return 'Key removed successfully';
      }
    catch(err){
        return err.message;
    }
}

const processRequest = async function(request: string, confirmation: any){
    let processError: Error;
    if (queryString.parseUrl(request).url === 'openid://') {
        try{
            await checkSigning();
            if (confirmation){
                try{
                    let decodedRequest = await provider.validateRequest(request);
                    try{
                        let response = await provider.generateResponse(decodedRequest.payload);
                        let uri = decodedRequest.payload.client_id + '#' + response;
                        tabs.create({
                            url: uri,
                        });
                        console.log('Sent response to ' + decodedRequest.payload.client_id + ' with id_token: ' + response);
                        return 'Successfully logged into ' + decodedRequest.payload.client_id;
                    }
                    catch(err){
                        processError = err;
                    }
                }
                catch(err){
                    let uri = queryString.parseUrl(request).query.client_id;
                    if (uri) {
                        uri = uri + '#' + provider.generateErrorResponse(err.message);
                        tabs.create({
                            url: uri,
                        });
                    } else {
                        processError = new Error('invalid redirect url');
                    }
                }
            }
            else{
                let uri = queryString.parseUrl(request).query.client_id;
                if (uri) {
                    uri = uri + '#' + provider.generateErrorResponse(ERROR_RESPONSES.access_denied.err.message);
                    tabs.create({
                        url: uri,
                    });
                } else {
                    processError = new Error('invalid redirect url');
                }
            }
        }
        catch(err){
            processError = err;
        }
    }
    if(processError) throw processError;
}