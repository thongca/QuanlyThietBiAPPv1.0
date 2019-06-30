import { CapnhathosothietbiComponent } from './capnhathosothietbi/capnhathosothietbi.component';
import { HomethietbiComponent } from './homethietbi/homethietbi.component';
import { DanhsachthietbiComponent } from './danhsachthietbi/danhsachthietbi.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { BangchecklistdinhkyComponent } from './bangchecklistdinhky/bangchecklistdinhky.component';
import { KehoachbaoduongComponent } from './kehoachbaoduong/kehoachbaoduong.component';
import { DanhgiavesinhcongnghiepComponent } from './danhgiavesinhcongnghiep/danhgiavesinhcongnghiep.component';
import { BaoduongdinhkyComponent } from './baoduongdinhky/baoduongdinhky.component';

const routes: Routes = [
  {
    canActivateChild: [AuthGuard],
    path: 'danhsachthietbi',
    component: DanhsachthietbiComponent,
    data: {routeLink: '/tacvu/danhsachthietbi'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'homethietbi',
    component: HomethietbiComponent,
    data: {routeLink: '/tacvu/homethietbi'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'bangchecklistdinhky',
    component: BangchecklistdinhkyComponent,
    data: {routeLink: '/tacvu/bangchecklistdinhky'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'capnhathosothietbi',
    component: CapnhathosothietbiComponent,
    data: {routeLink: '/tacvu/capnhathosothietbi'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'kehoachbaoduongkiemdinh',
    component: KehoachbaoduongComponent,
    data: {routeLink: '/tacvu/kehoachbaoduongkiemdinh'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'danhgiavesinhcongnghiep',
    component: DanhgiavesinhcongnghiepComponent,
    data: {routeLink: '/tacvu/danhgiavesinhcongnghiep'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'baoduongdinhky',
    component: BaoduongdinhkyComponent,
    data: {routeLink: '/tacvu/baoduongdinhky'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TacvuRoutingModule { }
