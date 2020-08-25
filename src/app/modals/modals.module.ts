import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDIDModalComponent } from './change-did-modal/change-did-modal.component';
import { TestDataModalComponent } from './test-data-modal/test-data-modal.component';
import { CreateDIDModalComponent } from './create-did-modal/create-did-modal.component';
import { NewKeyModalComponent } from './new-key-modal/new-key-modal.component';
import { RemoveKeyModalComponent } from './remove-key-modal/remove-key-modal.component';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';



@NgModule({
  declarations: [ChangeDIDModalComponent, TestDataModalComponent, CreateDIDModalComponent, NewKeyModalComponent, RemoveKeyModalComponent, ChangePasswordModalComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ChangeDIDModalComponent,
    TestDataModalComponent,
    CreateDIDModalComponent,
    NewKeyModalComponent,
    RemoveKeyModalComponent,
    ChangePasswordModalComponent,
  ]
})
export class ModalsModule { }

export {ChangeDIDModalComponent, TestDataModalComponent, CreateDIDModalComponent, NewKeyModalComponent, RemoveKeyModalComponent, ChangePasswordModalComponent}
