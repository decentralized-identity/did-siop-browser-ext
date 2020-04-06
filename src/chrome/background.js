const { validateRequest } = require('../common');

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                  new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostEquals: '' }
                  })
                ],
                actions: [ new chrome.declarativeContent.ShowPageAction() ]
            }
        ]);
    });
    chrome.runtime.onConnect.addListener(function(port) {
        if(port.name === "did-siop"){
            port.onMessage.addListener(async function(msg) {
                try{
                    if(await validateRequest(msg)){
                        port.postMessage("openid ok");
                    }
                    else{
                        port.postMessage("openid did_authn request error: " + err);
                    }
                }
                catch(err){
                    port.postMessage("openid did_authn request error: " + err);
                }
            });
        }
    });
});