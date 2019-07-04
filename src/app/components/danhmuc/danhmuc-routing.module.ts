import { PhongbanComponent } from './phongban/phongban.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { ThietbiComponent } from './thietbi/thietbi.component';
import { NhomthietbiComponent } from './nhomthietbi/nhomthietbi.component';
import { DonvitinhComponent } from './donvitinh/donvitinh.component';
import { KhuvucmayComponent } from './khuvucmay/khuvucmay.component';
import { QuydinhdiemdanhgiaComponent } from './quydinhdiemdanhgia/quydinhdiemdanhgia.component';
import { KhuvucvesinhcongnghiepComponent } from './khuvucvesinhcongnghiep/khuvucvesinhcongnghiep.component';
import { ChitietvesinhcongnghiepComponent } from './chitietvesinhcongnghiep/chitietvesinhcongnghiep.component';
import { NhomvattucodienComponent } from './nhomvattucodien/nhomvattucodien.component';
import { VattucodienComponent } from './vattucodien/vattucodien.component';

const routes: Routes = [
  {
    canActivateChild: [AuthGuard],
    path: 'phongban',
    component: PhongbanComponent,
    data: {routeLink: '/danhmuc/phongban'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'thietbi',
    component: ThietbiComponent,
    data: {routeLink: '/danhmuc/thietbi'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'nhomthietbi',
    component: NhomthietbiComponent,
    data: {routeLink: '/danhmuc/nhomthietbi'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'donvitinh',
    component: DonvitinhComponent,
    data: {routeLink: '/danhmuc/donvitinh'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'khuvucmay',
    component: KhuvucmayComponent,
    data: {routeLink: '/danhmuc/khuvucmay'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'quydinhdanhgia',
    component: QuydinhdiemdanhgiaComponent,
    data: {routeLink: '/danhmuc/quydinhdanhgia'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'khuvucvesinhcongnghiep',
    component: KhuvucvesinhcongnghiepComponent,
    data: {routeLink: '/danhmuc/khuvucvesinhcongnghiep'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'chitietvesinhcongnghiep',
    component: ChitietvesinhcongnghiepComponent,
    data: {routeLink: '/danhmuc/chitietvesinhcongnghiep'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'nhomvattucodien',
    component: NhomvattucodienComponent,
    data: {routeLink: '/danhmuc/nhomvattucodien'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'vattucodien',
    component: VattucodienComponent,
    data: {routeLink: '/danhmuc/vattucodien'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhmucRoutingModule { }
