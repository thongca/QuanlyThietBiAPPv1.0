import { KhuvucmayService } from './../../danhmuc/khuvucmay/khuvucmay.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { BaocaotinhtrangthietbiService } from './baocaotinhtrangthietbi.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { Baocaotinhtrangthietbi, BaocaotinhtrangthietbiTB, BaocaotinhtrangthietbiPareto } from './baocaotinhtrangthietbi.model';
import { SearchService } from '../../../shared/search.service';
import { Thietbi } from '../../danhmuc/thietbi/thietbi';
import { UserInfoService } from '../../../shared/user-info.service';

@Component({
  selector: 'app-baocaotinhtrangthietbi',
  templateUrl: './baocaotinhtrangthietbi.component.html',
  styleUrls: ['./baocaotinhtrangthietbi.component.scss']
})
export class BaocaotinhtrangthietbiComponent implements OnInit, AfterViewInit, OnDestroy {
  options = {
    s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0, KhuVucID: '',
    _ThietbiID: '', DateStart: Date, DateEnd: Date, Typewhere: 0, NhaMayID: null
  };
  sub: Subscription;

  // arr total
  dataListbar: any[];
  lablesListbar: any[];
  // arr TB
  dataListbarTB: any[];
  lablesListbarTB: any[];
  // arr Pareto
  dataListbarPare: any[];
  lablesListbarPare: any[];
  lablesListLuyKe: any[];
  // List
  listSoGioDungMay_: Baocaotinhtrangthietbi[];
  listSoGioDungMayTB_: BaocaotinhtrangthietbiTB[];
  listSoGioDungMayPare_: BaocaotinhtrangthietbiPareto[];

  // boolean
  Active: boolean;

  @ViewChild('revenueLineChart') chart: ElementRef;
// list
listThietBi_: Thietbi[] = [];
  // barChart
  // total
  canvas: any;
  ctx: any;

  // Average
  canvasTB: any;
  ctxTB: any;

  // Average
  canvasPareto: any;
  ctxPareto: any;
  // tìm kiếm
  todos$ = this.s.$search;

  constructor(
    private baocaotinhtrangservice_: BaocaotinhtrangthietbiService,
    private spinnerService: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private s: SearchService,
    private khuvucmayservice_: KhuvucmayService,
    private _userInfo: UserInfoService
  ) {
    this.Active = false;
    this.options.NhaMayID = this._userInfo.R1_GetNhaMayID();
  }
  ngOnInit() {
    // tìm kiếm
    this.todos$.subscribe(res => {
      if (res === undefined || res === '') {
        this.options.s = '';
      } else {
        this.options.s = res;
      }
    });
    this.r1ListDuLieuDungMay();
    this.r1ListDuLieuTB2DungMay();
    this.r1ListPareto();
    this.R1GetListThietBi();
  }
      // danh sách thiet bi
      R1GetListThietBi() {
        const model_ = {NhaMayID: this._userInfo.R1_GetNhaMayID()};
        this.spinnerService.show();
        this.sub = this.khuvucmayservice_.r1Listthietbi(model_).subscribe(res => {
          this.spinnerService.hide();
          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          }
          this.listThietBi_ = res['data'];
          if (sessionStorage.getItem('ThietBiID') === null) {
            this.options._ThietbiID = this.listThietBi_[0].ThietBiID;
          }
        });
      }
  // list du lieuy bieu đồ báo cáo du lieu số giờ dừng máy
  r1ListDuLieuDungMay() {
    this.sub = this.baocaotinhtrangservice_.r1ListBCListTTGDungMay(this.options).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error('Lỗi khi tải dữ liệu các biểu đồ', 'Thông báo');
          return false;
        }
        if (res['data'] !== undefined) {
          const dataset = [];
          const arrlables = [];
          const data = res['data'];
          this.listSoGioDungMay_ = data;
          this.listSoGioDungMay_.forEach(function (item) {
            dataset.push(item.ThoiGianDung);
            arrlables.push(item.MaThietBi);
          });
          this.dataListbar = dataset;
          this.lablesListbar = arrlables;
        }
      }
    });
  }
  // list du lieuy bieu đồ báo cáo du lieu số giờ dừng máy
  r1ListDuLieuTB2DungMay() {
    this.sub = this.baocaotinhtrangservice_.r1ListBCListTTGTB(this.options).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error('Lỗi khi tải dữ liệu các biểu đồ', 'Thông báo');
          return false;
        }
        if (res['data'] !== undefined) {
          const datasetTB = [];
          const arrlablesTB = [];
          const data = res['data'];
          this.listSoGioDungMayTB_ = data;
          this.listSoGioDungMayTB_.forEach(function (item) {
            datasetTB.push(item.ThoiGianTB);
            arrlablesTB.push(item.MaThietBi);
          });
          this.dataListbarTB = datasetTB;
          this.lablesListbarTB = arrlablesTB;
        }
      }
    });
  }

  // list du lieuy bieu đồ báo cáo du lieu số giờ dừng máy
  r1ListPareto() {
    this.sub = this.baocaotinhtrangservice_.r1ListPareto(this.options).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error('Lỗi khi tải dữ liệu các biểu đồ', 'Thông báo');
          return false;
        }
        if (res['data'] !== undefined) {
          const dataset = [];
          const arrlables = [];
          const arrDataTyLe = [];
          const data = res['data'];
          const total = res['total'];
          this.listSoGioDungMayPare_ = data;
          for (let index = 1; index <= this.listSoGioDungMayPare_.length; index++) {
            let TyLeLuyKe = 0;
            for (let i = 0; i < index; i++) {
              TyLeLuyKe += ((this.listSoGioDungMayPare_[i].SoLoi) / total) * 100; // cứ mỗi lần thì lại tăng lên một row
            }
            arrDataTyLe.push(TyLeLuyKe);
          }
          this.listSoGioDungMayPare_.forEach(function (item) {
            dataset.push(item.SoLoi);
            arrlables.push(item.NguyenNhanTomTat);
          });
          this.lablesListLuyKe = arrDataTyLe;
          this.dataListbarPare = dataset;
          this.lablesListbarPare = arrlables;
        }
      }
    });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.barChartTotal();
      this.barChartTB();
      this.ParetoChartTB();
    }, 500);
  }
  barChartTotal() {
    if (this.dataListbar !== undefined) {
      this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    const myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.lablesListbar,
        datasets: [{
          label: 'Số giờ dừng máy (tính bằng giờ)',
          data: this.dataListbar,
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
  barChartTB() {
    if (this.dataListbarTB !== undefined) {
      this.canvasTB = document.getElementById('myChartbarTB');
    this.ctxTB = this.canvasTB.getContext('2d');
    const myChartbarTB = new Chart(this.ctxTB, {
      type: 'bar',
      data: {
        labels: this.lablesListbarTB,
        datasets: [{
          label: 'Số ngày trung bình giữa hai lần dừng',
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
  ParetoChartTB() {
    if (this.lablesListLuyKe !== undefined) {
      this.canvasPareto = document.getElementById('paretoChartbar');
    this.ctxPareto = this.canvasPareto.getContext('2d');
    const paretoChartbarTB = new Chart(this.ctxPareto, {
      type: 'bar',
      data: {
        labels: this.lablesListbarPare,
        datasets: [{
          data: this.lablesListLuyKe,
          label: 'Đường lũy tích nguyên nhân',
          type: 'line',
          borderWidth: 2,
          borderColor: '#007cff',
          yAxisID: 'y-axis-2',
          pointBorderWidth: 5,
          fill: false,
        }, {
          label: 'Số lỗi',
          data: this.dataListbarPare,
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
          borderWidth: 1,
          yAxisID: 'y-axis-1'
        }
        ]
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
              labelString: 'Số lỗi'
            }
          }, {
            type: 'linear',
            position: 'right',
            id: 'y-axis-2',
            ticks: {
              suggestedMin: 0,
              callback: function (value) {
                return value + '%';
              }
            },
            scaleLabel: {
              display: true,
              labelString: 'Lũy kế'
            }
          }]
        }
      }
    });
    }
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  Event(e) {
    if (e.target.closest('.select-tieuchi') === null) {
      this.Active = false;
    }
  }
  // làm mới trang
  refreshData() {
    this.options.s = '';
    this.s.SearchRoot(this.options.s);
    this.options.p = 1;
    this.toastr.success('Tải lại trang thành công', 'Thông báo');
  }
}
