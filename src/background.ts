/// <reference types="chrome"/>

import * as DID_SIOP from 'did-siop';

chrome.runtime.onInstalled.addListener( async function(){
    
});

chrome.tabs.onCreated.addListener(async function(){
   
});

const getProvider = async function(){
    try{
        let provider = new DID_SIOP.Provider();
        let did = localStorage.getItem('did_siop_user_did');
        await provider.setUser(did);
        
        let signingInfoSet = JSON.parse(localStorage.getItem('did_siop_singing_info_set'));
        if(!signingInfoSet) signingInfoSet = [];

        signingInfoSet.forEach(info => {
            provider.addSigningParams(info.key, info.kid, info.format, info.alg);
        })

        return provider;
    }
    catch(err){
        throw err;
    }
}