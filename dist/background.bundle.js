(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const validator = require('./validator');

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
                if(validator.validateRequest(msg)){
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
},{"./validator":2}],2:[function(require,module,exports){
const validateRequest = function(rqst){
    return(
        //OAuth 2.0 
        rqst.response_type === 'id_token' &&
        rqst.client_id !== undefined &&
        //OpenId Connect
        rqst.scope.includes('openid') &&
        //DID-SIOP
        rqst.scope.includes('did_authn')
    )
}

module.exports = { validateRequest };
},{}]},{},[1]);
