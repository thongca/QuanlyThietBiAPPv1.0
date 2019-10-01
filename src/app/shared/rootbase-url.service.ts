import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RootbaseUrlService {
public sbaseURL: string;
  constructor() {
    this.sbaseURL = 'http://172.16.11.54:49944';
   }
}
