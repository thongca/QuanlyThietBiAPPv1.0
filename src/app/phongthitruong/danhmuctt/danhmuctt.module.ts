import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { DanhmucttRoutingModule } from './danhmuctt-routing.module';
import { CachtinhdongiaComponent } from './cachtinhdongia/cachtinhdongia.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import {NgxPrintModule} from 'ngx-print';
import { SharedModule } from '../../shared/shared.module';
import { TieuchitinhgiaComponent } from './tieuchitinhgia/tieuchitinhgia.component';


@NgModule({
  declarations: [CachtinhdongiaComponent, TieuchitinhgiaComponent],
  imports: [
    CommonModule,
    DanhmucttRoutingModule,
    ModalModule,
    FormsModule,
    HttpModule,
    NgxPrintModule,
    SharedModule,
  ]
})
export class DanhmucttModule { }
