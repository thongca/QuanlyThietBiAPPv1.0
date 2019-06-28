import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPermissionsModule } from 'ngx-permissions';
import { BtnPerDirective } from '../directive/btn-per.directive';

@NgModule({
  declarations: [BtnPerDirective],
  imports: [
  ],
  exports: [
    CommonModule,
    NgxPermissionsModule,
    BtnPerDirective
  ]
})
export class SharedModule { }
