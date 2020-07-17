import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { WalutaModel, WalutaDataModel, longestPeriod } from '../models/waluta-model';
import { WalutaService } from "../shared/waluta.service";
import { DateService } from "../shared/date.service";

import * as d3 from "d3";

@Component({
  selector: 'app-wykres-waluta',
  templateUrl: './wykres-waluta.component.html',
  styleUrls: ['./wykres-waluta.component.css'],
})
export class WykresWalutaComponent implements OnInit {
  walutaData: any;
  walutaReqData: WalutaModel;
  subscription: Subscription;
  longestPeriodObj: longestPeriod;
  periodDateStart: Date;
  periodDateEnd: Date;
  currencyName: string;
  dateStart: Date;
  dateStop: Date;

  constructor(private walutaService: WalutaService, private dateServ: DateService) { }

  ngOnInit(): void {  
    this.subscription = this.walutaService.walutaReqData$.subscribe(walutaReqData =>{
      this.walutaData = [];
      this.currencyName = walutaReqData.nazwa, this.dateStart = walutaReqData.dataOd, this.dateStop = walutaReqData.dataDo;
      this.walutaService.getKursWaluty(this.dateStart, this.dateStop, this.currencyName)
      .subscribe((data: any) => {this.walutaData.push(...data)},
        (err) => console.log(err),
        () => { //complete subscription
          this.longestPeriodObj = this.walutaService.longestPeriodOfNondecreasingRate(this.walutaData)
          console.log(this.longestPeriodObj);
        
        }
      );
    });
  }

}
