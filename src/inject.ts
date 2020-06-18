import { TASKS } from './globals';

/// <reference types="chrome"/>
/// <reference types="firefox-webext-browser"/>

let runtime: any;

try{
    runtime = browser.runtime;
}
catch(err){
    try{
        runtime = chrome.runtime;
    }
    catch(err){
        console.log('DID-SIOP ERROR: No runtime detected');
    }
}

const didSIOPLogins = document.querySelectorAll('[data-did-siop]');
let i;
for(i= 0; i < didSIOPLogins.length; i++){
    didSIOPLogins[i].addEventListener('click', function(){
        let did_siop = this.getAttribute('data-did-siop');
        runtime.sendMessage({
            task: TASKS.MAKE_REQUEST,
            did_siop: did_siop,
        },
        (response)=>{
            if(response.result){
                console.log('Request sent to DID-SIOP');
            }
            else if(response.err){
                throw new Error('DID_SIOP_ERROR: ' + response.err);
            }
        }
        );
    })
}
