(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
document.getElementById('did-siop-login').addEventListener('click',
    function(){
        var port = chrome.runtime.connect({name: "did-siop"});
        port.postMessage(testReq);
        port.onMessage.addListener(function(msg) {
            console.log(msg);
        });
    }
);


const testReq = {
    scheme: 'openid://',
    response_type: 'id_token',
    client_id: 'test/callback',
    scope: ['openid', 'did_authn'],
    request: "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpYXQiOjE1ODQxMDA4MTksImlzcyI6ImRpZDpldGhyOjB4QjA3RWFkOTcxN2I0NEI2Y0Y0MzljNDc0MzYyYjlCMDg3N0NCQkY4MyIsInJlc3BvbnNlX3R5cGUiOiJpZF90b2tlbiIsImNsaWVudF9pZCI6Imh0dHBzOi8vbXkucnAuY29tL2NiIiwic2NvcGUiOiJvcGVuaWQgZGlkX2F1dGhuIiwic3RhdGUiOiJhZjBpZmpzbGRraiIsIm5vbmNlIjoibi0wUzZfV3pBMk1qIiwicmVzcG9uc2VfbW9kZSI6ImZvcm1fcG9zdCIsInJlZ2lzdHJhdGlvbiI6eyJqd2tzX3VyaSI6Imh0dHBzOi8vdW5pcmVzb2x2ZXIuaW8vMS4wL2lkZW50aWZpZXJzL2RpZDpldGhyOjB4QjA3RWFkOTcxN2I0NEI2Y0Y0MzljNDc0MzYyYjlCMDg3N0NCQkY4Mzt0cmFuc2Zvcm0ta2V5cz1qd2tzIiwiaWRfdG9rZW5fc2lnbmVkX3Jlc3BvbnNlX2FsZyI6WyJFUzI1NksiLCJFZERTQSIsIlJTMjU2Il19fQ.LI6KBAAVAdLRL4pfYPYbRcz1pKJ5WKVxgUp7eXntC1J6OT1WqegFqdgONshNIXXdULUhxy1C0paXc85Kgd9bWA"

}


},{}]},{},[1]);
