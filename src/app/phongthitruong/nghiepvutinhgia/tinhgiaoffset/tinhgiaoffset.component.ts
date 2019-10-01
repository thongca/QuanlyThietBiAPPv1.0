import { TinhgiaoffsetService } from './tinhgiaoffset.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { DonvitinhService } from '../../../components/danhmuc/donvitinh/donvitinh.service';
import { Subscription } from 'rxjs';
import { Tinhgiaoffset, ObjSanPhamDonHang } from './tinhgiaoffset.model';
import { Tieuchitinhgia } from '../../danhmuctt/tieuchitinhgia/tieuchitinhgia.model';
import { TieuchitinhgiaService } from '../../danhmuctt/tieuchitinhgia/tieuchitinhgia.service';
import { DailuongtinhgiaService } from '../../danhmuctt/dailuongtinhia/dailuongtinhgia.service';
import { LoaiHop, LoaiIn } from '../../danhmuctt/dailuongtinhia/dailuongtinhgia.model';
@Component({
  selector: 'app-tinhgiaoffset',
  templateUrl: './tinhgiaoffset.component.html',
  styleUrls: ['./tinhgiaoffset.component.scss']
})
export class TinhgiaoffsetComponent implements OnInit, OnDestroy {
  options = {
    s: '', p: 1, pz: 20, totalpage: 0, total: 0,
    paxpz: 0, mathP: 0, MaSanPham: '', TenSanPham: '', NhaMayID: 0,
    LoaiInID: 1, LoaiHopID: 1,
    TongGiaMin: 0,
    TongGiaMax: 0
  };
  SecondCode: number;
  FirstCodeOld: string;
  YearCodeOld: number;
  TotalPrice: number;
  // subscript
  private subscription: Subscription;
  private subscription1: Subscription;
  private subscription2: Subscription;

  // modal
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('tieuchiModal') public tieuchiModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;

  // tìm kiếm
  todos$ = this.s.$search;
  checkall: boolean;
  checkalltieuchi: boolean;
  // string
  public modeltitle: string;
  CheckLength: number;
  CheckLengthTieuChi: number;
  SanPhamDonHangID: string;
  errormodal: string;
  // obj
  opt: {
    LoaiInID: number,
    LoaiHopID: number,
    TongGiaMin: number,
    TongGiaMax: number
  };
  // list
  listSanPhamDonHang_: ObjSanPhamDonHang[] = [];
  listCotSP_: Tinhgiaoffset[] = []; // cột sản phẩm
  listCotTK_: Tinhgiaoffset[] = []; // cột triển khai
  listCotCT_: Tinhgiaoffset[] = []; // cột công thức
  // list
  listTieuChiTinhGia_: Tieuchitinhgia[] = [];
  listTCTGDaChon_: Tieuchitinhgia[] = [];
  listTCTGChuaChon_: Tieuchitinhgia[] = [];
  listLoaiSL_: {
    LoaiSoLieu: number;
    TenLoai: string;
  }[] = [];
  // danh sách loại hộp
  listLoaiHop: LoaiHop[] = [];
  listLoaiIn: LoaiIn[] = [];
  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private s: SearchService,
    private _userInfo: UserInfoService,
    private toastr: ToastrService,
    private permissionsService: NgxPermissionsService,
    private donviservice_: DonvitinhService,
    private tinhgiaoffsservice_: TinhgiaoffsetService,
    private tieuchitinhgiaservice_: TieuchitinhgiaService,
    private dailuongservice_: DailuongtinhgiaService
  ) { }

  ngOnInit() {
    // check permission admin
    let Permission = this._userInfo.r1GetobjPermission();
    if (Permission === undefined) {
      Permission = 'NoAdmin';
    }
    this.permissionsService.loadPermissions([`${Permission}`]);

    // tìm kiếm
    this.subscription2 = this.todos$.subscribe(res => {
      if (res === undefined || res === '') {
        this.options.s = '';
        this.R1GetListDonViTinh();
      } else {
        this.options.s = res;
        this.R1GetListDonViTinh();
      }
    });
    this.R1GetListTCTC();
    this.R1GetListLoaiIn();
    this.R1GetListLoaiHop();
  }
  SetTotalPage() {
    this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
    this.options.mathP = this.options.pz * this.options.p;
  }
  // danh sách loại in
  R1GetListLoaiIn() {
    this.spinnerService.show();
    this.subscription = this.dailuongservice_.r1ListLoaiIn().subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo');
        return false;
      }
      this.listLoaiIn = res['data'];
      this.options.LoaiInID = 1;
    },
      err => {
        if (err.status === 500) {
          this.toastr.error('Mất kết nối đến máy chủ. Vui lòng kiểm tra lại đường dẫn.', 'Thông báo');
          return false;
        }
      });
  }
  // danh sách loại hộp
  R1GetListLoaiHop() {
    this.spinnerService.show();
    this.subscription = this.dailuongservice_.r1ListLoaiHop().subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo');
        return false;
      }
      this.listLoaiHop = res['data'];
      this.options.LoaiHopID = 1;
    },
      err => {
        if (err.status === 500) {
          this.toastr.error('Mất kết nối đến máy chủ. Vui lòng kiểm tra lại đường dẫn.', 'Thông báo');
          return false;
        }
      });
  }
  // danh sách cột đại lượng tính giá
  R1GetListCot() {
    this.spinnerService.show();
    const masanpham = 'APP-2050-20000';
    this.subscription = this.tinhgiaoffsservice_
      .r1ListCsl(
        masanpham,
        this.options.LoaiHopID,
        this.options.LoaiInID)
      .subscribe(res => {
        this.spinnerService.hide();
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo lỗi');
          return false;
        }
        this.listCotSP_ = res['data'];
        this.listCotTK_ = res['datatk'];
        this.listCotCT_ = res['datact'];
      });
  }

  // công thức trong đại lượng
  tinhToanTheoCongThuc(row: Tinhgiaoffset) {
    const listDaiLuong_ = [];
    let congthuc = row.CongThuc; // khai báo công thức để cố đinh công thức truyền vào từ row
    this.listCotSP_.forEach(item => {
      if (congthuc.includes(item.KHSoLieu)) {
        if (item.GiaTri === '' || item.GiaTri === undefined) {
          listDaiLuong_.push(item.KHSoLieu); // đẩy đại lượng trống giá trị vào danh sách chờ hiện ra màn hình
          return false;
        }
        congthuc = congthuc.replace(item.KHSoLieu, item.GiaTri);
      }
    });
    this.listCotTK_.forEach(element => {
      if (congthuc.includes(element.KHSoLieu)) {
        if (element.GiaTri === '' || element.GiaTri === undefined) {
          listDaiLuong_.push(element.KHSoLieu); // đẩy đại lượng trống giá trị vào danh sách chờ hiện ra màn hình
          return false;
        }
        congthuc = congthuc.replace(element.KHSoLieu, element.GiaTri);
      }
    });
    if (listDaiLuong_.length > 0) {
      this.toastr.error(`Vui lòng nhập giá trị vào các đại lượng ${listDaiLuong_}`, 'Thông báo');
      return false;
    }
    // tslint:disable
    row.GiaTri = eval(congthuc);
  }
  R1GetListTCTC() {
    this.options.NhaMayID = Number(localStorage.getItem('NhaMayID'));
    this.spinnerService.show();
    this.subscription = this.tieuchitinhgiaservice_.r1ListTT_DM_TCTC(this.options).subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.listTieuChiTinhGia_ = res['data'];
      this.options.total = res['total'];
      this.SetTotalPage();
      if (this.options.p > 1) {
        this.options.paxpz = (this.options.p - 1) * this.options.pz;
      } else {
        this.options.paxpz = 0;
      }
    },
      err => {
        if (err.status === 500) {
          this.toastr.error('Mất kết nối đến máy chủ. Vui lòng kiểm tra lại đường dẫn.', 'Thông báo');
          return false;
        }
      });
  }
  // danh sách đơn vị tính
  R1GetListDonViTinh() {
    this.spinnerService.show();
    this.subscription = this.tinhgiaoffsservice_
      .r1ListsanPhamDH(
        this.options.MaSanPham,
        this.options.LoaiHopID,
        this.options.LoaiInID
      ).subscribe(res => {
        this.spinnerService.hide();
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo lỗi');
          return false;
        }
        this.listSanPhamDonHang_ = res['data'];
        this.options.total = res['total'];
        this.SetTotalPage();
        if (this.options.p > 1) {
          this.options.paxpz = (this.options.p - 1) * this.options.pz;
        } else {
          this.options.paxpz = 0;
        }
      });
    const op = { url: '/tacvu/tinhgia' };
    this.tinhgiaoffsservice_.r1CheckCode(op).subscribe(res => {
      this.SecondCode = res['SecondCodeOld'];
      this.FirstCodeOld = res['FirstCodeOld'];
      this.YearCodeOld = res['YearCodeOld'];
      this.options.MaSanPham = `${this.FirstCodeOld}-${this.YearCodeOld}-${this.SecondCode + 1}`;
    });
  }

  Showmodal(check) {
    this.R1GetListCot();
    if (check === 'add') {
      this.modeltitle = 'Thêm mới bảng tính giá';
      // tslint:disable-next-line:max-line-length
      this.listTCTGDaChon_ = [];
      this.options.TongGiaMax = 0;
      this.options.TongGiaMin = 0;
      this.largeModal.show();
    } else {
    }
  }
  // modal
  modalUserInGroup(DonViTinhID) {
    // this.donviservice_.r1GetnhomTBbyID(DonViTinhID).subscribe(res => {
    //   if (res['error'] === 1) {
    //     this.toastr.error(res['ms'], 'Thông báo lỗi');
    //     return false;
    //   }
    // });
  }


  // thêm mới, sửa đơn vị tính
  R2AdDataBangTinhLuong() {
    const LuaChon = { LoaiHopID: this.options.LoaiHopID, LoaiInID: this.options.LoaiInID };
    const TongGia = { TongGiaMin: this.options.TongGiaMin, TongGiaMax: this.options.TongGiaMax };
    const sanPham = { TenSanPham: this.options.TenSanPham, MaSanPham: this.options.MaSanPham };
    this.spinnerService.show();
    this.tinhgiaoffsservice_.R2AddBangTinhGia(this.listCotSP_, this.listCotTK_, this.listTCTGDaChon_, sanPham, LuaChon, TongGia, this.SanPhamDonHangID, (this.SecondCode + 1)).subscribe(res => {
      this.spinnerService.hide();
      if (res !== undefined) {

        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo lỗi');
          return false;
        } else {
          this.toastr.success('Cập nhật bảng tính giá thành công.', 'Thông báo');
          this.R1GetListDonViTinh();
          this.largeModal.hide();
        }
      }
    }, err => {
      if (err.status == 500) {
        this.toastr.error('Mất kết nối đến máy chủ. Vui lòng kiểm tra lại đường dẫn', 'Thông báo')
      }
    });
  }
  // modal
  SelectIDEditModel(SanPhamDonHangID: string) {
    this.modeltitle = 'Sửa bảng tính giá';
    this.SanPhamDonHangID = SanPhamDonHangID;
    this.subscription1 = this.tinhgiaoffsservice_
      .r1GetBangTGbyID(
        this.options.MaSanPham,
        this.options.LoaiHopID,
        this.options.LoaiInID,
        SanPhamDonHangID,
      ).subscribe(res => {
        if (res !== undefined) {
          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          }
          this.listCotSP_ = res['data'];
          this.listCotTK_ = res['datatk'];
          this.listTCTGDaChon_ = res['datadc']
          this.opt = res['opt']
          this.options.LoaiInID = this.opt.LoaiInID;
          this.options.LoaiHopID = this.opt.LoaiHopID;
          this.options.TongGiaMax = this.opt.TongGiaMax;
          this.options.TongGiaMin = this.opt.TongGiaMin;
        }
        this.largeModal.show();
      }, err => {
        if (err.status === 500) {
          this.toastr.error('Mất kết nối đến cơ sở dữ liệu, Vui lòng kiểm tra lại đường dẫn', 'Thông báo');
          return false;
        }
      });
  }

  HideModal() {
    this.largeModal.hide();
    this.R1GetListDonViTinh();
  }


  xacnhanXoa(rowto) {
    if (this.CheckLength > 0) {
      this.r4DelDonViTinh(rowto);
    }
  }
  r4DelDonViTinh(rowto) {
    const arr = [
    ];
    rowto.forEach(function (item) {
      if (item.checked) {
        const obj = { DonViTinhID: item.DonViTinhID };
        arr.push(obj);
      }
    });
    this.donviservice_.r4deleteDonViTinh(arr).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo lỗi');
          return false;
        }
        this.warningModal.hide();
        this.toastr.success('Xóa thành công đơn vị tính', 'Thông báo');
        this.CheckLength = 0;
        this.R1GetListDonViTinh();
      }
    });
  }
  showmodaltieuchi() {
    // tắt checkall môi khi mở modal
    this.checkalltieuchi = false;
    this.tieuchiModal.show();
    // tắt lưu cache trong khi bật modal
    const data = this.listTieuChiTinhGia_.filter(c => c.checked === true);
    data.forEach(function (item) {
      item.checked = false;
    });
    this.listTCTGChuaChon_ = this.listTieuChiTinhGia_.filter(c => this.listTCTGDaChon_.filter(v => v.TieuChiID === c.TieuChiID).length !== 1);
  }

  // thay đổi các loại in và loại hộp
  LoaiInChanged() {
    this.options.TongGiaMax = 0;
    this.options.TongGiaMin = 0;
    this.listTCTGDaChon_ = [];
    this.R1GetListCot();
    this.R1GetListDonViTinh();
  }
  LoaiHopChanged() {
    this.options.TongGiaMax = 0;
    this.options.TongGiaMin = 0;
    this.listTCTGDaChon_ = [];
    this.R1GetListCot();
    this.R1GetListDonViTinh();
  }
  // xóa tiêu chí đã chọn
  XoaTieuChiDaChon(row, index) {
    this.options.TongGiaMax = 0;
    this.options.TongGiaMin = 0;
    this.listTCTGDaChon_.splice(index, 1); // xóa đi một phần tử trong mảng theo index
    // lọc khác biệt giữa 2 list
    this.listTCTGChuaChon_ = this.listTieuChiTinhGia_.filter(c => !this.listTCTGDaChon_.includes(c));
    this.listTCTGDaChon_.forEach(item => {
      this.options.TongGiaMax += item.GiaMax;
      this.options.TongGiaMin += item.GiaMin;
    });
  }
  // chọn các tiêu chí
  chonTieuChi(noti) {
    this.options.TongGiaMax = 0;
    this.options.TongGiaMin = 0;
    // khai báo danh sách các đại lượng chưa nhập giá trị
    let listDaiLuong_ = [];
    // khai báo tông giá sản phẩm
    let _totalprice = 0;
    // lọc ra những tiêu chí được chọn từ modal để cho ra list đã chọn
    const data = this.listTCTGChuaChon_.filter(c => c.checked === true);
    for (let index = 0; index < data.length; index++) {
      if (this.listTCTGDaChon_ !== undefined) {
        if (this.listTCTGDaChon_.filter(x => x.TieuChiID !== data[index].TieuChiID)) { // nếu tiêu chí đã tồn tại trong danh sách đã chọn thì không add vào nữa
          this.listTCTGDaChon_.push(data[index]);
        }
      } else {
        let obj = {};
        obj = data[index];
        this.listTCTGDaChon_.push(obj as Tieuchitinhgia);
      }
    }
    // for list đã chọn để tính toán theo công thức của list đã chọn trên ô sản phầm
    this.listTCTGDaChon_.forEach(item => {
      let congthucmin = item.CongMin + '*' + item.CongThuc;
      let congthucmax = item.CongMax + '*' + item.CongThuc;
      this.listCotSP_.forEach(t => {
        if (congthucmin.includes(t.KHSoLieu)) {
          if (t.GiaTri === '' || t.GiaTri === undefined || t.GiaTri === null) {
            listDaiLuong_.push(t.KHSoLieu);
            return false;
          }
          congthucmin = congthucmin.replace(t.KHSoLieu, t.GiaTri);
        }
        if (congthucmax.includes(t.KHSoLieu)) {
          if (t.GiaTri === '' || t.GiaTri === undefined || t.GiaTri === null) {
            listDaiLuong_.push(t.KHSoLieu);
            return false;
          }
          congthucmax = congthucmax.replace(t.KHSoLieu, t.GiaTri);
        }
      });
      // for list đã chọn để tính toán theo công thức của list đã chọn dưới ô kích thước triển khai
      this.listCotTK_.forEach(element => {
        if (congthucmin.includes(element.KHSoLieu)) {
          if (element.GiaTri === '' || element.GiaTri === undefined || element.GiaTri === null) {
            listDaiLuong_.push(element.KHSoLieu);
            return false;
          }
          congthucmin = congthucmin.replace(element.KHSoLieu, element.GiaTri);
        }
        if (congthucmax.includes(element.KHSoLieu)) {
          if (element.GiaTri === '' || element.GiaTri === undefined || element.GiaTri === null) {
            listDaiLuong_.push(element.KHSoLieu);
            return false;
          }
          congthucmax = congthucmax.replace(element.KHSoLieu, element.GiaTri);
        }
      });

      // hiện thị ra màn hình những ô chưa được nhập mà còn thiếu trong công thức
      if (listDaiLuong_.length > 0) {
        this.toastr.error(`Vui lòng nhập giá trị vào đại lượng ${listDaiLuong_}`, 'Thông báo');
        return false;
      }
      // tính tổng
      const tongmin = eval(congthucmin);
      const tongmax = eval(congthucmax);
      if (item.GiaSan !== 0) {
        if (tongmin > item.GiaSan) {
          item.GiaMin = tongmin;
        } else {
          item.GiaMin = item.GiaSan;
        }
        if (tongmax < item.GiaSan) {
          item.GiaMax = item.GiaSan;
        } else {
          item.GiaMax = tongmax;
        }
      } else {
        item.GiaMin = tongmin;
        item.GiaMax = tongmax;
      }
      
      this.options.TongGiaMax += item.GiaMax;
      this.options.TongGiaMin += item.GiaMin;
      // tắt modal
    });

    // tslint:disable
    this.listTCTGChuaChon_ = this.listTieuChiTinhGia_.filter(c => !this.listTCTGDaChon_.includes(c))
    this.tieuchiModal.hide();
    if (noti === 2) {
      this.toastr.success('Làm mới thành công!', 'Thông báo');
    }
  }
  // check list in modal
  toggleAllTieuChi(rowto, checked) {
    this.CheckLengthTieuChi = 0;
    rowto.forEach(function (value, key) {
      rowto[key].checked = !checked;
    });
    const listvitrual = this.listTCTGChuaChon_.filter(c => c.checked === true);
    this.CheckLengthTieuChi = listvitrual.length;
  }
  CheckedListTieuchi(checked) {
    const listvitrual = this.listTCTGChuaChon_.filter(c => c.checked === true);
    if (listvitrual.length === 1 || listvitrual.length === 0) {
      if (!checked === true) {
        this.CheckLengthTieuChi = 1;
      } else {
        this.CheckLengthTieuChi = 0;
      }
    }
    if (this.CheckLengthTieuChi === 0) {
      this.checkalltieuchi = false;
    }

  }


  // checked
  toggleAll(rowto, checked) {
    this.CheckLength = 0;
    rowto.forEach(function (value, key) {
      rowto[key].checked = !checked;
    });
    const listvitrual = this.listSanPhamDonHang_.filter(c => c.checked === true);
    this.CheckLength = listvitrual.length;
  }
  CheckedList(checked) {
    const listvitrual = this.listSanPhamDonHang_.filter(c => c.checked === true);
    if (listvitrual.length === 1 || listvitrual.length === 0) {
      if (!checked === true) {
        this.CheckLength = 1;
      } else {
        this.CheckLength = 0;
      }
    }
    if (this.CheckLength === 0) {
      this.checkall = false;
    }

  }


  // Tìm kiếm
  // Phân trang
  NextPage() {
    if (this.options.p < this.options.totalpage) {
      this.options.p++;
      this.R1GetListDonViTinh();
    }
  }

  PrevPage() {
    if (this.options.p > 1) {
      this.options.p--;
      this.R1GetListDonViTinh();
    }
  }

  // làm mới trang
  refreshData() {
    this.options.s = '';
    this.s.SearchRoot(this.options.s);
    this.options.p = 1;
    this.toastr.success('Tải lại trang thành công', 'Thông báo');
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.subscription1) {
      this.subscription1.unsubscribe();
    }
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
  }


}
