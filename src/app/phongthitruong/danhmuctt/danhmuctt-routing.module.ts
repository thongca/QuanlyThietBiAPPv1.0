import { DailuongtinhiaComponent } from './dailuongtinhia/dailuongtinhia.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { CachtinhdongiaComponent } from './cachtinhdongia/cachtinhdongia.component';
import { TieuchitinhgiaComponent } from './tieuchitinhgia/tieuchitinhgia.component';

const routes: Routes = [
  {
    canActivateChild: [AuthGuard],
    path: 'cachtinhdongia',
    component: CachtinhdongiaComponent,
    data: {routeLink: '/danhmuctt/cachtinhdongia'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'tieuchitinhgia',
    component: TieuchitinhgiaComponent,
    data: {routeLink: '/danhmuctt/tieuchitinhgia'}
  },
  {
    canActivateChild: [AuthGuard],
    path: 'dailuongtinhgia',
    component: DailuongtinhiaComponent,
    data: {routeLink: '/danhmuctt/dailuongtinhgia'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhmucttRoutingModule { }
