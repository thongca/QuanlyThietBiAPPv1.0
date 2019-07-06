import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { headersToString } from 'selenium-webdriver/http';
import { User } from './user.model';
import {  Nguoisudung, DelUser } from './nguoisudung';
import { ToastrService } from 'ngx-toastr';
import { Data } from '@angular/router';
// url service
import { RootbaseUrlService } from '../../shared/rootbase-url.service';

@Injectable({
  providedIn: 'root'
})
export class ModelHethongService {
  public list: {
    error: '',
    data:
      {
        UserID: '';
        UserName: '';
        Password: '';
        FullName: '';
        Email: '';
        PhoneNumber: '';
        Address: '';
        IsOrder: 0;
        IsActive: true;
        IsAdmin: false;
        AvaUser: '';
        BirthDay: '';
        SexUser: true;
        GroupRoleName: string;
        TenPhongBan: string;
    }[],
    total: 0
  };
  public ObjUserByID: any;
  public progress: number;
  private ms: {};
  public message: string;
  private tokenHeader = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('token')});
  private BaseURL: string;
  private chilURl = '/api/AppSysUser/adduser';
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private baseUrl_: RootbaseUrlService
     ) {
       this.BaseURL = this.baseUrl_.sbaseURL;
      }



  R3_AddUserservice(files, user, Nhamay) {
    const formData = new FormData();
    // tslint:disable-next-line:max-line-length
    if (files  !== undefined) {
      formData.append('flag', 'File' );
      for (const file of files) {
        formData.append(file.name, file);
      }
    } else {
      formData.append('flag', 'NoFile' );
    }
    formData.append('user', JSON.stringify(user));
    formData.append('NhaMay', JSON.stringify(Nhamay));
    const uploadReq = new HttpRequest('POST', this.BaseURL + this.chilURl, formData, {reportProgress: true, headers: this.tokenHeader});

    return this.http.request(uploadReq).pipe();
  }

  R1_GetDataGroupRole() {
    const options_: any = {
  ContentType: 'application/json',
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
};
    return this.http.get(this.BaseURL + '/api/AppSysUser/ListGroupRole' , options_);
  }
  r1GetDataPhongBan() {
      const options_: any = {
      ContentType: 'application/json',
      headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
      };
    return this.http.get(this.BaseURL + '/api/AppSysUser/r1ListPhongBan' , options_);
  }

  R1_GetDataUser(options: object) {
        const options_: any = {
      observe: 'response',
      responseType: 'blob',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(this.BaseURL + '/api/AppSysUser/ListUsers', options , {headers: this.tokenHeader}).toPromise()
    .then(res => {
      this.list = res as Nguoisudung;
    });
  }

  R1GetUserByID(UserID: string) {
   return this.http.get(this.BaseURL + '/api/AppSysUser/' + UserID, {headers: this.tokenHeader});
  }

  R2UpdateUser(files, user, Nhamay) {
    console.log(user);
    const formData = new FormData();
    // tslint:disable-next-line:max-line-length
    if (files  !== undefined) {
      formData.append('flag', 'File' );
      for (const file of files) {
        formData.append(file.name, file);
      }
    } else {
      formData.append('flag', 'NoFile' );
    }
    formData.append('user', JSON.stringify(user));
    formData.append('NhaMay', JSON.stringify(Nhamay));
    // tslint:disable-next-line:max-line-length
    const uploadReq = new HttpRequest('POST', this.BaseURL + '/api/AppSysUser/updateUser', formData, {reportProgress: true, headers: this.tokenHeader});

   return this.http.request(uploadReq).toPromise().then((res) => {
      this.ms = res;
     this.toastr.success('Sửa thông tin người dùng thành công', 'Thông báo');
    });
  }
  R4_deleteUser(users: DelUser) {
const content_ = JSON.stringify(users);
const options_: any = {
  body: content_,
  observe: 'response',
  responseType: 'blob',
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
};
const formData = new FormData();
formData.append('content_', content_);
const uploadReq = new HttpRequest('post', this.BaseURL + '/api/AppSysUser/DelUser', formData, options_);
    return this.http.request(uploadReq).toPromise().then((value) => {
        console.log(value);
      }).catch(err => {
        console.log(err);
      });
  }

  // danh cho form phan quyen menu
  r1GetDataGroupRole(options: object) {
    const options_: any = {
  ContentType: 'application/json',
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
};
    return this.http.post(this.BaseURL + '/api/AppSysUser/PhanQuyenListGroupRole', options , options_);
  }
}
