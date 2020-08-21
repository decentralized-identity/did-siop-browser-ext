import EthrDID from 'ethr-did';
import W3 from 'web3';
const nacl = require('tweetnacl');
import { encode as multibaseEncode} from 'multibase';
import { addPrefix as mutlicodeAddPrefix } from 'multicodec';
import * as base58 from 'bs58';

const createEthrDid = async function(network: string){
    const networks = {
        'mainnet': 'https://mainnet.infura.io/v3/e0a6ac9a2c4a4722970325c36b728415',
        'rinkeby': 'https://rinkeby.infura.io/v3/e0a6ac9a2c4a4722970325c36b728415',
        'ropsten': 'https://ropsten.infura.io/v3/e0a6ac9a2c4a4722970325c36b728415',
        'goerli': 'https://goerli.infura.io/v3/e0a6ac9a2c4a4722970325c36b728415',
        'kovan': 'https://kovan.infura.io/v3/e0a6ac9a2c4a4722970325c36b728415',
    }

    const ethrProvider = new W3.providers.HttpProvider(networks[network]);
    const w3 = new W3();
    const acc = w3.eth.accounts.create();
    const ethrDid = new EthrDID({address: acc.address, privateKey: acc.privateKey, provider: ethrProvider});

    return {
        did: ethrDid.did,
        privateKey: acc.privateKey.replace('0x', '')
    }
}

const createKeyDid = async function(){
    let keyPair = nacl.sign.keyPair();
    let methodSpecificBytes = Buffer.from(multibaseEncode('base58btc', mutlicodeAddPrefix('ed25519-pub', keyPair.publicKey)));
    let did = 'did:key:' + methodSpecificBytes.toString();
    let privateKeyString = base58.encode(keyPair.secretKey);

    return {
        did,
        privateKey: privateKeyString
    }
}

export const DidCreators = {
    ethr: createEthrDid,
    key: createKeyDid,
}