import EthrDID from 'ethr-did';
import W3 from 'web3';

const createEthrDid = function(){
    const networks = {
        'mainnet': 'https://mainnet.infura.io/v3/e0a6ac9a2c4a4722970325c36b728415'
    }

    const ethrProvider = new W3.providers.HttpProvider(networks.mainnet);
    const w3 = new W3();
    const acc = w3.eth.accounts.create();
    const ethrDid = new EthrDID({address: acc.address, privateKey: acc.privateKey, provider: ethrProvider});

    return {
        did: ethrDid.did,
        privateKey: acc.privateKey.replace('0x', '')
    }
}

export const DidCreators = {
    ethereum: createEthrDid
}