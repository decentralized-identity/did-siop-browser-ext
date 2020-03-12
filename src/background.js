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
            port.onMessage.addListener(function(msg) {
                if(msg.scheme === 'openid://' && msg.scope.includes('openid') && msg.scope.includes('did_authn')){
                    port.postMessage("openid ok");
                    port.postMessage(msg);
                }
                else{
                    port.postMessage("openid did_authn bad request");
                }
            });
        }
    });
});