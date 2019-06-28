import { PhanmenunhomquyenComponent } from './phanmenunhomquyen/phanmenunhomquyen.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NguoisudungComponent } from './nguoisudung/nguoisudung.component';
import { from } from 'rxjs';
import { AuthGuard } from '../../auth/auth.guard';
import { NhomnguoidungComponent } from './nhomnguoidung/nhomnguoidung.component';
import { MenuphongbanComponent } from './menuphongban/menuphongban.component';
const routes: Routes = [
      {
        canActivateChild: [AuthGuard],
        path: 'nguoisudung',
        component: NguoisudungComponent,
        data: {routeLink: '/hethong/nguoisudung'}
      },
      {
        canActivateChild: [AuthGuard],
        path: 'nhomnguoidung',
        component: NhomnguoidungComponent,
        data: {routeLink: '/hethong/nhomnguoidung'}
      },
      {
        canActivateChild: [AuthGuard],
        path: 'phanmenuchonhomnguoidung',
        component: PhanmenunhomquyenComponent,
        data: {routeLink: '/hethong/phanmenuchonhomnguoidung'}
      },
      {
        canActivateChild: [AuthGuard],
        path: 'menuphongban',
        component: MenuphongbanComponent,
        data: {routeLink: '/hethong/menuphongban'}
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HethongRoutingModule { }
