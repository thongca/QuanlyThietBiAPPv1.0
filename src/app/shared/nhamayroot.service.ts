import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
const _NhaMayID = '';
@Injectable({
  providedIn: 'root'
})
export class NhamayrootService {
  public NhaMayID = new BehaviorSubject(_NhaMayID);
  $nhaMayID: Observable<any> = this.NhaMayID.asObservable();
  constructor() { }
  NhaMaySer(s: string) {
    this.NhaMayID.next(s);
  }
}
