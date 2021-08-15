import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScratchService {

  constructor(private _http: HttpClient) { }

  getData(option: string) {
    console.log(option);
  }
}
