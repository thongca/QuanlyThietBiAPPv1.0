import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../../shared/login.service';
import { ModalDirective} from 'ngx-bootstrap/modal';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { CaptchaComponent } from 'angular-captcha';
import { RootbaseUrlService } from '../../shared/rootbase-url.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  User = {
    Username: '',
    Password: ''
  };



// khai báo string
errormodal: string;
modeltitle: string;

private BaseURL: string;

  constructor(
    private login: LoginService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService ,
    private toastr: ToastrService,
    private baseUrl_: RootbaseUrlService,
    ) {
      this.BaseURL = this.baseUrl_.sbaseURL;
  }
  ngOnInit() {
    if (localStorage.getItem('token') !== null || localStorage.length !== 0) {
      this.router.navigateByUrl('/trangchu');
    }
  }
  QuenMatKhau() {
    this.toastr.info('Vui lòng liên hệ với quản trị viên, để được cấp lại mật khẩu!', 'Thông báo');
  }
  LoginClick() {
    if (this.User.Password === '' || this.User.Password === null || this.User.Username === '' || this.User.Username === null) {
      this.toastr.error('Tên đăng nhập hoặc mật khẩu không được để trống. Vui lòng kiểm tra lại!', 'Thông báo');
      return false;
    }
    this.spinnerService.show();
    this.login.CheckLogin(this.User).subscribe(
      (res: any) => {
        if (res !== undefined) {
          if (res['error'] === 1) {
            this.errormodal = res['ms'];
            this.toastr.warning(res['ms'], 'Thông báo');
            return false;
          } else if (res['error'] === 2) {
         this.toastr.warning(res['ms'], 'Thông báo');
            this.errormodal = res['ms'];
            return false;
          } else {
            this.spinnerService.hide();
            localStorage.setItem('listQuyen', JSON.stringify(res._listQuyen));
            localStorage.setItem('user', JSON.stringify(res.u));
            localStorage.setItem('token', res.token);
            location.reload();
            this.toastr.info('Đăng nhập thành công', 'Thông báo');
            this.router.navigateByUrl('/trangchu');
          }
        } else {
         this.toastr.warning('Tài khoản hoặc mật khẩu không chính xác, Vui lòng kiểm tra lại!', 'Thông báo');
          return false;
        }
      },
      err => {
        if (err.status === 500) {
          this.toastr.error('Mất kết nối máy chủ, vui lòng kiểm tra lại đường dẫn!', 'Thông báo');
          return false;
        } if (err.status === 502) {
          this.toastr.error('Không có phản hồi từ máy chủ hoặc mất kết nối tới máy chủ, vui lòng kiểm tra lại đường dẫn!', 'Thông báo');
          return false;
        }
      }
    );
  }

 }
