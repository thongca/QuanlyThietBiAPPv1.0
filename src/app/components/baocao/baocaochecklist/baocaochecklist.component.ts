import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { BaocaochecklistService } from './baocaochecklist.service';
import { Chart } from 'chart.js';
import { DatePipe } from '@angular/common';
import * as $ from 'jquery';
import { Thietbi } from '../../danhmuc/thietbi/thietbi';
import { KhuvucmayService } from '../../danhmuc/khuvucmay/khuvucmay.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserInfoService } from '../../../shared/user-info.service';
import { NhamayrootService } from '../../../shared/nhamayroot.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { viLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap';
import { SearchService } from '../../../shared/search.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
defineLocale('vi', viLocale);
@Component({
  selector: 'app-baocaochecklist',
  templateUrl: './baocaochecklist.component.html',
  styleUrls: ['./baocaochecklist.component.scss']
})
export class BaocaochecklistComponent implements OnInit, OnDestroy, AfterViewInit {
  date: Date = new Date();
  options = {
    s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0, KhuVucID: '',
    _ThietbiID: '', DateStart: Date, DateEnd: Date, Typewhere: 0, NhaMayID: null, IsTime: this.date
  };
// List danh sách 15 thiết bị lỗi nhiều nhất trong tháng
list15Deviceerror_: {
  KetQua: number;
  MaThietBi: string;
  NeedRepair: boolean;
}[];
private unsubscribe: Subject<void> = new Subject();
  //
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
  listThietBi_: Thietbi[] = [];
  public Active: boolean;
  isLoad: boolean; // khi co dữ liệu mới được load html
  isReport: boolean; // xem báo cáo
  // arr TB
  dataListbarTB: any[];
  lablesListbarTB: any[];
    // Average
    canvasTB: any;
    ctxTB: any;
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
    private _userInfo: UserInfoService,
    private datelageService: BsLocaleService,
    private nhaMaySevice_: NhamayrootService,
    private datepipe: DatePipe,
    private s: SearchService,
  ) {
    this.options.NhaMayID = this._userInfo.R1_GetNhaMayID();
    this.Active = false;
    this.isLoad = false;
    this.isReport = false;
    this.datelageService.use('vi');
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
  // nhà máy
  nhaMayID$ = this.nhaMaySevice_.$nhaMayID;
  // search
  todos$ = this.s.$search;
  ngOnInit() {
    this.options.Typewhere = 3;
    const data = [{ Typewhere: 1, Name: 'Xem trong ngày' },
    { Typewhere: 2, Name: 'Xem trong tuần' },
    { Typewhere: 3, Name: 'Xem trong tháng' },
    { Typewhere: 4, Name: 'Xem trong năm' }];
    this.ListType = data;
    this.options._ThietbiID = sessionStorage.getItem('ThietBiID');
    this.R1GetListThietBi();
    this.nhaMayID$.subscribe(res => {
      if (res !== undefined) {
    this.R1GetListThietBi();
    this.R1GetListBaoCaoDetail();
      }
    });
    this.todos$.subscribe(res => {
      if (res === undefined || res === '') {
        this.options.s = '';
        this.R1GetListBaoCaoDetail();
      } else {
        this.options.s = res;
        this.R1GetListBaoCaoDetail();
      }
    });
  }
  // list du lieuy bieu đồ báo cáo du lieu máy hong nhiều
  r1ListDuLieuMayHongNhieu() {
    this.baocaocheckService_.r1ListBaocaolistHong(this.options).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error('Lỗi khi tải dữ liệu các biểu đồ', 'Thông báo');
          return false;
        }
        if (res['data'] !== undefined) {
          const datasetTB = [];
          const arrlablesTB = [];
          const data = res['data'];
          this.list15Deviceerror_ = data;
          this.list15Deviceerror_.forEach(function (item) {
            datasetTB.push(item.KetQua);
            arrlablesTB.push(item.MaThietBi);
          });
          this.dataListbarTB = datasetTB;
          this.lablesListbarTB = arrlablesTB;
      }
    }
    });
  }


  // list du lieuy bieu đồ báo cáo trong tháng
  r1ListDuLieuBieuDo() {
   this.baocaocheckService_.r1ListBaocaochecklist(this.options).subscribe(res => {
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
          }, 200);
          this.pieChartData = data;
        }
      }
    });
  }

  // list du lieuy bieu đồ báo cáo trong năm
  r1ListDuLieuNam() {
    this.baocaocheckService_.r1ListBaocaochecklistMotNam(this.options).subscribe(res => {
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
          }, 200);
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
    this.options.NhaMayID = Number(localStorage.getItem('NhaMayID'));
    this.spinnerService.show();
    this.khuvucmayservice_.r1Listthietbi(this.options).subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      const data = res['data'];
      if (data !== undefined) {
        if (data.length === 0) {
          this.options._ThietbiID = '';
        } else if (this.options._ThietbiID === '') {
          this.options._ThietbiID = data[0].ThietBiID;
        }
        if (sessionStorage.getItem('ThietBiID') === null) {
          this.options._ThietbiID = data[0].ThietBiID;
        }
      }
      this.listThietBi_ = data;
      this.r1ListDuLieuBieuDo();
      this.r1ListDuLieuNam();
      this.r1ListDuLieuMayHongNhieu();
      this.R1GetListBaoCaoDetail();
      this.ShowChart();
    });
  }

    // danh sách Báo cáo bảng kiểm tra máy định kỳ
    R1GetListBaoCaoDetail() {
      this.spinnerService.show();
      this.baocaocheckService_.r1ListBaocaoDetail(this.options)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.spinnerService.hide();
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo lỗi');
          return false;
        }
        this.listBaoCao_ = res['data'];
        this.objThietBi = res['ThietBi'];
      });
    }



ShowChart() {
  setTimeout(() => {
    this.barChartTB();
  }, 500);
}

    barChartTB() {
      if (this.dataListbarTB !== undefined) {
        this.canvasTB = document.getElementById('myChartbarTB');
      this.ctxTB = this.canvasTB.getContext('2d');
      const myChartbarTB = new Chart(this.ctxTB, {
        type: 'bar',
        data: {
          labels: this.lablesListbarTB,
          datasets: [{
            label: 'Số lỗi',
            data: this.dataListbarTB,
            backgroundColor: [
              '#FF0F00',
              '#FF6600',
              '#FF9E01',
              '#FCD202',
              '#F8FF01',
              '#B0DE09',
              '#04D215',
              '#0D8ECF',
              '#0D52D1',
              '#2A0CD0',
              '#8A0CCF',
              '#CD0D74',
              '#754DEB',
              '#DDDDDD',
              '#999999',
              '#333333',
              '#000000',
              '#000000',
              '#000000',
              '#000000',
              '#000000',
              '#000000',
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              type: 'linear',
              position: 'left',
              id: 'y-axis-1',
              stacked: true,
              ticks: {
                suggestedMin: 0
              },
              scaleLabel: {
                display: true,
              }
            }]
          }
        }
      });
      }
    }
InBaoCao() {
      setTimeout(() => {
        $('#btnprint').click();
       }, 50);
    }
  XemBieuDo() {
    this.isReport = false;
    this.ShowChart();
  }
  XemBaoCao() {
    this.isReport = true;
  }
  ThucHien() {
    this.r1ListDuLieuBieuDo();
    this.r1ListDuLieuNam();
    this.R1GetListBaoCaoDetail();
  }
  ChangeThang(IsTime) {
    const dateopt = this.datepipe.transform(IsTime, 'yyyy-MM-dd');
    this.options.IsTime = new Date(dateopt);
    this.R1GetListBaoCaoDetail();
  }
  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
   }
  Event(e) {
    if (e.target.closest('.select-tieuchi') === null) {
      this.Active = false;
    }
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.barChartTB();
    }, 500);
  }
}
