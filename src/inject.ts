/// <reference types="chrome"/>
/// <reference types="firefox-webext-browser"/>

enum TASKS{
    CHANGE_DID,
    ADD_KEY,
    REMOVE_KEY,
    PROCESS_REQUEST,
}

let env: any;

if(window.chrome && window.chrome.runtime && window.chrome.runtime.onMessage){
    env = chrome;
}
else if(window.browser && window.browser.runtime && window.browser.runtime.onMessage){
    env = browser;
}
else{
    console.log('DID-SIOP ERROR: No runtime detected');
}

const didSIOPLogins = document.getElementsByClassName('did-siop-login');
let i;
for(i= 0; i < didSIOPLogins.length; i++){
    if(didSIOPLogins[i].getAttribute('data-did-siop')){
        let did_siop = didSIOPLogins[i].getAttribute('data-did-siop');
        didSIOPLogins[i].addEventListener('click', () => {
            let confirmation = confirm('Sign in with DID-SIOP?');
            env.runtime.sendMessage({
                task: TASKS.PROCESS_REQUEST,
                did_siop: did_siop,
                confirmation: confirmation,
            }
            );
        })
    }
}
