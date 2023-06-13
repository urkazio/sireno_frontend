import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private data: any = {};

  constructor() {}

  setData(key: string, value: any) {
    this.data[key] = value;
  }

  getData(key: string) {
    return this.data[key];
  }
}
