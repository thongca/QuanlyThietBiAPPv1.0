import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BaocaoRoutingModule } from './baocao-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgxPrintModule } from 'ngx-print';
import { BaocaochecklistComponent } from './baocaochecklist/baocaochecklist.component';
import { ChartsModule } from 'ng2-charts';
import { BaocaovesinhcongnghiepComponent } from './baocaovesinhcongnghiep/baocaovesinhcongnghiep.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { BaocaotinhtrangthietbiComponent } from './baocaotinhtrangthietbi/baocaotinhtrangthietbi.component';


@NgModule({
  declarations: [BaocaochecklistComponent, BaocaovesinhcongnghiepComponent, BaocaotinhtrangthietbiComponent],
  imports: [
    CommonModule,
    BaocaoRoutingModule,
    SharedModule,
    ModalModule,
    FormsModule,
    HttpModule,
    NgxPrintModule,
    ChartsModule,
    BsDatepickerModule,
  ],
  providers: [DatePipe]
})
export class BaocaoModule { }
