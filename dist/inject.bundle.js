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
    request: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDpldGhyOjB4Mzc0Y2IxYmQ4MTEyMmY0Y2FiOTQyMjZlNzI5YTRmMWM4YTFhMDQwOCN2ZXJpLWtleTEifQ.eyJpc3MiOiJkaWQ6ZXRocjoweDM3NGNiMWJkODExMjJmNGNhYjk0MjI2ZTcyOWE0ZjFjOGExYTA0MDgiLCJyZXNwb25zZV90eXBlIjoiaWRfdG9rZW4iLCJjbGllbnRfaWQiOiJodHRwczovL215LnJwLmNvbS9jYiIsInNjb3BlIjoib3BlbmlkIGRpZF9hdXRobiIsInN0YXRlIjoiYWYwaWZqc2xka2oiLCJub25jZSI6Im4tMFM2X1d6QTJNaiIsInJlc3BvbnNlX21vZGUiOiJmb3JtX3Bvc3QiLCJyZWdpc3RyYXRpb24iOnsiandrc191cmkiOiJodHRwczovL3VuaXJlc29sdmVyLmlvLzEuMC9pZGVudGlmaWVycy9kaWQ6ZXRocjoweDM3NGNiMWJkODExMjJmNGNhYjk0MjI2ZTcyOWE0ZjFjOGExYTA0MDg7dHJhbnNmb3JtLWtleXM9andrcyIsImlkX3Rva2VuX3NpZ25lZF9yZXNwb25zZV9hbGciOlsiRVMyNTZLIiwiRWREU0EiLCJSUzI1NiJdfX0.qGgKgc-XQA0CMSuzEaLXQIBKMAyfweZgVQ6bSIO6wns"

}


},{}]},{},[1]);
