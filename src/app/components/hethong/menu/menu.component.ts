import { NavData } from './../../../shared/menu';
import { Component, OnInit } from '@angular/core';
import { MenuDetailService } from '../../../shared/menu-detail.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
private _listMenu: [
  {
    MenuID: '',
    name: '',
    url: '',
    icon: '',
    title: '',
    children: []
  }
];
  constructor(private menu: MenuDetailService) { }

  ngOnInit() {
    this.menu.getDataMenu().subscribe(
      (res: any) => {
      this._listMenu = res.list;
      },
      err => {
        if (err.status === 400) {
          console.log(err);
        }
      }
    );
  }

}
