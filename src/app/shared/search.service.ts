import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
const _sData = '';
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public DataSearch = new BehaviorSubject(_sData);
  $search: Observable<any> = this.DataSearch.asObservable();
  constructor() {
  }

  SearchRoot(s: string) {
     this.DataSearch.next(s);
  }
}
