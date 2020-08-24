import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  currentDID: string;
  signingInfoSet: any[] = [];

  constructor() { }

  setCurrentDID(did: string){
    this.currentDID = did;
  }

  getCurrentDID(): string{
    return this.currentDID;
  }

  setSigningInfoSet(signingInfoSet: any[]){
    this.signingInfoSet = signingInfoSet;
  }

  getSigningInfoSet(): any[]{
    return this.signingInfoSet;
  }

}