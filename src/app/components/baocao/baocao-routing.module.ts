import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { BaocaochecklistComponent } from './baocaochecklist/baocaochecklist.component';
import { BaocaovesinhcongnghiepComponent } from './baocaovesinhcongnghiep/baocaovesinhcongnghiep.component';
import { BaocaotinhtrangthietbiComponent } from './baocaotinhtrangthietbi/baocaotinhtrangthietbi.component';
import { BaocaovesinhmayhangngayComponent } from './baocaovesinhmayhangngay/baocaovesinhmayhangngay.component';
const routes: Routes = [
  {
    canActivateChild: [AuthGuard],
    path: 'baocaochecklist',
    component: BaocaochecklistComponent,
    data: {routeLink: '/baocao/baocaochecklist'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'baocaovesinhcongnghiep',
    component: BaocaovesinhcongnghiepComponent,
    data: {routeLink: '/baocao/baocaovesinhcongnghiep'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'baocaotinhtrangthietbi',
    component: BaocaotinhtrangthietbiComponent,
    data: {routeLink: '/baocao/baocaotinhtrangthietbi'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'baocaovesinhmayhangngay',
    component: BaocaovesinhmayhangngayComponent,
    data: {routeLink: '/baocao/baocaovesinhmayhangngay'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaocaoRoutingModule { }
