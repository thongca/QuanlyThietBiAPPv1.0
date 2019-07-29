import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RootbaseUrlService {
public sbaseURL: string;
  constructor() {
    this.sbaseURL = 'http://localhost:49944';
   }
}
