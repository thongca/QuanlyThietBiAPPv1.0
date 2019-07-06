import { SharedModule } from './../../shared/shared.module';
import { PhongbanService } from './service/phongban.service';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { DanhmucRoutingModule } from './danhmuc-routing.module';
import { PhongbanComponent } from './phongban/phongban.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { ThietbiComponent } from './thietbi/thietbi.component';
import { NhomthietbiComponent } from './nhomthietbi/nhomthietbi.component';
import { DonvitinhComponent } from './donvitinh/donvitinh.component';
import {NgxPrintModule} from 'ngx-print';
import { KhuvucmayComponent } from './khuvucmay/khuvucmay.component';
import { QuydinhdiemdanhgiaComponent } from './quydinhdiemdanhgia/quydinhdiemdanhgia.component';
import { KhuvucvesinhcongnghiepComponent } from './khuvucvesinhcongnghiep/khuvucvesinhcongnghiep.component';
import { ChitietvesinhcongnghiepComponent } from './chitietvesinhcongnghiep/chitietvesinhcongnghiep.component';
import { VattucodienComponent } from './vattucodien/vattucodien.component';
import { NhomvattucodienComponent } from './nhomvattucodien/nhomvattucodien.component';
import { TintucComponent } from './tintuc/tintuc.component';


@NgModule({
  declarations: [PhongbanComponent, ThietbiComponent, NhomthietbiComponent,
     DonvitinhComponent, KhuvucmayComponent, QuydinhdiemdanhgiaComponent,
      KhuvucvesinhcongnghiepComponent, ChitietvesinhcongnghiepComponent,
       VattucodienComponent,
       NhomvattucodienComponent,
       TintucComponent],
  imports: [
    SharedModule,
    DanhmucRoutingModule,
    ModalModule,
    FormsModule,
    HttpModule,
    NgxPrintModule
  ],
  providers: [
    PhongbanService
  ]
})
export class DanhmucModule { }
