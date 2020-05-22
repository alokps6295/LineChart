import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModalGeneric} from './modal/modal.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ModalGeneric
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    ModalGeneric,
  ],
  providers:[],
  entryComponents: [ModalGeneric]
})
export class SharedModule { }
