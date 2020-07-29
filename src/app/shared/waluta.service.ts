import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { map, concatMap } from 'rxjs/operators';

import { WalutaInitialModel, WalutaDataModel, longestPeriod } from '../models/waluta-model';
import { WalutaModel, inRates } from '../models/waluta-model';
import { Subject, from } from 'rxjs';

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

  longestPeriodOfNondecreasingRate(ratesData: Array<WalutaDataModel>): longestPeriod {
    let longestPeriod: longestPeriod = {
      length: 0, 
      dateStart: ratesData[0].effectiveDate, 
      dateStop: ratesData[0].effectiveDate,
    }
    let dateStart = ratesData[0].effectiveDate; 
    let dateStop = ratesData[0].effectiveDate;
    
    let counterPeriod: number = 0;
    for (let i = 1; i < ratesData.length; i++){
      if (ratesData[i].mid < ratesData[i-1].mid) {
        dateStop = ratesData[i].effectiveDate;
        if (counterPeriod > longestPeriod.length) {
          longestPeriod.dateStart = dateStart;
          longestPeriod.dateStop = dateStop;
          longestPeriod.length = counterPeriod;
        }
        dateStart = ratesData[i].effectiveDate;
        counterPeriod = 0;
      }
      counterPeriod += 1;  
    }
    //if the date didnt change bind ending date
    if (longestPeriod.dateStart == longestPeriod.dateStop) { 
      longestPeriod.dateStop = ratesData[ratesData.length-1].effectiveDate 
    }
    return longestPeriod
  }

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
    this.waluta = waluta;
    var dataArray = this.dateServ.dateFragmentate(dataOd,dataDo);  
    
    console.log('GetKurs');
    return from(dataArray)
    .pipe(concatMap(date => this.NBPhttpRequest(date))
      ,map((data: WalutaInitialModel) => data.rates
      .map((data:inRates) => ({effectiveDate: new Date(`${data.effectiveDate}`), mid: `${data.mid}`}))
    ));
  }

}
