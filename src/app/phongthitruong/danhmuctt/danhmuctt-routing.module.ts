import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { CachtinhdongiaComponent } from './cachtinhdongia/cachtinhdongia.component';

const routes: Routes = [
  {
    canActivateChild: [AuthGuard],
    path: 'cachtinhdongia',
    component: CachtinhdongiaComponent,
    data: {routeLink: '/danhmuctt/cachtinhdongia'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DanhmucttRoutingModule { }
