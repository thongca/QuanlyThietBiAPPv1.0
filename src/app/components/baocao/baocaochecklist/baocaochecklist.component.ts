import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaocaochecklistService } from './baocaochecklist.service';
import { ChartType, ChartOptions } from 'chart.js';
import * as $ from 'jquery';
import { Thietbi } from '../../danhmuc/thietbi/thietbi';
import { KhuvucmayService } from '../../danhmuc/khuvucmay/khuvucmay.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-baocaochecklist',
  templateUrl: './baocaochecklist.component.html',
  styleUrls: ['./baocaochecklist.component.scss']
})
export class BaocaochecklistComponent implements OnInit, OnDestroy {
  options = {
    s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0, KhuVucID: '',
    _ThietbiID: '', DateStart: Date, DateEnd: Date, Typewhere: 0
  };
  ListType:
    {
      Typewhere: number,
      Name: string
    }[];
    // khai báo list tháng
    ListThang_: {
      Month: number
    }[];
    // khai báo data một năm
    ListDataMotNam_: {
      Good: boolean;
      NeedRepair: boolean;
      Month: number,
      KetQua: number
    }[];
  sub: Subscription;
  listThietBi_: Thietbi[] = [];
  public Active: boolean;
  isLoad: boolean; // khi co dữ liệu mới được load html
  isReport: boolean; // xem báo cáo

// list báo cáo detail
listBaoCao_: [];
objThietBi: {};

// biểu đồ
  listDataPie_: {
    Good: boolean;
    NeedRepair: boolean;
    KetQua: number
  }[] = [];

  // list may hỏng nhiều nhất

  listMay: {
    MaThietBi: string;
    KetQua: number;
    NeedRepair: boolean;
  }[];
  constructor(
    private baocaocheckService_: BaocaochecklistService,
    private khuvucmayservice_: KhuvucmayService,
    private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
  ) {
    this.Active = false;
    this.isLoad = false;
    this.isReport = false;
  }
// bar chart mot cot
public barChartOptions1st: any = {
  scaleShowVerticalLines: false,
  responsive: true
};
public barChartColors1st = [
  {backgroundColor: 'red'},
];
public barChartLabels1st: string[] = [];
public barChartType1st = 'bar';
public barChartLegend1st = true;
public barChartData1st: any[] = [
];
    // barChart
    public barChartOptions: any = {
      scaleShowVerticalLines: false,
      responsive: true
    };
    public barChartColors = [];
    public barChartLabels: string[] = [];
    public barChartType = 'bar';
    public barChartLegend = true;
    public barChartData: any[] = [];

  // Pie
  public pieChartColors = [{ backgroundColor: [] }];
  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartType = 'pie';

  ngOnInit() {
    this.options.Typewhere = 3;
    const data = [{ Typewhere: 1, Name: 'Xem trong ngày' },
    { Typewhere: 2, Name: 'Xem trong tuần' },
    { Typewhere: 3, Name: 'Xem trong tháng' },
    { Typewhere: 4, Name: 'Xem trong năm' }];
    this.ListType = data;
    this.options._ThietbiID = sessionStorage.getItem('ThietBiID');
    this.R1GetListThietBi();
  }
  // list du lieuy bieu đồ báo cáo du lieu máy hong nhiều
  r1ListDuLieuMayHongNhieu() {
    this.sub = this.baocaocheckService_.r1ListBaocaolistHong(this.options).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error('Lỗi khi tải dữ liệu các biểu đồ', 'Thông báo');
          return false;
        }
        if (res['data'] !== undefined) {
          const data = [];
        const lablestring = [];
        const bgColor = [];
        this.listMay = res['data'];
        this.listMay.forEach(function (item) {
          lablestring.push(item.MaThietBi);
          data.push(item.KetQua);
        });
        setTimeout(() => {
          this.barChartLabels1st = lablestring;
        }, 50);
        const k = {data: data, label: 'Số lỗi'};
        this.barChartData1st.push(k);
        }
      }
    });
  }

  // list du lieuy bieu đồ báo cáo trong tháng
  r1ListDuLieuBieuDo() {
    this.sub = this.baocaocheckService_.r1ListBaocaochecklist(this.options).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error('Lỗi khi tải dữ liệu các biểu đồ', 'Thông báo');
          return false;
        }
        if (res['data'] !== undefined) {
          const data = [];
          const lablestring = [];
          const bgColor = [];
          let KQ = null;
          this.listDataPie_ = res['data'];
          this.listDataPie_.forEach(function (item) {
            if (item.Good === false && item.NeedRepair === false) {
              lablestring.push('Chưa kiểm tra');
              bgColor.push('#ff8100');
            }
            if (item.Good === true && item.NeedRepair === false) {
              lablestring.push('Tốt');
              bgColor.push('#20a8d8');
            }
            if (item.Good === false && item.NeedRepair === true) {
              lablestring.push('Cần sửa chữa');
              bgColor.push('red');
            }
            data.push(item.KetQua);
            KQ += item.KetQua;
          });
          if (KQ < res['total']) {
            data.push((res['total'] - KQ));
            lablestring.push('Chưa kiểm tra');
            bgColor.push('#ff8100');
          }
          this.pieChartColors[0].backgroundColor = bgColor;
          setTimeout(() => {
            this.pieChartLabels = lablestring;
          }, 50);
          this.pieChartData = data;
        }
      }
    });
  }

  // list du lieuy bieu đồ báo cáo trong năm
  r1ListDuLieuNam() {
    this.sub = this.baocaocheckService_.r1ListBaocaochecklistMotNam(this.options).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error('Lỗi khi tải dữ liệu các biểu đồ 1', 'Thông báo');
          return false;
        }
        if (res['data'] !== undefined) {
          const listThang_ = [];
          const datackt_ = [];
          const datat_ = [];
          const datacsc_ = [];
          const dataAvckt_ = [];
          const dataAvt_ = [];
          const dataAvcsc_ = [];
          let bgColor = [];
          this.ListThang_ = res['dataMonth'];
          this.ListThang_.forEach( function(item) {
            listThang_.push(`Tháng ${item.Month}`);
          });
          this.ListDataMotNam_ = res['data'];
          this.ListDataMotNam_.forEach( function(c) {
            if (c.Good === false && c.NeedRepair === false) { // chưa check gì
              listThang_.forEach( function(item) {
                if (item === `Tháng ${c.Month}`) {
                  datackt_.push(c.KetQua);
                }
              });
            }
            if (c.Good === true && c.NeedRepair === false) {// Tốt
              listThang_.forEach( function(item) {
                if (item === `Tháng ${c.Month}`) {
                  datat_.push(c.KetQua);
                }
              });
            }
            if (c.Good === false && c.NeedRepair === true) {// cần sửa chữa
              listThang_.forEach( function(item) {
                if (item === `Tháng ${c.Month}`) {
                  datacsc_.push(c.KetQua);
                  bgColor.push({backgroundColor: 'red'});
                }
              });
            }
          });
          bgColor = [{backgroundColor: '#ff8100'}, {backgroundColor: '#20a8d8'}, {backgroundColor: 'red'}];
          this.barChartColors = bgColor;
          dataAvckt_.push({data: datackt_, label: 'Chưa kiểm tra'});
          dataAvt_.push({data: datat_, label: 'Tốt'});
          dataAvcsc_.push({data: datacsc_, label: 'Cần sửa chữa'});
          const k = [];
          k.push(dataAvckt_[0]);
          k.push(dataAvt_[0]);
          k.push(dataAvcsc_[0]);
          setTimeout(() => {
            this.barChartLabels = listThang_;
          }, 50);
          this.barChartData = k;
          if (this.barChartData.length > 0) {
            this.isLoad = true;
          }
        }
      }
    });
  }
  // danh sách thiet bi
  R1GetListThietBi() {
    this.spinnerService.show();
    this.sub = this.khuvucmayservice_.r1Listthietbi().subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.listThietBi_ = res['data'];
      if (sessionStorage.getItem('ThietBiID') === null) {
        this.options._ThietbiID = this.listThietBi_[0].ThietBiID;
      }
      this.r1ListDuLieuBieuDo();
      this.r1ListDuLieuNam();
      this.r1ListDuLieuMayHongNhieu();
      this.R1GetListBaoCaoDetail();
    });
  }

    // danh sách Báo cáo bảng kiểm tra máy định kỳ
    R1GetListBaoCaoDetail() {
      this.spinnerService.show();
      this.sub = this.baocaocheckService_.r1ListBaocaoDetail(this.options).subscribe(res => {
        this.spinnerService.hide();
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo lỗi');
          return false;
        }
        this.listBaoCao_ = res['data'];
        this.objThietBi = res['ThietBi'];
      });
    }
InBaoCao() {
      setTimeout(() => {
        $('#btnprint').click();
       }, 50);
    }
  XemBieuDo() {
    this.isReport = false;
  }
  XemBaoCao() {
    this.isReport = true;
  }
  ThucHien() {
    this.r1ListDuLieuBieuDo();
    this.r1ListDuLieuNam();
    this.R1GetListBaoCaoDetail();
  }
  Event(e) {
    if (e.target.closest('.select-tieuchi') === null) {
      this.Active = false;
    }
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
