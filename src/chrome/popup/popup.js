const resolver = require('../../common/resolver');
const { getKeyFromDidDoc, validateDidDoc } = require('../../common/util');
const { verifyKeyPair } = require('../../common/jwt');

const setSigningInfo = async function () {
    let signing = {
        alg: document.getElementById('algorithm').value,
        kid: document.getElementById('kid').value,
        signing_key: document.getElementById('signing_key').value,
    }

    if (signing.alg && signing.kid && signing.signing_key) {
        let me = {
            did: localStorage.getItem('did_siop_user_did'),
            did_doc: JSON.parse(localStorage.getItem('did_siop_user_did_doc')),
        }
        if (me.did) {
            try {
                let publicKey = await getKeyFromDidDoc(me.did, signing.kid);
                let validity = verifyKeyPair(signing.signing_key, publicKey, signing.alg);
                if (validity === true) {
                    localStorage.setItem('did_siop_singing_info', JSON.stringify(signing));
                    document.getElementById('error-view').innerHTML = '';
                } else {
                    document.getElementById('error-view').innerHTML = 'Invalid singing info. Please check the algorithm as well as kid and signing key';
                }
            } catch (err) {
                document.getElementById('error-view').innerHTML = 'Invalid singing info. Please check the algorithm as well as kid and private key';
            }
        } else {
            document.getElementById('error-view').innerHTML = 'User DID is not set. Please set the DID first';
        }
    } else {
        document.getElementById('error-view').innerHTML = 'Missing required parameters';
    }
}

const setME = async function () {
    let did = document.getElementById('did').value;
    try {
        let doc = await resolver.resolve(did);
        if (validateDidDoc(did, doc)) {
            localStorage.setItem('did_siop_user_did', did);
            localStorage.setItem('did_siop_user_did_doc', JSON.stringify(doc));
            document.getElementById('error-view').innerHTML = '';
        } else {
            document.getElementById('error-view').innerHTML = 'Invalid DID and DID Document';
        }
    } catch (err) {
        document.getElementById('error-view').innerHTML = err;
    }
}

document.getElementById('setDID').addEventListener('click', setME);
document.getElementById('setSigningInfo').addEventListener('click', setSigningInfo);

document.getElementById('did').value = localStorage.getItem('did_siop_user_did');
let signing = JSON.parse(localStorage.getItem('did_siop_singing_info'));
if(signing){
    document.getElementById('algorithm').value = signing.alg;
    document.getElementById('kid').value = signing.kid;
    document.getElementById('signing_key').value = signing.signing_key;
    signing = null;
}

document.addEventListener('DOMContentLoaded', function () {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({
                    active: true,
                    url: location
                });
            };
        })();
    }
});

