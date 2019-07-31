import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { TinhgiaoffsetComponent } from './tinhgiaoffset/tinhgiaoffset.component';

const routes: Routes = [
  {
    canActivateChild: [AuthGuard],
    path: 'tinhgiaoffset',
    component: TinhgiaoffsetComponent,
    data: {routeLink: '/tacvu/tinhgiaoffset'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NghiepvutinhgiaRoutingModule { }
