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
  private walutaBaseUrl = 'https://api.nbp.pl/api/exchangerates/rates/a/';
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
      if (ratesData[i-1].mid <= ratesData[i].mid) {
        if (counterPeriod == 0) {
          dateStart = ratesData[i-1].effectiveDate;
        }
        dateStop = ratesData[i].effectiveDate;
        counterPeriod +=1;
        if ( counterPeriod > longestPeriod.length 
        && this.dateServ.dateDifference(dateStart,dateStop,true) >= this.dateServ.dateDifference(longestPeriod.dateStart,longestPeriod.dateStop,true)){
          longestPeriod.dateStart = dateStart;
          longestPeriod.dateStop = dateStop;
          longestPeriod.length = counterPeriod;
        }
      } else {
        counterPeriod = 0;
      } 
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
    
    return from(dataArray)
    .pipe(concatMap(date => this.NBPhttpRequest(date))
      ,map((data: WalutaInitialModel) => data.rates
      .map((data:inRates) => ({effectiveDate: new Date(`${data.effectiveDate}`), mid: `${data.mid}`}))
    ));
  }

}
