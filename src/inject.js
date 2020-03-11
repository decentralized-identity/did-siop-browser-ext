document.getElementById('did-siop-login').addEventListener('click',
    function(){
        var port = chrome.runtime.connect({name: "did-siop"});
        port.postMessage({
            scheme: 'openid://',
            response_type: 'id_token',
            client_id: 'test/callback',
            scope: ['openid', 'did_authn'],
            request: "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1ODIyNjY2NzgsImV4cCI6MTU4MjI2NzI3OCwicmVxdWVzdGVkIjpbIm5hbWUiXSwicGVybWlzc2lvbnMiOlsibm90aWZpY2F0aW9ucyJdLCJjYWxsYmFjayI6Imh0dHBzOi8vYXBpLnVwb3J0Lm1lL2NoYXNxdWkvdG9waWMvWERJY3Jkd0xyZkpBSWtPX0dnaHRCZyIsInZjIjpbIi9pcGZzL1FtWlFTZVozZzFzdmhQUjZnbXRZdTdqTGpQOGcxb0tLbmlLM3JiN0FmQW03WEciXSwiYWN0Ijoibm9uZSIsInR5cGUiOiJzaGFyZVJlcSIsImlzcyI6ImRpZDpldGhyOjB4Mzc0Y2IxYmQ4MTEyMmY0Y2FiOTQyMjZlNzI5YTRmMWM4YTFhMDQwOCJ9.SB5AvL7YcALVPa9AjuG9EsVPhtbEXrAqI98TSu25r19Z_sPJblxRkTZNuM48K9_Pj6dqFR2lp9Ka9lRyBdCDlgA?callback_type=post"
        });
        port.onMessage.addListener(function(msg) {
            console.log(msg);
        });
    }
);

