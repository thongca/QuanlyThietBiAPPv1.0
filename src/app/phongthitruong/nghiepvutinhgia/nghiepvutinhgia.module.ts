import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NghiepvutinhgiaRoutingModule } from './nghiepvutinhgia-routing.module';
import { TinhgiaoffsetComponent } from './tinhgiaoffset/tinhgiaoffset.component';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgxPrintModule } from 'ngx-print';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [TinhgiaoffsetComponent],
  imports: [
    CommonModule,
    NghiepvutinhgiaRoutingModule,
    ModalModule,
    FormsModule,
    HttpModule,
    NgxPrintModule,
    SharedModule,
  ]
})
export class NghiepvutinhgiaModule { }
