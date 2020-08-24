import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDIDModalComponent } from './change-did-modal/change-did-modal.component';
import { TestDataModalComponent } from './test-data-modal/test-data-modal.component';
import { CreateDIDModalComponent } from './create-did-modal/create-did-modal.component';



@NgModule({
  declarations: [ChangeDIDModalComponent, TestDataModalComponent, CreateDIDModalComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ChangeDIDModalComponent,
    TestDataModalComponent,
    CreateDIDModalComponent,
  ]
})
export class ModalsModule { }

export {ChangeDIDModalComponent, TestDataModalComponent, CreateDIDModalComponent}
