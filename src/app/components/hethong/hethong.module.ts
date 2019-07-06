
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { } from '../../shared/menu-detail.service';
import { HethongRoutingModule } from './hethong-routing.module';
import { NguoisudungComponent } from './nguoisudung/nguoisudung.component';

// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
import { NhomnguoidungComponent } from './nhomnguoidung/nhomnguoidung.component';
import { PhanmenunhomquyenComponent } from './phanmenunhomquyen/phanmenunhomquyen.component';
import { SharedModule } from '../../shared/shared.module';
import { User } from './user.model';
import { MenuphongbanComponent } from './menuphongban/menuphongban.component';
import { Menuphongban } from './menuphongban/menuphongban';
import { MenuComponent } from './menu/menu.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [NguoisudungComponent, NhomnguoidungComponent, PhanmenunhomquyenComponent, MenuphongbanComponent, MenuComponent ],
  imports: [
    CommonModule,
    HethongRoutingModule,
    ModalModule,
    FormsModule,
    SharedModule,
    NgMultiSelectDropDownModule
  ],
  providers: [
    User,
    Menuphongban
  ]
})
export class HethongModule { }
