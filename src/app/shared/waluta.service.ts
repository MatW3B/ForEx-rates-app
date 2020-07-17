import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { map, concatMap } from 'rxjs/operators';


import { WalutaInitialModel } from '../models/waluta-model';
import { WalutaModel, inRates } from '../models/waluta-model';
import { Observable, Subject, from } from 'rxjs';

import { DateService } from "./date.service";

@Injectable({
  providedIn: 'root'
})
export class WalutaService {
  private walutaBaseUrl = 'http://api.nbp.pl/api/exchangerates/rates/a/';
  private walutaReqDataSource = new Subject<WalutaModel>();
  private waluta: string;
  walutaReqData$ = this.walutaReqDataSource.asObservable();

  constructor(private http: HttpClient,private dateServ: DateService) { }

  shareWalutaReqData(walutaReqData: WalutaModel): void {
    this.walutaReqDataSource.next(walutaReqData);   
  }

  NBPhttpRequest(dates:Array<Date>){
    var walutaUrl = this.walutaBaseUrl.concat(this.waluta,'/'
    ,formatDate(dates[0],"yyyy-MM-dd",'en'),'/'
    ,formatDate(dates[1],"yyyy-MM-dd",'en'),'/?format=json');

    return this.http.get(walutaUrl);
  }

  getKursWaluty(dataOd: Date, dataDo: Date, waluta: string) {
    // spearate date to make multiple requests
    this.waluta = waluta;
    var dataArray = this.dateServ.dateFragmentate(dataOd,dataDo);  
    
    console.log('GetKurs');
    return from(dataArray)
    .pipe(concatMap(date => this.NBPhttpRequest(date))
      ,map((data: WalutaInitialModel) => data.rates
      .map((data:inRates) => ({date: `${data.effectiveDate}`, mid: `${data.mid}`}))
    ));
  }

}
