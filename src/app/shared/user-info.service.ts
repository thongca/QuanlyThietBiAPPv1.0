import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { RootbaseUrlService } from './rootbase-url.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  public user: {
    AvaUser: string,
    BanGiamDoc: boolean,
    FullName: string,
    GroupRoleID: string,
    IsActive: boolean,
    IsAdmin: boolean,
    UserID: string,
    UserName: string,
    Permission: string
  };

  public AvaUrl: string;
  public listQuyen:
    {
      MenuID: string,
      RightAdd: boolean,
      RightDel: boolean,
      RightExport: boolean,
      RightUpdate: boolean,
      RightView: boolean,
      routerLink: string,
    }[] = []
    ;
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    const _listQuyen = localStorage.getItem('listQuyen');
    this.listQuyen = JSON.parse(_listQuyen);
    this.BaseURL = this.baseUrl_.sbaseURL;
  }
  r1GetobjPermission(): string {
    const retrievedObject = localStorage.getItem('user');
    this.user = JSON.parse(retrievedObject);
    if (this.user === undefined || this.user === null) {
      this.AvaUrl = '/upload/user.png';
    } else {
      this.AvaUrl = this.user.AvaUser;
    }
    const Permission =  this.user.Permission;
return Permission;
  }
  R1_GetDataUser(): string {
    const retrievedObject = localStorage.getItem('user');
    this.user = JSON.parse(retrievedObject);
    let AvatarUrl = this.user.AvaUser;
    if (AvatarUrl === null || AvatarUrl === undefined) {
      AvatarUrl = '/upload/user.png';
    }
    return AvatarUrl;
  }
}
