import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { WalutaInitialModel } from '../models/waluta-model';
import { WalutaModel, inRates } from '../models/waluta-model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalutaService {
  private walutaBaseUrl = 'http://api.nbp.pl/api/exchangerates/rates/a/';
  private walutaUrl = '';
  private dataOd: string;
  private dataDo: string;
  private waluta: string;
  myObservable: any;

  private walutaReqDataSource = new Subject<WalutaModel>();
  walutaReqData$ = this.walutaReqDataSource.asObservable();

  constructor(private http: HttpClient) { }


  shareWalutaReqData(walutaReqData: WalutaModel): void {
    this.walutaReqDataSource.next(walutaReqData);   
    console.log(walutaReqData.dataDo);
  }

  getKursWaluty(dataOd: string, dataDo: string, waluta: string) {
    this.walutaUrl = this.walutaBaseUrl.concat(waluta,'/',dataOd,'/',dataDo,'/?format=json');
    console.log('GetKurs');
    return this.http.get(this.walutaUrl)
    .pipe(map((data: WalutaInitialModel) => data.rates
      .map((data:inRates) => ({date: `${data.effectiveDate}`, mid: `${data.mid}`}))
    ));
  }

  
}
