/// <reference types="chrome"/>
/// <reference types="firefox-webext-browser"/>

enum TASKS{
    CHANGE_DID,
    ADD_KEY,
    REMOVE_KEY,
    PROCESS_REQUEST,
}

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
    let did_siop = didSIOPLogins[i].getAttribute('data-did-siop');
    didSIOPLogins[i].addEventListener('click', () => {
        let confirmation = confirm('Sign in with DID-SIOP?');
        runtime.sendMessage({
            task: TASKS.PROCESS_REQUEST,
            did_siop: did_siop,
            confirmation: confirmation,
        },
        (response)=>{
            if(response.result){
                console.log(response.result);
            }
            if(response.err){
                alert('DID_SIOP ERROR: ' + response.err);
            }
        }
        );
    })
}
