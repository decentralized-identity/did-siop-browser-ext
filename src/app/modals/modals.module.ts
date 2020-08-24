import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDIDModalComponent } from './change-did-modal/change-did-modal.component';



@NgModule({
  declarations: [ChangeDIDModalComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ChangeDIDModalComponent
  ]
})
export class ModalsModule { }

export {ChangeDIDModalComponent}
