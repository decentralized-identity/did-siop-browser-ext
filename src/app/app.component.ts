import { Component, ViewChild, ElementRef } from '@angular/core';
import { Provider } from 'did-siop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'did-siop-ext';
  currentDID: string;
  provider: Provider;
  signingInfoSet: any[] = [];
  @ViewChild('addNewKeyModalClose') addNewModalClose: ElementRef;

  constructor(){
    this.provider = new Provider();
    let did = localStorage.getItem('did-siop-user-did');
    if(did){
      this.provider.setUser(did);
      this.currentDID = did;
      let keys = JSON.parse(localStorage.getItem('did_siop_singing_info_set'));
      if(keys){
        this.signingInfoSet = keys;
      }
    }
    else{
      this.currentDID = 'No DID provided';
    }
  }


  async changeDID(){
    try{
      if(confirm('Are you sure you want to change identity? This will remove all related data and keys.')){
        let did = prompt('Enter new DID');
        if(did){
          let provider = new Provider();
          await provider.setUser(did);
          this.provider = provider;
          localStorage.setItem('did-siop-user-did', did);
          localStorage.removeItem('did_siop_singing_info_set');
          this.signingInfoSet = [];
          this.currentDID = did;
          alert('Identity changed successfully');
        }
      }
    }
    catch(err){
      alert(err.message);
    }
  }

  addNewKey(keyString: string, kid: string, format: string, algorithm: string){
    try{
      this.provider.addSigningParams(keyString, kid, format, algorithm);
      this.signingInfoSet.push({
        alg: algorithm,
        kid: kid,
        key: keyString,
        format: format,
      });
      localStorage.setItem('did_siop_singing_info_set', JSON.stringify(this.signingInfoSet));
      alert('New key added successfully');
      this.addNewModalClose.nativeElement.click();
    }
    catch(err){
      alert(err.message);
    }

  }

  removeKey(kid: string){
    try{
      if(confirm('You are about to remove a key.')){
        if(confirm('Are you sure?')){
          this.provider.removeSigningParams(kid);
          this.signingInfoSet = this.signingInfoSet.filter(key => {
            return key.kid !== kid;
          })
          localStorage.setItem('did_siop_singing_info_set', JSON.stringify(this.signingInfoSet));
          alert('Key removed successfully');
        }
      }
    }
    catch(err){
      alert(err.message);
    }
  }
}
