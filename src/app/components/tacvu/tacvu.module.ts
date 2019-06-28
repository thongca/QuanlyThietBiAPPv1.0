import { ThietbiService } from './../danhmuc/thietbi/thietbi.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TacvuRoutingModule } from './tacvu-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgxPrintModule } from 'ngx-print';
import { DanhsachthietbiComponent } from './danhsachthietbi/danhsachthietbi.component';
import { HomethietbiComponent } from './homethietbi/homethietbi.component';
import { BangchecklistdinhkyComponent } from './bangchecklistdinhky/bangchecklistdinhky.component';
import { CapnhathosothietbiComponent } from './capnhathosothietbi/capnhathosothietbi.component';
import { KehoachbaoduongComponent } from './kehoachbaoduong/kehoachbaoduong.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { User } from '../hethong/user.model';
import { DanhgiavesinhcongnghiepComponent } from './danhgiavesinhcongnghiep/danhgiavesinhcongnghiep.component';


@NgModule({
  declarations: [DanhsachthietbiComponent,
    HomethietbiComponent, BangchecklistdinhkyComponent,
     CapnhathosothietbiComponent, KehoachbaoduongComponent, DanhgiavesinhcongnghiepComponent],
  imports: [
    TacvuRoutingModule,
    ModalModule,
    FormsModule,
    HttpModule,
    SharedModule,
    NgxPrintModule,
    BsDatepickerModule,
  ],
  providers: [
  ]
})
export class TacvuModule { }
