import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDIDModalComponent } from './change-did-modal/change-did-modal.component';
import { TestDataModalComponent } from './test-data-modal/test-data-modal.component';



@NgModule({
  declarations: [ChangeDIDModalComponent, TestDataModalComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ChangeDIDModalComponent,
    TestDataModalComponent,
  ]
})
export class ModalsModule { }

export {ChangeDIDModalComponent, TestDataModalComponent}
