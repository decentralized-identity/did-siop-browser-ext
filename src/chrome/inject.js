document.getElementById('did-siop-login').addEventListener('click',
    function(){
        var port = chrome.runtime.connect({name: "did-siop"});
        port.postMessage(request);
        port.onMessage.addListener(function(msg) {
            console.log(msg);
        });
    }
);